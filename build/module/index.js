export const realtime = (supabase, { schema = "public", idField = 'id' } = {}) => {
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
                    data: data ?? [],
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
export const authSession = (supabase) => {
    return {
        subscribe: (func) => {
            supabase.auth.getSession()
                .then((data) => func(data.data.session ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) => {
                func(session ?? null);
            });
            return auth.data.subscription.unsubscribe;
        }
    };
};
export const authUser = (supabase) => {
    return {
        subscribe: (func) => {
            supabase.auth.getUser()
                .then((data) => func(data.data.user ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) => {
                func(session?.user ?? null);
            });
            return auth.data.subscription.unsubscribe;
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUEsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLENBQUksUUFBd0IsRUFBRSxFQUFFLE1BQU0sR0FBRyxRQUFRLEVBQUUsT0FBTyxHQUFHLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQ2hHLE1BQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQztJQUV4QixNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxLQUFjLEVBQUUsS0FBYyxFQUFFLEVBQUU7UUFDakUsTUFBTSxTQUFTLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQztRQUNqQyxNQUFNLFlBQVksR0FBRyxHQUFHLEtBQUssT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUM1QyxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRXBELCtCQUErQjtRQUMvQixPQUFPLENBQUMsUUFBcUMsRUFBRSxFQUFFO1lBQzdDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFFdEQscUJBQXFCO1lBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO2dCQUM1QixJQUFJLElBQUk7b0JBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxH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