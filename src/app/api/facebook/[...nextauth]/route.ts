import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET;

const providers = [] as any[];

if (facebookClientId && facebookClientSecret) {
    providers.push(
        FacebookProvider({
            clientId: facebookClientId,
            clientSecret: facebookClientSecret,
            authorization: {
                params: {
                    scope: "public_profile,email,pages_show_list",
                    config_id: "2065324800981044"
                }
            }
        })
    );
}

const authOptions = {
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }: { token: JWT; account?: any }) {
            if (account) {
                token.accessToken = account.access_token;
                token.provider = account.provider;
                token.id = account.providerAccountId;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            // @ts-ignore
            session.accessToken = token.accessToken;
            // @ts-ignore
            session.provider = token.provider;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
