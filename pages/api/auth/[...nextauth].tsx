import NextAuth from "next-auth"
import type { NextApiRequest, NextApiResponse } from "next";

import LineProvider from 'next-auth/providers/line';
import GoogleProvider from "next-auth/providers/google";

// export default NextAuth({
//   // Configure one or more authentication providers
//   providers: [
//     LineProvider({
//       clientId: '1657206241',
//       clientSecret: 'a327f5e4be90d0c0ada69ba669894d3f',
//     }),
//     // ...add more providers here
//   ],

  
// })

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

  // if(req.query.nextauth.includes("callback") && req.method === "POST") {
  //   console.log(
  //     "Handling callback request from my Identity Provider",
  //     req.body
  //   )
  // }


 

  return await NextAuth(req, res, {
    providers: [
      LineProvider({
        clientId: process.env.LINE_CLINET_ID,
        clientSecret: process.env.LINE_CLINET_SECRET,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
      // ...add more providers here
    ],
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    session: {
      // Choose how you want to save the user session.
      // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
      // If you use an `adapter` however, we default it to `"database"` instead.
      // You can still force a JWT session by explicitly defining `"jwt"`.
      // When using `"database"`, the session cookie will only contain a `sessionToken` value,
      // which is used to look up the session in the database.
      strategy: "jwt",
    
      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 30 * 24 * 60 * 60, // 30 days
    
      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      updateAge: 24 * 60 * 60, // 24 hours
    },
      // Enable debug messages in the console if you are having problems
      debug: true,
    callbacks: {
      async session({ session, token, user }) {
        // Send properties to the client, like an access_token from a provider.
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.idToken = token.idToken;
        session.provider = token.provider;
        session.id = token.id;
        return session
      },
      async jwt({ token, user, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.idToken = account.id_token;
          token.provider = account.provider;
        }
        if (user) {
          token.id = user.id.toString();
        }
        return token;
      },
    }
  })
}





