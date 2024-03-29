import NextAuth from 'next-auth'
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

import axios from 'axios'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const SECRET = process.env.SECRET!

/**
 * Configures NextAuth with Google OAuth provider for authentication.
 *
 * @returns {Object} NextAuth configuration object.
 */
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
  ],
  secret: SECRET,
  callbacks: {
    /**
     * Asynchronously generates a JSON Web Token (JWT) by adding additional properties to the token object.
     *
     * @param {Object} token - The token object to be modified.
     * @param {Object} account - The account object containing the access token and provider.
     * @return {Promise<Object>} The modified token object.
     */
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
        if (typeof account.access_token === 'string' && account.expires_at) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_OPALESCENCE_BASE_URL}/user-login`,
            {
              access_token: account.access_token,
              expires_in: account.expires_at - Math.floor(Date.now() / 1000),
              refresh_token: account.refresh_token,
            },
            { withCredentials: true }
          )
          token.userToken = response.data.token
        }
      }
      return token
    },
    /**
     * Asynchronously handles a session by adding the user token to the session object if it exists.
     *
     * @param {Object} session - The session object to be updated.
     * @param {Object} token - The JWT token containing the user token.
     * @param {string} token.userToken - The user token to be added to the session object.
     * @return {Promise<Object>} The updated session object.
     */
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      // This is called whenever a session is fetched
      if (token.userToken && typeof token.userToken === 'string') {
        session.userToken = token.userToken
      }
      return session
    },
  },
})

// THIS IS AN EXAMPLE OF THE VALUE OF THE ACCOUNT OBJECT WHEN A USERE LOGS IN
// account {
//   provider: 'google',
//   type: 'oauth',
//   providerAccountId: 'number',
//   access_token: 'string',
//   expires_at: number,
//   refresh_token: 'string',
//   scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
//   token_type: 'Bearer',
//   id_token: 'string'
// }

// THIS IS AN EXAMPLE OF THE VALUE OF THE TOKEN OBJECT WHEN A USER LOGS IN
// token {
//   name: 'string',
//   email: 'string',
//   picture: 'url string',
//   sub: 'number'
// }
