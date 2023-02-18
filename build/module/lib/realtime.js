/* eslint-disable @typescript-eslint/no-explicit-any */
// Thanks to GaryAustin here for reconnect --> https://github.com/supabase/supabase/discussions/5641#discussioncomment-2292166
;
;
// filter types
const _filterNames = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in'];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbHRpbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JlYWx0aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVEQUF1RDtBQUN2RCw4SEFBOEg7QUFTN0gsQ0FBQztBQUtELENBQUM7QUFJRixlQUFlO0FBQ2YsTUFBTSxZQUFZLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQVUsQ0FBQztBQUs1RSxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsQ0FBSSxRQUF3QixFQUFFLEVBQUUsTUFBTSxHQUFHLFFBQVEsRUFBRSxPQUFPLEdBQUcsSUFBSSxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtJQUM3RyxNQUFNLEtBQUssR0FBVSxFQUFFLENBQUM7SUFFeEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsVUFBVSxFQUFrQixFQUFFLEVBQUU7UUFFdkYsTUFBTSxTQUFTLEdBQUcsS0FBSyxJQUFJLEtBQUssSUFBSSxVQUFVLENBQUM7UUFDL0MsTUFBTSxZQUFZLEdBQUcsR0FBRyxLQUFLLElBQUksVUFBVSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3ZELE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzFELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFcEQsK0JBQStCO1FBQy9CLE9BQU8sQ0FBQyxRQUFxQyxFQUFFLEVBQUU7WUFFN0Msd0JBQXdCO1lBQ3hCLE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRTtnQkFDcEIsSUFB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