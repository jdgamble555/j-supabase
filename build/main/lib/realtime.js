"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// Thanks to GaryAustin here for reconnect --> https://github.com/supabase/supabase/discussions/5641#discussioncomment-2292166
Object.defineProperty(exports, "__esModule", { value: true });
exports.realtime = void 0;
;
;
// filter types
const _filterNames = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in'];
const realtime = (supabase, { schema = "public", idField = 'id', limit = 100 } = {}) => {
    const items = [];
    const _subscribe = ({ table, field, value, single = false, filterName }) => {
        const hasFilter = field && value && filterName;
        const filterString = `${field}=${filterName}.${value}`;
        const filterChannel = hasFilter ? ':' + filterString : '';
        const filter = hasFilter ? filterString : undefined;
        // create the callback function
        return (callback) => {
            // get the original data
            const initialize = () => {
                let select = supabase.from(table).select('*');
                select = hasFilter ? select[filterName](field, value) : select;
                // match subscription input, with limit
                select.limit(limit).then(({ data, error }) => {
                    if (data)
                        items.push(...data);
                    callback({
                        data: data ? single ? data[0] : data : [],
                        payload: {
                            schema,
                            table,
                            errors: error
                        }
                    });
                });
            };
            // hanlde mutations
            const realtimeEvents = (payload) => {
                switch (payload.eventType) {
                    case 'INSERT': {
                        items.push(payload.new);
                        break;
                    }
                    case 'DELETE': {
                        const i = items.findIndex(r => r[idField] === payload.old[idField]);
                        if (i !== -1)
                            items.splice(i, 1);
                        break;
                    }
                    case 'UPDATE': {
                        const i = items.findIndex(r => r[idField] === payload.old[idField]);
                        if (i !== -1)
                            items.splice(i, 1, payload.new);
                        break;
                    }
                }
            };
            // grab value changes
            const channel = supabase.channel(schema + ':' + table + filterChannel)
                .on('postgres_changes', { event: '*', schema, table, filter }, (payload) => {
                realtimeEvents(payload);
                // return ALL data with payload
                return callback({ data: single ? items[0] : items, payload });
            }).subscribe((status) => {
                if (status === "CHANNEL_ERROR") {
                    supabase.removeChannel(channel);
                }
                else if (status === 'SUBSCRIBED') {
                    initialize();
                }
            });
            return () => supabase.removeChannel(channel);
        };
    };
    return {
        from: (table) => {
            // create filter functions      
            const createFilterFunc = (f) => (field, value) => {
                return {
                    single: () => {
                        return {
                            subscribe: _subscribe({ table, field, value, single: true, filterName: f })
                        };
                    },
                    subscribe: _subscribe({ table, field, value, filterName: f })
                };
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
            };
        }
    };
};
exports.realtime = realtime;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbHRpbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JlYWx0aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1REFBdUQ7QUFDdkQsOEhBQThIOzs7QUFTN0gsQ0FBQztBQUtELENBQUM7QUFJRixlQUFlO0FBQ2YsTUFBTSxZQUFZLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQVUsQ0FBQztBQUtyRSxNQUFNLFFBQVEsR0FBRyxDQUFJLFFBQXdCLEVBQUUsRUFBRSxNQUFNLEdBQUcsUUFBUSxFQUFFLE9BQU8sR0FBRyxJQUFJLEVBQUUsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQzdHLE1BQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQztJQUV4QixNQUFNLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxVQUFVLEVBQWtCLEVBQUUsRUFBRTtRQUV2RixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksS0FBSyxJQUFJLFVBQVUsQ0FBQztRQUMvQyxNQUFNLFlBQVksR0FBRyxHQUFHLEtBQUssSUFBSSxVQUFVLElBQUksS0FBSyxFQUFFLENBQUM7UUFDdkQsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDMUQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUVwRCwrQkFBK0I7UUFDL0IsT0FBTyxDQUFDLFFBQXFDLEVBQUUsRUFBRTtZQUU3Qyx3QkFBd0I7WUFDeEIsTUFBTSxVQUFVLEdBQUcsR0FBRyxFQUFFO2dCQUNwQixJQUFJLE1BQU0s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