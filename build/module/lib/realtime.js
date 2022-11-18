/* eslint-disable @typescript-eslint/no-explicit-any */
// Thanks to GaryAustin here for reconnect --> https://github.com/supabase/supabase/discussions/5641#discussioncomment-2292166
;
;
export const realtime = (supabase, { schema = "public", idField = 'id', limit = 100 } = {}) => {
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
            // TODO - cleanup repetitive code with a function here...
            return {
                subscribe: _subscribe({ table }),
                eq: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'eq' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value, filterName: 'eq' })
                    };
                },
                neq: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'neq' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value, filterName: 'neq' })
                    };
                },
                gt: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'gt' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value, filterName: 'gt' })
                    };
                },
                gte: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'gte' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value, filterName: 'gte' })
                    };
                },
                lt: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'lt' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value, filterName: 'lt' })
                    };
                },
                lte: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'lte' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value, filterName: 'lte' })
                    };
                }
            };
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbHRpbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JlYWx0aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVEQUF1RDtBQUN2RCw4SEFBOEg7QUFTN0gsQ0FBQztBQUtELENBQUM7QUFNRixNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsQ0FBSSxRQUF3QixFQUFFLEVBQUUsTUFBTSxHQUFHLFFBQVEsRUFBRSxPQUFPLEdBQUcsSUFBSSxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtJQUM3RyxNQUFNLEtBQUssR0FBVSxFQUFFLENBQUM7SUFFeEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsVUFBVSxFQUFrQixFQUFFLEVBQUU7UUFFdkYsTUFBTSxTQUFTLEdBQUcsS0FBSyxJQUFJLEtBQUssSUFBSSxVQUFVLENBQUM7UUFDL0MsTUFBTSxZQUFZLEdBQUcsR0FBRyxLQUFLLElBQUksVUFBVSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3ZELE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzFELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFcEQsK0JBQStCO1FBQy9CLE9BQU8sQ0FBQyxRQUFxQyxFQUFFLEVBQUU7WUFFN0Msd0JBQXdCO1lBQ3hCLE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRTtnQkFDcEIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1B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