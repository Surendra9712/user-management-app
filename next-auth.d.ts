import "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
    }

    interface Session {
        accessToken?: string;
        refreshToken?: string;
        error?: string;
    }

    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error?: string;
    }
}