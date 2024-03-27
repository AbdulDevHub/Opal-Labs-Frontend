import NextAuth from 'next-auth'
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

import axios from 'axios'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

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
//   providerAccountId: '101335385916640648332',
//   access_token: 'ya29.a0Ad52N3_n77OPiHVOm8umyeD5zBi3GU24Ga58jIJtCrWqAINclqIf_SngPCru06dqRgngB7b4mHdBoh3v9z6JO1YGjInCO8m3s_F50BBnieb3SZ9IMuqM9dEEgZSbm3wOKj08LP7WgqivweYwT3eaoQhMiMT-ODt9EipWaCgYKASwSARISFQHGX2MiTxCxpiPIovO8b0Qrvos9Bg0171',
//   expires_at: 1711058707,
//   refresh_token: '1//05AGfZrEN8tOwCgYIARAAGAUSNwF-L9Ir-hT4X-Tzp8JjwtObhWtZv1ibEdhT8pmm6nmnzw40mZ8WTK4tq_S6WnesOV-Z9K7sLe4',
//   scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
//   token_type: 'Bearer',
//   id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFkZjVlNzEwZWRmZWJlY2JlZmE5YTYxNDk1NjU0ZDAzYzBiOGVkZjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNDkwMTg0MzcwLTRvNXByZ2E3ZDgybTNuc2k3OGVtYTFiN3Q4MGNwMDFiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjQ5MDE4NDM3MC00bzVwcmdhN2Q4Mm0zbnNpNzhlbWExYjd0ODBjcDAxYi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMTMzNTM4NTkxNjY0MDY0ODMzMiIsImVtYWlsIjoiYWhrbjYzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoidEx0VUkxRnpsRXBUdjBJWnU0ektUQSIsIm5hbWUiOiJBYmR1bCBIYWRpIEtoYW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS0tEYURvNXVGQ0lXODA5emxmb3FQbWFPMjR5aXhUdy1DanVoOHlPRjExVEtVPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkFiZHVsIEhhZGkiLCJmYW1pbHlfbmFtZSI6IktoYW4iLCJpYXQiOjE3MTEwNTUxMDgsImV4cCI6MTcxMTA1ODcwOH0.vcsSuVkv08Qjn1deLefAXYuEoDf4nfHEQBbgmlK-LCfTFd-a-gjmDKccotAX9IRMhgEDtdNdzn3IVfuM-U7Hj_xgj7oGk4jeJqLJ5PyGFPmRMex-zOLeJtfeh36ta0yQftVHz57cEbDoIva9fglhwjbAPwr-KDL9hqG4C2WWx2iNONPqMXH_YN14h57Q0sFJxvawFBd1X4G1ilUZFIbwWE7IWzEoUy9J4d9szrvk4u_czwM0oPTHiMvRY_oc3MDtPVS7T-MBhgkSz9u2ESTFefQx5JiTADEO8qRj-T-PNbjfBk0qmEyRC6Ma83a_qWdnkO3KRPzx50zKPz_m58fBMw'
// }

// THIS IS AN EXAMPLE OF THE VALUE OF THE TOKEN OBJECT WHEN A USER LOGS IN
// token {
//   name: 'Abdul Hadi Khan',
//   email: 'ahkn63@gmail.com',
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocKKDaDo5uFCIW809zlfoqPmaO24yixTw-Cjuh8yOF11TKU=s96-c',
//   sub: '101335385916640648332'
// }
