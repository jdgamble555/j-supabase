export declare const range: ({ page, size }: {
    page: number;
    size: number;
}) => {
    from: number;
    to: number;
};
export declare const encode: (uuid: string) => string;
export declare const decode: (uuid58: string) => string;
