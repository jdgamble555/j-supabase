// range - calcuate pagination
export const range = ({ page = 1, size = 3 }) => {
    const from = (page - 1) * size;
    const to = from + size - 1;
    return { from, to };
};
//
// encode - decode functions for UUID better URLS
//
const DASH_REGEXP = /-/g;
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE = BigInt(BASE58.length);
const ONE = BigInt(1);
const ZERO = BigInt(0);
const UUID_INDEXES = [0, 8, 12, 16, 20];
// https://github.com/sagefy/uuid58
export const encode = (uuid) => {
    try {
        let b = BigInt('0x' + uuid.replace(DASH_REGEXP, ''));
        let u58 = '';
        do {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            u58 = BASE58[b % BASE] + u58;
            b = b / BASE;
        } while (b > 0);
        return u58;
    }
    catch (e) {
        return uuid;
    }
};
export const decode = (uuid58) => {
    try {
        const parts = Array.from(uuid58).map(x => BASE58.indexOf(x));
        if (parts.some(inc => inc < 0))
            return uuid58;
        const max = uuid58.length - 1;
        const b = parts.reduce((acc, inc, pos) => (acc + BigInt(inc)) * (pos < max ? BASE : ONE), ZERO);
        const hex = b.toString(16).padStart(32, '0');
        return UUID_INDEXES.map((p, i, a) => hex.substring(p, a[i + 1])).join('-');
    }
    catch (e) {
        return uuid58;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUU5QixNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBa0MsRUFBRSxFQUFFO0lBQzVFLE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUMvQixNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUMzQixPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQUVGLEVBQUU7QUFDRixpREFBaUQ7QUFDakQsRUFBRTtBQUVGLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQTtBQUN4QixNQUFNLE1BQU0sR0FBRyw0REFBNEQsQ0FBQTtBQUMzRSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNyQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFFdkMsbUNBQW1DO0FBRW5DLE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQ25DLElBQUk7UUFDQSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDcEQsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFBO1FBQ1osR0FBRztZQUNDLDhEQUE4RDtZQUM5RCxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFXLENBQUMsR0FBRyxHQUFHLENBQUE7WUFDbkMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUE7U0FDZixRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUM7UUFDZixPQUFPLEdBQUcsQ0FBQTtLQUNiO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixPQUFPLElBQUksQ0FBQTtLQUNkO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUU7SUFDckMsSUFBSTtRQUNBLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzVELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFBRSxPQUFPLE1BQU0sQ0FBQTtRQUM3QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtRQUM3QixNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUNsQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQ2pFLElBQUksQ0FDUCxDQUFBO1FBQ0QsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQzVDLE9BQU8sWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDN0U7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLE9BQU8sTUFBTSxDQUFBO0tBQ2hCO0FBQ0wsQ0FBQyxDQUFDIn0=