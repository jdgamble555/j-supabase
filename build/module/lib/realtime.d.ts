import type { SupabaseClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
export declare type Payload = RealtimePostgresChangesPayload<{
    [key: string]: any;
}>;
export interface SupaSnap<T> {
    data: T[];
    payload: Payload;
}
export interface SupaSingleSnap<T> {
    data: T;
    payload: Payload;
}
declare type Single<T> = (callback: (snap: SupaSingleSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
export declare const realtime: <T>(supabase: SupabaseClient, { schema, idField, limit }?: {
    schema?: string | undefined;
    idField?: string | undefined;
    limit?: number | undefined;
}) => {
    from: (table: string) => {
        subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
        eq: (field: string, value: any) => {
            single: () => {
                subscribe: Single<T>;
            };
            subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
        };
        neq: (field: string, value: any) => {
            single: () => {
                subscribe: Single<T>;
            };
            subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
        };
        gt: (field: string, value: any) => {
            single: () => {
                subscribe: Single<T>;
            };
            subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
        };
        gte: (field: string, value: any) => {
            single: () => {
                subscribe: Single<T>;
            };
            subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
        };
        lt: (field: string, value: any) => {
            single: () => {
                subscribe: Single<T>;
            };
            subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
        };
        lte: (field: string, value: any) => {
            single: () => {
                subscribe: Single<T>;
            };
            subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
        };
        in: (field: string, value: any) => {
            single: () => {
                subscribe: Single<T>;
            };
            subscribe: (callback: (snap: SupaSnap<T>) => void) => () => Promise<"error" | "ok" | "timed out">;
        };
    };
};
export {};
