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
        return (callback) => {
            let select = supabase.from(table).select('*');
            select = hasFilter ? select.eq(field, value) : select;
            select.then(({ data }) => {
                if (data)
                    items.push(...data);
                callback({ data, payload: { schema, table } });
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR08sTUFBTSxRQUFRLEdBQUcsQ0FBQyxRQUF3QixFQUFFLEVBQUUsTUFBTSxHQUFHLFFBQVEsRUFBRSxPQUFPLEdBQUcsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7SUFDN0YsTUFBTSxLQUFLLEdBQVUsRUFBRSxDQUFDO0lBRXhCLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBYSxFQUFFLEtBQWMsRUFBRSxLQUFjLEVBQUUsRUFBRTtRQUNqRSxNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDO1FBQ2pDLE1BQU0sWUFBWSxHQUFHLEdBQUcsS0FBSyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQzVDLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzFELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFcEQsT0FBTyxDQUFDLFFBQTZCLEVBQUUsRUFBRTtZQUNyQyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksSUFBSTtvQkFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLFFBQVEsQ0FBQyxFQUFFLElB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