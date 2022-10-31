"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// Thanks to GaryAustin here for reconnect --> https://github.com/supabase/supabase/discussions/5641#discussioncomment-2292166
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = exports.range = exports.authUser = exports.authSession = exports.realtime = void 0;
const realtime = (supabase, { schema = "public", idField = 'id', limit = 100 } = {}) => {
    const items = [];
    const _subscribe = (table, field, value, single = false) => {
        const hasFilter = field && value;
        const filterString = `${field}=eq.${value}`;
        const filterChannel = hasFilter ? ':' + filterString : '';
        const filter = hasFilter ? filterString : undefined;
        // create the callback function
        return (callback) => {
            // get the original data
            const initialize = () => {
                let select = supabase.from(table).select('*');
                select = hasFilter ? select.eq(field, value) : select;
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
                subscribe: _subscribe(table),
                eq: (field, value) => {
                    return {
                        single: () => {
                            return {
                                subscribe: _subscribe(table, field, value, true)
                            };
                        },
                        subscribe: _subscribe(table, field, value)
                    };
                }
            };
        }
    };
};
exports.realtime = realtime;
const authSession = (supabase) => {
    return {
        subscribe: (func) => {
            supabase.auth.getSession()
                .then((data) => func(data.data.session ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) => func(session ?? null));
            return auth.data.subscription.unsubscribe;
        }
    };
};
exports.authSession = authSession;
const authUser = (supabase) => {
    return {
        subscribe: (func) => {
            supabase.auth.getSession()
                .then((data) => func(data.data.session?.user ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) => func(session?.user ?? null));
            return auth.data.subscription.unsubscribe;
        }
    };
};
exports.authUser = authUser;
// range - calcuate pagination
const range = ({ page = 1, size = 3 }) => {
    const from = (page - 1) * size;
    const to = from + size - 1;
    return { from, to };
};
exports.range = range;
//
// encode - decode functions for UUID better URLS
//
const DASH_REGEXP = /-/g;
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE = BigInt(BASE58.length);
const ONE = BigInt(1);
const ZERO = BigInt(0);
const UUID_INDEXES = [0, 8, 12, 16, 20];
// https://github.com/sagefy/uuid58
const encode = (uuid) => {
    try {
        let b = BigInt('0x' + uuid.replace(DASH_REGEXP, ''));
        let u58 = '';
        do {
            u58 = BASE58[b % BASE] + u58;
            b = b / BASE;
        } while (b > 0);
        return u58;
    }
    catch (e) {
        return uuid;
    }
};
exports.encode = encode;
const decode = (uuid58) => {
    try {
        const parts = Array.from(uuid58).map(x => BASE58.indexOf(x));
        if (parts.some(inc => inc < 0))
            return uuid58;
        const max = uuid58.length - 1;
        const b = parts.reduce((acc, inc, pos) => (acc + BigInt(inc)) * (pos < max ? BASE : ONE), ZERO);
        const hex = b.toString(16).padStart(32, '0');
        return UUID_INDEXES.map((p, i, a) => hex.substring(p, a[i + 1])).join('-');
    }
    catch (e) {
        return uuid58;
    }
};
exports.decode = decode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVEQUF1RDtBQUN2RCw4SEFBOEg7OztBQXNCdkgsTUFBTSxRQUFRLEdBQUcsQ0FBSSxRQUF3QixFQUFFLEVBQUUsTUFBTSxHQUFHLFFBQVEsRUFBRSxPQUFPLEdBQUcsSUFBSSxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtJQUM3RyxNQUFNLEtBQUssR0FBVSxFQUFFLENBQUM7SUFFeEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFhLEVBQUUsS0FBYyxFQUFFLEtBQWMsRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLEVBQUU7UUFDakYsTUFBTSxTQUFTLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQztRQUNqQyxNQUFNLFlBQVksR0FBRyxHQUFHLEtBQUssT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUM1QyxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRXBELCtCQUErQjtRQUMvQixPQUFPLENBQUMsUUFBcUMsRUFBRSxFQUFFO1lBRTdDLHdCQUF3QjtZQUN4QixNQUFNLFVBQVUsR0FBRyxHQUFHLEVBQUU7Z0JBQ3BCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUV0RCx1Q0FBdUM7Z0JB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