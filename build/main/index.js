"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = exports.authSession = exports.realtime = void 0;
const realtime = (supabase, { schema = "public", idField = 'id' } = {}) => {
    const items = [];
    const _subscribe = (table, field, value) => {
        const hasFilter = field && value;
        const filterString = `${field}=eq.${value}`;
        const filterChannel = hasFilter ? ':' + filterString : '';
        const filter = hasFilter ? filterString : undefined;
        // create the callback function
        return (callback) => {
            let select = supabase.from(table).select('*');
            select = hasFilter ? select.eq(field, value) : select;
            // grab current value
            select.then(({ data, error }) => {
                if (data)
                    items.push(...data);
                callback({
                    data: data !== null && data !== void 0 ? data : [],
                    payload: {
                        schema,
                        table,
                        errors: error
                    }
                });
            });
            // grab value changes
            return supabase.channel(schema + ':' + table + filterChannel)
                .on('postgres_changes', { event: '*', schema, table, filter }, (payload) => {
                const e = payload.eventType;
                switch (e) {
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
                // return ALL data with payload
                callback({ data: items, payload });
            }).subscribe();
        };
    };
    return {
        from: (table) => {
            return {
                subscribe: _subscribe(table),
                eq: (field, value) => {
                    return {
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
                .then((data) => { var _a; return func((_a = data.data.session) !== null && _a !== void 0 ? _a : null); });
            const auth = supabase.auth.onAuthStateChange((_event, session) => {
                func(session !== null && session !== void 0 ? session : null);
            });
            return auth.data.subscription.unsubscribe;
        }
    };
};
exports.authSession = authSession;
const authUser = (supabase) => {
    return {
        subscribe: (func) => {
            supabase.auth.getUser()
                .then((data) => { var _a; return func((_a = data.data.user) !== null && _a !== void 0 ? _a : null); });
            const auth = supabase.auth.onAuthStateChange((_event, session) => {
                var _a;
                func((_a = session === null || session === void 0 ? void 0 : session.user) !== null && _a !== void 0 ? _a : null);
            });
            return auth.data.subscription.unsubscribe;
        }
    };
};
exports.authUser = authUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBVU8sTUFBTSxRQUFRLEdBQUcsQ0FBSSxRQUF3QixFQUFFLEVBQUUsTUFBTSxHQUFHLFFBQVEsRUFBRSxPQUFPLEdBQUcsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7SUFDaEcsTUFBTSxLQUFLLEdBQVUsRUFBRSxDQUFDO0lBRXhCLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBYSxFQUFFLEtBQWMsRUFBRSxLQUFjLEVBQUUsRUFBRTtRQUNqRSxNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDO1FBQ2pDLE1BQU0sWUFBWSxHQUFHLEdBQUcsS0FBSyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQzVDLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzFELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFcEQsK0JBQStCO1FBQy9CLE9BQU8sQ0FBQyxRQUFxQyxFQUFFLEVBQUU7WUFDN0MsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUV0RCxxQkFBcUI7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7Z0JBQzVCLElBQUksSUFBSTtvQkFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLFFBQVEsQ0FBQztvQkFDTCxJQUFJLEVBQUUsSUFBSSxhQUFKLElBQUksY0FBSixJQUFJLEdBQUksRUFBRTtvQkFDaEIsT0FBTyxFQUFFO3dCQUNMLE1BQU07d0JBQ04sS0FBSzt3QkFDTCxNQUFNLEVBQUUsS0FBSztxQkFHZjtpQkFDTCxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFxQjtZQUNyQixPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDO2lCQUN4RCxFQUFFLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDdkUsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDNUIsUUFBUSxDQUFDLEVBQUU7b0JBQ1AsS0FBSyxRQUFRLENBQUMsQ0FBQzt3QkFDWCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDeEIsTUFBTTtxQkFDVDtvQkFDRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO3dCQUNYLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNwRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ2pDLE1BQU07cUJBQ1Q7b0JBQ0QsS0FBSyxRQUFRLENBQUMsQ0FBQzt3QkFDWCxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDcEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQzlDLE1BQU07cUJBQ1Q7aUJBQ0o7Z0JBRUQsK0JBQStCO2dCQUMvQixRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxDQUFBO0lBQ0QsT0FBTztRQUNILElBQUksRUFBRSxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQ3BCLE9BQU87Z0JBQ0gsU0FBUyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUM7Z0JBQzVCLEVBQUUsRUFBRSxDQUFDLEtBQWEsRUFBRSxLQUFVLEVBQUUsRUFBRTtvQkFDOUIsT0FBTzt3QkFDSCxTQUFTLEVBQUUsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO3FCQUM3QyxDQUFBO2dCQUNMLENBQUM7YUFDSixDQUFBO1FBQ0wsQ0FBQztLQUNKLENBQUE7QUFDTCxDQUFDLENBQUM7QUFuRVcsUUFBQSxRQUFRLFlBbUVuQjtBQUVLLE1BQU0sV0FBVyxHQUFHLENBQUMsUUFBd0IsRUFBRSxFQUFFO0lBQ3BELE9BQU87UUFDSCxTQUFTLEVBQUUsQ0FBQyxJQUF1QyxFQUFFLEVBQUU7WUFDbkQsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7aUJBQ3JCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLFdBQUMsT0FBQSxJQUFJLENBQUMsTUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sbUNBQUksSUFBSSxDQUFDLENBQUEsRUFBQSxDQUFDLENBQUM7WUFDckQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDN0QsSUFBSSxDQUFDLE9BQU8sYUFBUCxPQUFPLGNBQVAsT0FBTyxHQUFJLElBQUksQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7UUFDOUMsQ0FBQztLQUNKLENBQUE7QUFDTCxDQUFDLENBQUE7QUFYWSxRQUFBLFdBQVcsZUFXdkI7QUFFTSxNQUFNLFFBQVEsR0FBRyxDQUFDLFFBQXdCLEVBQUUsRUFBRTtJQUNqRCxPQUFPO1FBQ0gsU0FBUyxFQUFFLENBQUMsSUFBaUMsRUFBRSxFQUFFO1lBQzdDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2lCQUNsQixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFDLE9BQUEsSUFBSSxDQUFDLE1BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLG1DQUFJLElBQUksQ0FBQyxDQUFBLEVBQUEsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUU7O2dCQUM3RCxJQUFJLENBQUMsTUFBQSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsSUFBSSxtQ0FBSSxJQUFJLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO1FBQzlDLENBQUM7S0FDSixDQUFBO0FBQ0wsQ0FBQyxDQUFBO0FBWFksUUFBQSxRQUFRLFlBV3BCIn0=