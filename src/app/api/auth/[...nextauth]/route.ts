import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET;
const twitterClientId = process.env.TWITTER_CLIENT_ID;
const twitterClientSecret = process.env.TWITTER_CLIENT_SECRET;

const facebookConfigId = process.env.FACEBOOK_CONFIG_ID || "2065324800981044";
const facebookBusinessId = process.env.FACEBOOK_BUSINESS_ID || "1128099502607067";

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
          scope: "public_profile",
          config_id: facebookConfigId,
          business_id: facebookBusinessId
        }
      }
    })
  );
}

if (twitterClientId && twitterClientSecret) {
  providers.push(
    TwitterProvider({
      clientId: twitterClientId,
      clientSecret: twitterClientSecret,
      version: "2.0",
      authorization: {
        params: {
          scope: "tweet.read tweet.write users.read offline.access",
        },
      },
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

      // SUCCESS LOG: Confirm user is authenticated
      console.log(`✅ Success: ${token.provider} User Data:`, {
        name: session.user?.name,
        email: session.user?.email,
        provider: token.provider
      });

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
