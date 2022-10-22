/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Session, User, SupabaseClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js"

interface SupaSnap<T> {
    data: T[]
    payload: RealtimePostgresChangesPayload<{
        [key: string]: any;
    }>
}

export const realtime = <T>(supabase: SupabaseClient, { schema = "public", idField = 'id' } = {}) => {
    const items: any[] = [];

    const _subscribe = (table: string, field?: string, value?: string) => {
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
                    } as unknown as RealtimePostgresChangesPayload<{
                        [key: string]: any;
                    }>
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
                    callback({ data: items, payload });
                }).subscribe();
        }
    }
    return {
        from: (table: string) => {
            return {
                subscribe: _subscribe(table),
                eq: (field: string, value: any) => {
                    return {
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
            const auth = supabase.auth.onAuthStateChange((_event, session) => {
                func(session ?? null);
            });
            return auth.data.subscription.unsubscribe;
        }
    }
}

export const authUser = (supabase: SupabaseClient) => {
    return {
        subscribe: (func: (user: User | null) => void) => {
            supabase.auth.getUser()
                .then((data) => func(data.data.user ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) => {
                func(session?.user ?? null);
            });
            return auth.data.subscription.unsubscribe;
        }
    }
}
