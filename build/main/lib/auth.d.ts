import { Session, SupabaseClient, User } from "@supabase/supabase-js";
export declare const authSession: (supabase: SupabaseClient) => {
    subscribe: (func: (session: Session | null) => void) => () => void;
};
export declare const authUser: (supabase: SupabaseClient) => {
    subscribe: (func: (user: User | null) => void) => () => void;
};
