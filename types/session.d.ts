// session.d.ts
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    userToken?: string
  }
}
