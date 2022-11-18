"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// Thanks to GaryAustin here for reconnect --> https://github.com/supabase/supabase/discussions/5641#discussioncomment-2292166
Object.defineProperty(exports, "__esModule", { value: true });
exports.realtime = void 0;
;
;
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
            return {
                subscribe: _subscribe({ table }),
                eq: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'eq' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value })
                    };
                },
                neq: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'neq' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value })
                    };
                },
                gt: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'gt' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value })
                    };
                },
                gte: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'gte' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value })
                    };
                },
                lt: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'lt' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value })
                    };
                },
                lte: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe({ table, field, value, single: true, filterName: 'lte' })
                            };
                        },
                        subscribe: _subscribe({ table, field, value })
                    };
                }
            };
        }
    };
};
exports.realtime = realtime;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbHRpbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JlYWx0aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1REFBdUQ7QUFDdkQsOEhBQThIOzs7QUFTN0gsQ0FBQztBQUtELENBQUM7QUFNSyxNQUFNLFFBQVEsR0FBRyxDQUFJLFFBQXdCLEVBQUUsRUFBRSxNQUFNLEdBQUcsUUFBUSxFQUFFLE9BQU8sR0FBRyxJQUFJLEVBQUUsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQzdHLE1BQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQztJQUV4QixNQUFNLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxVQUFVLEVBQWtCLEVBQUUsRUFBRTtRQUV2RixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksS0FBSyxJQUFJLFVBQVUsQ0FBQztRQUMvQyxNQUFNLFlBQVksR0FBRyxHQUFHLEtBQUssSUFBSSxVQUFVLElBQUksS0FBSyxFQUFFLENBQUM7UUFDdkQsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDMUQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUVwRCwrQkFBK0I7UUFDL0IsT0FBTyxDQUFDLFFBQXFDLEVBQUUsRUFBRTtZQUU3Qyx3QkFBd0I7WUFDeEIsTUFBTSxVQUFVLEdBQUcsR0FBRyxFQUFFO2dCQUNwQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUUvRCx1Q0FBdUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtvQkFDekMsSUFBSSxJQUFJO3dCQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDOUIsUUFBUSxDQUFDO3dCQUNMLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3pDLE9BQU8sRUFBRTs0QkFDTCxNQUFNOzRCQUNOLEtBQUs7NEJBQ0wsTUFBTSxFQUFFLEtBQUs7eUJBQ0U7cUJBQ3RCLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQztZQUVGLG1CQUFtQjtZQUNuQixNQUFNLGNBQWMsR0FBRyxDQUFDLE9BQWdCLEVBQUUsRUFBRTtnQkFDeEMsUUFBUSxPQUFPLENBQUMsU0FBUyxFQUFFO29CQUN2QixLQUFLLFFBQVEsQ0FBQyxDQUFDO3dCQUNYLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUN4QixNQUFNO3FCQUNUO29CQUNELEtBQUssUUFBUSxDQUFDLENBQUM7d0JBQ1gsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ3BFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDakMsTUFBTTtxQkFDVDtvQkFDRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO3dCQUNYLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNwRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDOUMsTUFBTTtxQkFDVDtpQkFDSjtZQUNMLENBQUMsQ0FBQTtZQUVELHFCQUFxQjtZQUNyQixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLGFBQWEsQ0FBQztpQkFDakUsRUFBRSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ3ZFLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDeEIsK0JBQStCO2dCQUMvQixPQUFPLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDbEUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ3BCLElBQUksTUFBTSxLQUFLLGVBQWUsRUFBRTtvQkFDNUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDbkM7cUJBQU0sSUFBSSxNQUFNLEtBQUssWUFBWSxFQUFFO29CQUNoQyxVQUFVLEVBQUUsQ0FBQztpQkFDaEI7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLE9BQU8sR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUE7SUFDRCxPQUFPO1FBQ0gsSUFBSSxFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUU7WUFDcEIsT0FBTztnQkFDSCxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUM7Z0JBQ2hDLEVBQUUsRUFBRSxDQUFDLEtBQWEsRUFBRSxLQUFVLEVBQUUsRUFBRTtvQkFDOUIsT0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRyxFQUFFOzRCQUNULE9BQU87Z0NBQ0gsU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFjOzZCQUM5RixDQUFBO3dCQUNMLENBQUM7d0JBQ0QsU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7cUJBQ2pELENBQUE7Z0JBQ0wsQ0FBQztnQkFDRCxHQUFHLEVBQUUsQ0FBQyxLQUFhLEVBQUUsS0FBVSxFQUFFLEVBQUU7b0JBQy9CLE9BQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUcsRUFBRTs0QkFDVCxPQUFPO2dDQUNILFNBQVMsRUFBRSxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBYzs2QkFDL0YsQ0FBQTt3QkFDTCxDQUFDO3dCQUNELFNBQVMsRUFBRSxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO3FCQUNqRCxDQUFBO2dCQUNMLENBQUM7Z0JBQ0QsRUFBRSxFQUFFLENBQUMsS0FBYSxFQUFFLEtBQVUsRUFBRSxFQUFFO29CQUM5QixPQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHLEVBQUU7NEJBQ1QsT0FBTztnQ0FDSCxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQWM7NkJBQzlGLENBQUE7d0JBQ0wsQ0FBQzt3QkFDRCxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztxQkFDakQsQ0FBQTtnQkFDTCxDQUFDO2dCQUNELEdBQUcsRUFBRSxDQUFDLEtBQWEsRUFBRSxLQUFVLEVBQUUsRUFBRTtvQkFDL0IsT0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRyxFQUFFOzRCQUNULE9BQU87Z0NBQ0gsU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFjOzZCQUMvRixDQUFBO3dCQUNMLENBQUM7d0JBQ0QsU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7cUJBQ2pELENBQUE7Z0JBQ0wsQ0FBQztnQkFDRCxFQUFFLEVBQUUsQ0FBQyxLQUFhLEVBQUUsS0FBVSxFQUFFLEVBQUU7b0JBQzlCLE9BQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUcsRUFBRTs0QkFDVCxPQUFPO2dDQUNILFNBQVMsRUFBRSxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBYzs2QkFDOUYsQ0FBQTt3QkFDTCxDQUFDO3dCQUNELFNBQVMsRUFBRSxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO3FCQUNqRCxDQUFBO2dCQUNMLENBQUM7Z0JBQ0QsR0FBRyxFQUFFLENBQUMsS0FBYSxFQUFFLEtBQVUsRUFBRSxFQUFFO29CQUMvQixPQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHLEVBQUU7NEJBQ1QsT0FBTztnQ0FDSCxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQWM7NkJBQy9GLENBQUE7d0JBQ0wsQ0FBQzt3QkFDRCxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztxQkFDakQsQ0FBQTtnQkFDTCxDQUFDO2FBQ0osQ0FBQTtRQUNMLENBQUM7S0FDSixDQUFBO0FBQ0wsQ0FBQyxDQUFDO0FBdklXLFFBQUEsUUFBUSxZQXVJbkIifQ==