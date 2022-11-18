"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = exports.authSession = void 0;
const authSession = (supabase) => {
    return {
        subscribe: (func) => {
            supabase.auth.getSession()
                .then((data) => func(data.data.session ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) => func(session ?? null));
            return auth.data.subscription.unsubscribe;
        }
    };
};
exports.authSession = authSession;
const authUser = (supabase) => {
    return {
        subscribe: (func) => {
            supabase.auth.getSession()
                .then((data) => func(data.data.session?.user ?? null));
            const auth = supabase.auth.onAuthStateChange((_event, session) => func(session?.user ?? null));
            return auth.data.subscription.unsubscribe;
        }
    };
};
exports.authUser = authUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLFdBQVcsR0FBRyxDQUFDLFFBQXdCLEVBQUUsRUFBRTtJQUNwRCxPQUFPO1FBQ0gsU0FBUyxFQUFFLENBQUMsSUFBdUMsRUFBRSxFQUFFO1lBQ25ELFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2lCQUNyQixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FDN0QsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FDeEIsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO1FBQzlDLENBQUM7S0FDSixDQUFBO0FBQ0wsQ0FBQyxDQUFDO0FBWFcsUUFBQSxXQUFXLGVBV3RCO0FBRUssTUFBTSxRQUFRLEdBQUcsQ0FBQyxRQUF3QixFQUFFLEVBQUU7SUFDakQsT0FBTztRQUNILFNBQVMsRUFBRSxDQUFDLElBQWlDLEVBQUUsRUFBRTtZQUM3QyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtpQkFDckIsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0QsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUM3RCxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxJQUFJLENBQUMsQ0FDOUIsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO1FBQzlDLENBQUM7S0FDSixDQUFBO0FBQ0wsQ0FBQyxDQUFDO0FBWFcsUUFBQSxRQUFRLFlBV25CIn0=