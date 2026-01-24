import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET;

const providers = [] as any[];

if (googleClientId && googleClientSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

if (facebookClientId && facebookClientSecret) {
  providers.push(
    FacebookProvider({
      clientId: facebookClientId,
      clientSecret: facebookClientSecret,
      authorization: {
        params: {
          // FOR BUSINESS APPS: You MUST include at least one permission besides public_profile
          // Simplified to public_profile only for initial testing
          scope: "public_profile",
          config_id: "2065324800981044" // Your newly created Business Configuration ID

          // FULL PERMISSIONS (uncomment after configuring Facebook App in Developer Console)
          // Requires: Facebook Login + Pages API products enabled
          // See: https://developers.facebook.com/apps/1220560470174102
          // scope: "public_profile,email,pages_manage_posts,pages_read_engagement,pages_show_list"
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
