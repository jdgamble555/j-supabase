// range - calcuate pagination

export const range = ({ page = 1, size = 3 }: { page: number, size: number }) => {
    const from = (page - 1) * size;
    const to = from + size - 1;
    return { from, to };
};

//
// encode - decode functions for UUID better URLS
//

const DASH_REGEXP = /-/g
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const BASE = BigInt(BASE58.length)
const ONE = BigInt(1)
const ZERO = BigInt(0)
const UUID_INDEXES = [0, 8, 12, 16, 20]

// https://github.com/sagefy/uuid58

export const encode = (uuid: string) => {
    try {
        let b = BigInt('0x' + uuid.replace(DASH_REGEXP, ''))
        let u58 = ''
        do {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            u58 = BASE58[b % BASE as any] + u58
            b = b / BASE
        } while (b > 0)
        return u58
    } catch (e) {
        return uuid
    }
};

export const decode = (uuid58: string) => {
    try {
        const parts = Array.from(uuid58).map(x => BASE58.indexOf(x))
        if (parts.some(inc => inc < 0)) return uuid58
        const max = uuid58.length - 1
        const b = parts.reduce(
            (acc, inc, pos) => (acc + BigInt(inc)) * (pos < max ? BASE : ONE),
            ZERO
        )
        const hex = b.toString(16).padStart(32, '0')
        return UUID_INDEXES.map((p, i, a) => hex.substring(p, a[i + 1])).join('-')
    } catch (e) {
        return uuid58
    }
};
