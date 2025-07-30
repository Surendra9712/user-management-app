import type {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Mock function to simulate token refresh
async function refreshAccessToken(refreshToken: string) {
    try {
        if (refreshToken === "mock-refresh-token") {
            return {
                accessToken: "new-mock-access-token",
                refreshToken: "new-mock-refresh-token",
                accessTokenExpires: Date.now() + 120 * 60 * 1000,
            };
        }

        throw new Error("Invalid refresh token");
    } catch (error) {
        console.error("Refresh token error:", error);
        throw error;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                const envEmail = process.env.LOGIN_USERNAME;
                const envPassword = process.env.LOGIN_PASSWORD;
                if (credentials?.email === envEmail && credentials?.password === envPassword) {
                    return {
                        id: '1',
                        name: 'Admin',
                        email: 'admin@example.com',
                        accessToken: 'mock-access-token',
                        refreshToken: 'mock-refresh-token',
                        accessTokenExpires: Date.now() + 120 * 60 * 1000,
                    };
                }
                return null;
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 6 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        async jwt({token, user, account}) {
            // Initial sign in
            if (user && account) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: user.accessTokenExpires,
                };
            }

            // Return previous token if not expired
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // Access token has expired, try to refresh
            try {
                const refreshedTokens = await refreshAccessToken(token.refreshToken as string);

                return {
                    ...token,
                    accessToken: refreshedTokens.accessToken,
                    refreshToken: refreshedTokens.refreshToken,
                    accessTokenExpires: refreshedTokens.accessTokenExpires,
                };
            } catch (error) {
                console.error("Failed to refresh token", error);
                return {
                    ...token,
                    error: "RefreshAccessTokenError",
                };
            }
        },
        async session({session, token}) {
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            session.error = token.error as string | undefined;
            return session;
        }
    },
    pages: {
        signIn: '/login',
    }
};