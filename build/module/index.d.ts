import type { Session, User, SupabaseClient } from "@supabase/supabase-js";
export declare const realtime: (supabase: SupabaseClient, { schema, idField }?: {
    schema?: string | undefined;
    idField?: string | undefined;
}) => {
    from: (table: string) => {
        subscribe: (callback: (snap: any) => void) => import("@supabase/supabase-js").RealtimeChannel;
        eq: (field: string, value: any) => {
            subscribe: (callback: (snap: any) => void) => import("@supabase/supabase-js").RealtimeChannel;
        };
    };
};
export declare const authSession: (supabase: SupabaseClient) => {
    subscribe: (func: (session: Session | null) => void) => () => void;
};
export declare const authUser: (supabase: SupabaseClient) => {
    subscribe: (func: (user: User | null) => void) => () => void;
};
