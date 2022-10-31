import type { Session, User, SupabaseClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
export interface SupaSnap<T> {
    data: T[];
    payload: RealtimePostgresChangesPayload<{
        [key: string]: any;
    }>;
}
export declare const realtime: <T>(supabase: SupabaseClient, { schema, idField }?: {
    schema?: string | undefined;
    idField?: string | undefined;
}) => {
    from: (table: string) => {
        subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
        eq: (field: string, value: any) => {
            single: () => {
                subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
            };
            subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
        };
    };
};
export declare const authSession: (supabase: SupabaseClient) => {
    subscribe: (func: (session: Session | null) => void) => () => void;
};
export declare const authUser: (supabase: SupabaseClient) => {
    subscribe: (func: (user: User | null) => void) => () => void;
};
export declare const range: ({ page, size }: {
    page: number;
    size: number;
}) => {
    from: number;
    to: number;
};
export declare const encode: (uuid: string) => string;
export declare const decode: (uuid58: string) => string;
