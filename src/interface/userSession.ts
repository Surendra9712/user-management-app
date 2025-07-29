export interface UserSession {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    accessToken?: string;
    refreshToken?: string;
    expires?: string;
}