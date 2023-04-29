/* eslint-disable @typescript-eslint/no-explicit-any */
// Thanks to GaryAustin here for reconnect --> https://github.com/supabase/supabase/discussions/5641#discussioncomment-2292166

import type { SupabaseClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type Payload = RealtimePostgresChangesPayload<{ [key: string]: any; }>;

export interface SupaSnap<T> {
    data: T[];
    payload: Payload;
};

export interface SupaSingleSnap<T> {
    data: T;
    payload: Payload;
};

type SubscribeInput = { table: string, field?: string, value?: string | string[], single?: boolean, filterName?: FilterNames };

// filter types
const _filterNames = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in'] as const;
type FilterNames = typeof _filterNames[number];

type Single<T> = (callback: (snap: SupaSingleSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;

export const realtime = <T>(supabase: SupabaseClient, { schema = "public", idField = 'id', limit = 100 } = {}) => {
    const items: any[] = [];

    const _subscribe = ({ table, field, value, single = false, filterName }: SubscribeInput) => {

        const hasFilter = field && value && filterName;
        let filterString = `${field}=${filterName}.${value}`;
        if (filterName === 'in') {
            if (!Array.isArray(value)) throw new Error('Filter value must be an array when using "in"')
            filterString = `${field}=${filterName}.(${value.join(',')})`
        }
        const filterChannel = hasFilter ? ':' + filterString : '';
        const filter = hasFilter ? filterString : undefined;

        // create the callback function
        return (callback: (snap: SupaSnap<T>) => void) => {

            // get the original data
            const initialize = () => {
                let select = supabase.from(table).select('*');
                select = hasFilter ? select[filterName](field, value as unknown as unknown[]) : select;

                // match subscription input, with limit
                select.limit(limit).then(({ data, error }) => {
                    if (data) items.push(...data);
                    callback({
                        data: data ? single ? data[0] : data : [],
                        payload: {
                            schema,
                            table,
                            errors: error
                        } as unknown as Payload
                    });
                });
            };

            // hanlde mutations
            const realtimeEvents = (payload: Payload) => {
                switch (payload.eventType) {
                    case 'INSERT': {
                        items.push(payload.new);
                        break;
                    }
                    case 'DELETE': {
                        const i = items.findIndex(r => r[idField] === payload.old[idField]);
                        if (i !== -1) items.splice(i, 1);
                        break;
                    }
                    case 'UPDATE': {
                        const i = items.findIndex(r => r[idField] === payload.old[idField]);
                        if (i !== -1) items.splice(i, 1, payload.new);
                        break;
                    }
                }
            }

            // grab value changes
            const channel = supabase.channel(schema + ':' + table + filterChannel)
                .on('postgres_changes', { event: '*', schema, table, filter }, (payload) => {
                    realtimeEvents(payload);
                    // return ALL data with payload
                    return callback({ data: single ? items[0] : items, payload });
                }).subscribe((status) => {
                    if (status === "CHANNEL_ERROR") {
                        supabase.removeChannel(channel);
                    } else if (status === 'SUBSCRIBED') {
                        initialize();
                    }
                });
            return () => supabase.removeChannel(channel);
        }
    }
    return {
        from: (table: string) => {

            // create filter functions      
            const createFilterFunc = (f: FilterNames) =>
                (field: string, value: any) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: f }) as Single<T>
                            }
                        },
                        subscribe: _subscribe({ table, field, value, filterName: f })
                    }
                };
            return {
                subscribe: _subscribe({ table }),
                eq: createFilterFunc('eq'),
                neq: createFilterFunc('neq'),
                gt: createFilterFunc('gt'),
                gte: createFilterFunc('gte'),
                lt: createFilterFunc('lt'),
                lte: createFilterFunc('lte'),
                in: createFilterFunc('in')
            }
        }
    }
};
