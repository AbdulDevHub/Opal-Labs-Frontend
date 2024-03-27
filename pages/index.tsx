import Head from 'next/head'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { useEffect } from 'react'

import CodeIcon from '@mui/icons-material/Code'
import EmailIcon from '@mui/icons-material/Email'
import GoogleIcon from '@mui/icons-material/Google';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import WebIcon from '@mui/icons-material/Web'
import WorkIcon from '@mui/icons-material/Work'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

/**
 * Renders the homepage with user information and login functionality.
 * @returns {JSX.Element} The rendered homepage component.
 */
const HomePage = () => {
  const router = useRouter()
  const { data: session } = useSession()

  // Easily Changeable User & Image Values
  const siteName = 'Opalescence'
  const userImage = '/images/opal.png'
  const sampleImage = '/images/sampleHomePageImage.png'

  // If a session exists (user logged in), navigate to the dashboard
  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  {/* -------------------------- HOMEPAGE RENDERER -----------------------*/ }
  return (
    <>
      <Head>
        <title>Opalescence</title>
      </Head>

      {/* ------------------ Header ------------------ */}
      <header>
        <Box sx={{
          display: 'flex', justifyContent: 'space-between', padding: '10px 25px',
          width: '100vw', borderBottom: '2px solid #e0e0e0', alignItems: 'center',
        }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '270px', height: '64px' }}>
            <Image src={userImage} alt={`${siteName} Logo`} width={50} height={50} />
            <Typography variant="h4" sx={{
              marginLeft: '8px', fontStyle: 'Roboto', lineHeight: '40px',
              letterSpacing: '0.25px', fontSize: '34px', fontWeight: 400, color: '#424242'
            }}
            >
              {siteName}
            </Typography>
          </Box>

          <Button variant="contained" onClick={() => signIn('google')} sx={{ width: '120px', height: '50px', padding: '0px, 16px, 0px, 16px', radius: '4px' }}>
            <GoogleIcon fontSize='small' />

            <Typography sx={{
              marginLeft: '8px', fontStyle: 'Roboto', lineHeight: '36px',
              letterSpacing: '1.25px', fontSize: '14px', fontWeight: 500,
            }}
            >
              Login
            </Typography>
          </Button>
        </Box>
      </header>

      {/* ------------------ Main Container ------------------ */}
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '100px 50px 0px 50px', backgroundColor: '#F3F9FF', width: '100vw' }}>
          {/* ------------------ Hero Section ------------------ */}
          <section style={{ width: '50vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box>
              <Box sx={{ display: 'flex', width: '714px' }}>
                <Typography variant="h2" sx={{
                  fontStyle: 'Roboto', fontWeight: 400,
                  fontSize: '57px', lineHeight: '60px', letterSpacing: '0.5px',
                }}
                >
                  Explore
                </Typography>

                &nbsp; &nbsp;

                <Typography variant="h2" sx={{
                  fontStyle: 'Roboto', background: '-webkit-linear-gradient(45deg, #09009f, #00ff95 80%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 1000,
                  fontSize: '57px', lineHeight: '60px', letterSpacing: '0.5px',
                }}
                >
                  Opalescence
                </Typography>

                <Typography variant="h2" sx={{
                  fontStyle: 'Roboto', fontWeight: 400,
                  fontSize: '57px', lineHeight: '60px', letterSpacing: '0.5px',
                }}
                >
                  :
                </Typography>
              </Box>

              <Typography variant="h2" sx={{
                fontStyle: 'Roboto', fontWeight: 400,
                fontSize: '57px', lineHeight: '60px', letterSpacing: '0.5px',
              }}
              >
                Where Productivity
              </Typography>

              <Typography variant="h2" sx={{
                fontStyle: 'Roboto', fontWeight: 400, fontSize: '57px',
                lineHeight: '60px', letterSpacing: '0.5px', paddingBottom: '10px',
              }}
              >
                Meets Innovation
              </Typography>

              <Typography variant="h4" sx={{
                fontStyle: 'Roboto', fontWeight: 400, fontSize: '34px',
                lineHeight: '40px', letterSpacing: '0.25px', color: '#9E9E9E',
              }}
              >
                Organize your thoughts with a brand
              </Typography>

              <Typography variant="h4" sx={{
                fontStyle: 'Roboto', fontWeight: 400, fontSize: '34px', lineHeight: '40px',
                letterSpacing: '0.25px', color: '#9E9E9E', paddingBottom: '20px',
              }}
              >
                new note-taking experience
              </Typography>

              <Box>
                {/* <Button variant="contained" onClick={() => signIn('google')}>
                  <Typography variant="h4" sx={{ fontStyle: 'Roboto', fontWeight: 500, fontSize: '14px',
                      lineHeight: '36px', letterSpacing: '1.25px', color: '#FFFFFF',
                    }}
                  >
                    Start Taking Notes
                  </Typography>

                  <CreateIcon />
                </Button> */}
                <Button variant="contained" LinkComponent={NextLink} href="/dashboard">
                  <Typography variant="h4" sx={{
                    fontStyle: 'Roboto', fontWeight: 500, fontSize: '14px',
                    lineHeight: '36px', letterSpacing: '1.25px', color: '#FFFFFF',
                  }}
                  >
                    Testing Shortcut - Dashboard Page
                  </Typography>
                </Button>
              </Box>
            </Box>
          </section>

          <Box sx={{ display: 'flex', width: '50vw', justifyContent: 'center', paddingRight: '3%' }}>
            <Image src={sampleImage} alt={`sample image`} width={800} height={456} />
          </Box>
        </Box>

        {/* ------------------ Main Section ------------------ */}
        <main>
          {/* Flexible Functionality Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '50px' }}>
            <Box>
              <Typography variant="h3" sx={{ fontStyle: 'Roboto', color: '#424242', paddingTop: '20px' }}>
                Flexible Functionality
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', paddingTop: '40px' }}>
              <Box sx={{ width: '400px' }}>
                <PersonIcon sx={{ fontSize: 80 }} />

                <Typography
                  sx={{
                    fontStyle: 'Roboto', fontWeight: 400, fontSize: '16px',
                    lineHeight: '24px', letterSpacing: '0.5px', textAlign: 'center',
                  }}
                >
                  Personal
                </Typography>
              </Box>

              <Box sx={{ width: '400px' }}>
                <SchoolIcon sx={{ fontSize: 80 }} />

                <Typography sx={{
                  fontStyle: 'Roboto', fontWeight: 400, fontSize: '16px',
                  lineHeight: '24px', letterSpacing: '0.5px', textAlign: 'center',
                }}
                >
                  School
                </Typography>
              </Box>

              <Box sx={{ width: '400px' }}>
                <WorkIcon sx={{ fontSize: 80 }} />

                <Typography sx={{
                  fontStyle: 'Roboto', fontWeight: 400, fontSize: '16px',
                  lineHeight: '24px', letterSpacing: '0.5px', textAlign: 'center',
                }}
                >
                  Work
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Key features Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '50px' }}>
            <Box>
              <Typography variant="h3" sx={{ fontStyle: 'Roboto', color: '#424242', paddingTop: '20px' }}>
                Key Features
              </Typography>
            </Box>

            <Box sx={{ paddingTop: '50px' }}>
              {/* 1st row */}
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '1280px' }}>
                {/* 1st column */}
                <Box sx={{
                  backgroundColor: '#F5F5F5', padding: '20px',
                  margin: '10px', width: '100vw', borderRadius: '16px',

                  '&:hover': {
                    transform: 'translateY(-5px)',
                    backgroundColor: '#c2ede6',
                  }
                }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <TextFieldsIcon sx={{ fontSize: 60 }} />
                    </Box>

                    <Box>
                      <Typography sx={{
                        fontStyle: 'Roboto', color: 'black', fontSize: '20px',
                        fontWeight: 700, lineHeight: '32px', letterSpacing: '0.25px', padding: '0px 0px 5px 10px',
                      }}
                      >
                        Styled Text
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontStyle: 'Roboto' }}>
                      Enhance readability with varied text sizes and colors{' '}
                    </Typography>
                  </Box>
                </Box>

                {/* 2nd column */}
                <Box sx={{
                  backgroundColor: '#F5F5F5', padding: '20px',
                  margin: '10px', width: '100vw', borderRadius: '16px',

                  '&:hover': {
                    transform: 'translateY(-5px)',
                    backgroundColor: '#c2ede6',
                  }
                }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <UploadFileIcon sx={{ fontSize: 60 }} />
                    </Box>

                    <Box>
                      <Typography sx={{
                        fontStyle: 'Roboto', color: 'black', fontSize: '20px',
                        fontWeight: 700, lineHeight: '32px', letterSpacing: '0.25px', paddingLeft: '10px',
                      }}
                      >
                        Publish & Share
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontStyle: 'Roboto' }}>
                      Publish read-only versions of your notes to share with your peers
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* 2nd row */}
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '1280px' }}>
                {/* 1st column */}
                <Box sx={{
                  backgroundColor: '#F5F5F5', padding: '20px',
                  margin: '10px', width: '100vw', borderRadius: '16px',

                  '&:hover': {
                    transform: 'translateY(-5px)',
                    backgroundColor: '#c2ede6',
                  }
                }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <LibraryBooksIcon sx={{ fontSize: 60 }} />
                    </Box>

                    <Box>
                      <Typography sx={{
                        fontStyle: 'Roboto', color: 'black', fontSize: '20px', fontWeight: 700,
                        lineHeight: '32px', letterSpacing: '0.25px', padding: '0px 0px 5px 10px',
                      }}
                      >
                        Page Hierarchy
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontStyle: 'Roboto' }}>
                      Group your thoughts and stay organized
                    </Typography>
                  </Box>
                </Box>

                {/* 2nd column */}
                <Box sx={{
                  backgroundColor: '#F5F5F5', padding: '20px',
                  margin: '10px', width: '100vw', borderRadius: '16px',

                  '&:hover': {
                    transform: 'translateY(-5px)',
                    backgroundColor: '#c2ede6',
                  }
                }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <WebIcon sx={{ fontSize: 60 }} />
                    </Box>

                    <Box>
                      <Typography sx={{
                        fontStyle: 'Roboto', color: 'black', fontSize: '20px',
                        fontWeight: 700, lineHeight: '32px', letterSpacing: '0.25px', padding: '0px 0px 5px 10px',
                      }}
                      >
                        Embed
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontStyle: 'Roboto' }}>
                      Enhance your notes with Youtube videos, Google Maps, Social Media posts, etc.
                    </Typography>
                  </Box>
                </Box>

                {/* 3rd column */}
                <Box sx={{
                  backgroundColor: '#F5F5F5', padding: '20px',
                  margin: '10px', width: '100vw', borderRadius: '16px',

                  '&:hover': {
                    transform: 'translateY(-5px)',
                    backgroundColor: '#c2ede6',
                  }
                }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <CodeIcon sx={{ fontSize: 60 }} />
                    </Box>

                    <Box>
                      <Typography sx={{
                        fontStyle: 'Roboto', color: 'black', fontSize: '20px',
                        fontWeight: 700, lineHeight: '32px', letterSpacing: '0.25px', padding: '0px 0px 5px 10px',
                      }}
                      >
                        Code Snippet
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontStyle: 'Roboto' }}>
                      Write down your ideas so they never get lost
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Community Insights Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '50px 50px 0px 50px' }}>
            <Box>
              <Typography variant="h3" sx={{ fontStyle: 'Roboto', color: '#424242', paddingTop: '20px' }}>
                Community Insights
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '80vh' }}>
              {/* 1st row */}
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image src={userImage} alt={`${siteName} Logo`} width={150} height={150} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                  <Typography sx={{
                    fontFamily: 'Roboto Serif', fontStyle: 'italic', fontWeight: 400,
                    fontSize: '34px', lineHeight: '40px', letterSpacing: '0.25px', padding: '20px'
                  }}>
                    "An incredible app. The distinction between Opalescence and its competitors is
                    beyond words."
                  </Typography>

                  <Typography
                    sx={{
                      fontStyle: 'Roboto', fontWeight: 400, fontSize: '16px', lineHeight: '24px',
                      letterSpacing: '0.5px', padding: '0 20px 20px 20px', color: '#424242'
                    }}
                  >
                    - No one ever
                  </Typography>
                </Box>
              </Box>

              {/* 2nd row */}
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                  <Typography sx={{
                    fontFamily: 'Roboto Serif', fontStyle: 'italic', fontWeight: 400, fontSize: '34px',
                    lineHeight: '40px', letterSpacing: '0.25px', padding: '20px',
                  }}
                  >
                    “Discovering Opalescence has been a game-changer for my productivity. With its
                    intuitive interface and seamless functionality, I've found myself effortlessly
                    organizing my thoughts and tasks like never before.”
                  </Typography>

                  <Typography sx={{
                    fontStyle: 'Roboto', fontWeight: 400, fontSize: '16px', lineHeight: '24px',
                    letterSpacing: '0.5px', padding: '0 20px 20px 20px', color: '#424242'
                  }}
                  >
                    - ChatGPT
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image src={userImage} alt={`${siteName} Logo`} width={150} height={150} />
                </Box>
              </Box>

              {/* 3rd row */}
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image src={userImage} alt={`${siteName} Logo`} width={150} height={150} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                  <Typography sx={{
                    fontFamily: 'Roboto Serif', fontStyle: 'italic', fontWeight: 400,
                    fontSize: '34px', lineHeight: '40px', letterSpacing: '0.25px', padding: '20px'
                  }}
                  >
                    "Wow. Just wow."
                  </Typography>

                  <Typography
                    sx={{
                      fontStyle: 'Roboto', fontWeight: 400, fontSize: '16px', lineHeight: '24px',
                      letterSpacing: '0.5px', padding: '0 20px 20px 20px', color: '#424242'
                    }}>
                    - Joe Mama?
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </main>

        {/* ------------------ Footer ------------------ */}
        <footer style={{ width: '100vw', borderTop: '2px solid #e0e0e0', marginTop: '50px' }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '24px 320px 24px 320px', alignItems: 'center', height: '68px' }}>
              <Typography sx={{ fontStyle: 'Roboto', fontWeight: 400, fontSize: '12px', lineHeight: '20px', letterSpacing: '0.4px' }}>
                © Opalescence 2024
              </Typography>

              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalPhoneIcon sx={{ color: '#9E9E9E' }} />
                  <Typography sx={{
                    paddingLeft: '4px', fontStyle: 'Roboto', fontWeight: 400, fontSize: '12px',
                    lineHeight: '20px', letterSpacing: '0.4px', color: '#9E9E9E'
                  }}>
                    {' '}911-911-911{' '}
                  </Typography>
                </Box>

                <Box sx={{ padding: '10px' }}></Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ color: '#9E9E9E' }} />
                  <Typography sx={{
                    paddingLeft: '4px', fontStyle: 'Roboto', fontWeight: 400, fontSize: '12px', lineHeight: '20px',
                    letterSpacing: '0.4px', color: '#9E9E9E'
                  }}>
                    {' '}mail@fake.com{' '}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </footer>
      </Container>
    </>
  )
}

export default HomePage
