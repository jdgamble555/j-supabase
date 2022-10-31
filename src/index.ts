/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Session, User, SupabaseClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js"

export interface SupaSnap<T> {
    data: T[]
    payload: RealtimePostgresChangesPayload<{
        [key: string]: any;
    }>
}

export const realtime = <T>(supabase: SupabaseClient, { schema = "public", idField = 'id' } = {}) => {
    const items: any[] = [];

    const _subscribe = (table: string, field?: string, value?: string, single = false) => {
        const hasFilter = field && value;
        const filterString = `${field}=eq.${value}`;
        const filterChannel = hasFilter ? ':' + filterString : '';
        const filter = hasFilter ? filterString : undefined;

        // create the callback function
        return (callback: (snap: SupaSnap<T>) => void) => {
            let select = supabase.from(table).select('*');
            select = hasFilter ? select.eq(field, value) : select;

            // grab current value
            select.then(({ data, error }) => {
                if (data) items.push(...data);
                callback({
                    data: data ?? [],
                    payload: {
                        schema,
                        table,
                        errors: error
                    } as any as RealtimePostgresChangesPayload<{
                        [key: string]: any;
                    }>
                });
            });

            // grab value changes
            const channel = supabase.channel(schema + ':' + table + filterChannel)
                .on('postgres_changes', { event: '*', schema, table, filter }, (payload) => {
                    const e = payload.eventType;
                    switch (e) {
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

                    // return ALL data with payload
                    return callback({ data: single ? items[0] : items, payload });
                }).subscribe();
            return () => supabase.removeChannel(channel);
        }
    }
    return {
        from: (table: string) => {
            return {
                subscribe: _subscribe(table),
                eq: (field: string, value: any) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe(table, field, value, true)
                            }
                        },
                        subscribe: _subscribe(table, field, value)
                    }
                }
            }
        }
    }
};

export const authSession = (supabase: SupabaseClient) => {
    return {
        subscribe: (func: (session: Session | null) => void) => {
            supabase.auth.getSession()
                .then((data) => func(data.data.session ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) =>
                func(session ?? null)
            );
            return auth.data.subscription.unsubscribe;
        }
    }
}

export const authUser = (supabase: SupabaseClient) => {
    return {
        subscribe: (func: (user: User | null) => void) => {
            supabase.auth.getSession()
                .then((data) => func(data.data.session?.user ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) =>
                func(session?.user ?? null)
            );
            return auth.data.subscription.unsubscribe;
        }
    }
}

// range - calcuate pagination

export const range = ({ page = 1, size = 3 }: { page: number, size: number }) => {
    const from = (page - 1) * size;
    const to = from + size - 1;
    return { from, to };
}

//
// encode - decode functions for UUID better URLS
//

const DASH_REGEXP = /-/g
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const BASE = BigInt(BASE58.length)
const ONE = BigInt(1)
const ZERO = BigInt(0)
const UUID_INDEXES = [0, 8, 12, 16, 20]

// https://github.com/sagefy/uuid58

export const encode = (uuid: string) => {
    try {
        let b = BigInt('0x' + uuid.replace(DASH_REGEXP, ''))
        let u58 = ''
        do {
            u58 = BASE58[b % BASE as any] + u58
            b = b / BASE
        } while (b > 0)
        return u58
    } catch (e) {
        return uuid
    }
}

export const decode = (uuid58: string) => {
    try {
        const parts = Array.from(uuid58).map(x => BASE58.indexOf(x))
        if (parts.some(inc => inc < 0)) return uuid58
        const max = uuid58.length - 1
        const b = parts.reduce(
            (acc, inc, pos) => (acc + BigInt(inc)) * (pos < max ? BASE : ONE),
            ZERO
        )
        const hex = b.toString(16).padStart(32, '0')
        return UUID_INDEXES.map((p, i, a) => hex.substring(p, a[i + 1])).join('-')
    } catch (e) {
        return uuid58
    }
}
