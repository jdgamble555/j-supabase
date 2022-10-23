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
            }).subscribe().unsubscribe;
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