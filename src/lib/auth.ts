import { Session, SupabaseClient, User } from "@supabase/supabase-js";

export const authSession = (supabase: SupabaseClient) => {
    return {
        subscribe: (func: (session: Session | null) => void) => {
            supabase.auth.getSession()
                .then((data) => func(data.data.session ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) =>
                func(session ?? null)
            );
            return auth.data.subscription.unsubscribe;
        }
    }
};

export const authUser = (supabase: SupabaseClient) => {
    return {
        subscribe: (func: (user: User | null) => void) => {
            supabase.auth.getSession()
                .then((data) => func(data.data.session?.user ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) =>
                func(session?.user ?? null)
            );
            return auth.data.subscription.unsubscribe;
        }
    }
};
