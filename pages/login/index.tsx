import Head from 'next/head'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import { useToast } from '@/contexts/Toast'

// THIS PAGE IS NOT UTILIZED. IT WAS JUST HERE FOR POTENTIAL FUTURE USE.

/**
 * Renders the Login Page component.
 *
 * @return {JSX.Element} The rendered Login Page component
 */
const LoginPage = () => {
  const { setToast } = useToast()

  return (
    <>
      <Head>
        <title>Opal Labs | Login</title>
      </Head>
      <Container maxWidth={false} sx={{ minHeight: '100vh' }}>
        <Container>
          <Typography variant="h1">Login Page</Typography>
          <Button
            onClick={() => setToast({ type: 'warning', message: 'login not implemented yet' })}
          >
            Login
          </Button>
        </Container>
      </Container>
    </>
  )
}

export default LoginPage
