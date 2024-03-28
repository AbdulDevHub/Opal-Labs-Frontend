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
    <div style={{ backgroundColor: '171717', color: 'white', padding: '60px 100px', textAlign: 'center' }}>
      <Head>
        <title>Opalescence</title>
      </Head>

      {/* ------------------ Header ------------------ */}
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
          <Image src={userImage} alt='User Image' width={75} height={75} />

          <div style={{ display: 'flex', gap: '20px' }}>
            <Button style={{ color: 'white', padding: '5px 20px', borderRadius: '15px' }}>Log In</Button>
            <Button style={{ backgroundColor: '#54D8B3', color: 'white', padding: '15px 30px', borderRadius: '15px' }}>Get Started</Button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px', marginTop: '40px', alignItems: 'center', padding: '0 150px' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '60px', fontWeight: 'bold' }}>Unleash Your Potential.</h1>
            <h3 style={{ color: '#BFBFBF', fontFamily: 'Arial', fontWeight: 'normal', fontSize: '32px' }}>Opal Labs is the flexible writing app that adapts to the way you think.</h3>
          </div>
          <Image src={userImage} alt='Sample Image' width={225} height={225} />
        </div>

        <Image src={sampleImage} alt='User Image' width={1250} height={650} style={{ borderRadius: '20px', marginTop: '40px', padding: '10px', backgroundColor: '#1E1E1E', border: '1px solid #fff' }} />
      </header>

      {/* ------------------ Main Sections ------------------ */}
      <main style={{ marginTop: '80px' }}>
        <section style={{ display: 'flex', gap: '100px', padding: '0 110px', justifyContent: 'center' }}>
          <div style={{ textAlign: 'left' }} >
            <h2>Your thoughts are yours.</h2>
            <p style={{ color: '#A3A3A3' }}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus sint dolore rem ratione nesciunt. Exercitationem eius reiciendis, maxime vitae animi debitis. Possimus exercitationem nihil doloribus illum laborum. Doloremque, deleniti atque!</p>

            <h2>Your mind is unique.</h2>
            <p style={{ color: '#A3A3A3' }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum voluptatum esse culpa id deleniti tenetur dignissimos consequatur, facere magni molestiae veniam iure itaque minus explicabo ipsum quod tempore velit quas.</p>

            <h2>Your knowledge should last.</h2>
            <p style={{ color: '#A3A3A3' }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae adipisci, earum velit placeat sed voluptatem alias, repudiandae dolorem aspernatur officia dicta enim, unde corporis est ex aut illo cumque quasi.</p>
          </div>

          <div>
            <div style={{ padding: '20px 30px', backgroundColor: '#222222', borderRadius: '20px', border: '2px solid #54D8B3' }}>
              <Image src={userImage} alt='Sample Image' width={200} height={200} />
            </div>
            <h1 style={{ fontSize: '40px', fontWeight: 'bold' }}>Opal Labs</h1>
            <p style={{ fontSize: '18px' }}>Free for personal use <br /><span style={{ color: '#54D8B3' }}>Start Now</span></p>
          </div>
        </section>

        <section style={{ marginTop: '80px' }}>
          <h1 style={{ fontSize: '60px', fontWeight: 'bold' }}>Spark Brilliance</h1>
          <p style={{ color: '#BFBFBF', fontFamily: 'Arial', fontWeight: 'normal', fontSize: '26px', padding: '0 270px', marginBottom: '60px' }}>From personal notes to journal entries, knowledge bases, and project management, Opal Labs gives you the tools to come up with idea and oraganize them.</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px', padding: '0 20px' }}>
            <div style={{ backgroundColor: '#222222', padding: '20px 30px', borderRadius: '20px', border: '2px solid #424242' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '30px' }}>Links</h3>
                <p style={{ color: '#A3A3A3', fontSize: '18px' }}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente voluptatibus tempore quas totam architecto ipsa asperiores. Autem quibusdam veritatis eos repudiandae explicabo. Id odio, error voluptates in nemo non optio?</p>
              </div>
              <Image src={sampleImage} alt='Sample Image' width={600} height={350} style={{ borderRadius: '20px', marginTop: '20px' }} />
            </div>

            <div style={{ backgroundColor: '#222222', padding: '20px 30px', borderRadius: '20px', border: '2px solid #424242' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '30px' }}>Graph</h3>
                <p style={{ color: '#A3A3A3', fontSize: '18px' }}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente voluptatibus tempore quas totam architecto ipsa asperiores. Autem quibusdam veritatis eos repudiandae explicabo. Id odio, error voluptates in nemo non optio?</p>
              </div>
              <Image src={sampleImage} alt='Sample Image' width={600} height={350} style={{ borderRadius: '20px', marginTop: '20px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px', padding: '0 20px' }}>
            <div style={{ backgroundColor: '#222222', padding: '20px 30px', borderRadius: '20px', border: '2px solid #424242' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '30px' }}>Canvas</h3>
                <p style={{ color: '#A3A3A3', fontSize: '18px' }}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente voluptatibus tempore quas totam architecto ipsa asperiores. Autem quibusdam veritatis eos repudiandae explicabo. Id odio, error voluptates in nemo non optio?</p>
              </div>
              <Image src={sampleImage} alt='Sample Image' width={600} height={350} style={{ borderRadius: '20px', marginTop: '20px' }} />
            </div>

            <div style={{ backgroundColor: '#222222', padding: '20px 30px', borderRadius: '20px', border: '2px solid #424242' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '30px' }}>Plugins</h3>
                <p style={{ color: '#A3A3A3', fontSize: '18px' }}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente voluptatibus tempore quas totam architecto ipsa asperiores. Autem quibusdam veritatis eos repudiandae explicabo. Id odio, error voluptates in nemo non optio?</p>
              </div>
              <Image src={sampleImage} alt='Sample Image' width={600} height={350} style={{ borderRadius: '20px', marginTop: '20px' }} />
            </div>
          </div>
        </section>

        <section style={{ marginTop: '120px' }}>
          <h1 style={{ fontSize: '60px', fontWeight: 'bold' }}>It's your time to shine.</h1>
          <Button style={{ backgroundColor: '#54D8B3', color: 'white', padding: '20px 40px', borderRadius: '15px' }}>Get Started Now</Button>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginTop: '40px', textAlign: 'left' }}>
            <div className="hover-on-div" style={{ backgroundColor: '#222222', padding: '20px 30px', borderRadius: '20px', border: '2px solid #424242' }}>
              <h3>Join us on Discord</h3>
              <p style={{ color: '#A3A3A3' }}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae eum deserunt soluta, quam sit sed amet delectus, atque doloribus aspernatur expedita tenetur! Vitae voluptas sunt incidunt accusantium! Odio, excepturi a.</p>
            </div>

            <div className="hover-on-div" style={{ backgroundColor: '#222222', padding: '20px 30px', borderRadius: '20px', border: '2px solid #424242', textAlign: 'left' }}>
              <h3>Discussion Forum</h3>
              <p style={{ color: '#A3A3A3' }}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae eum deserunt soluta, quam sit sed amet delectus, atque doloribus aspernatur expedita tenetur! Vitae voluptas sunt incidunt accusantium! Odio, excepturi a.</p>
            </div>

            <div className="hover-on-div" style={{ backgroundColor: '#222222', padding: '20px 30px', borderRadius: '20px', border: '2px solid #424242', textAlign: 'left' }}>
              <h3>Developer Docs</h3>
              <p style={{ color: '#A3A3A3' }}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae eum deserunt soluta, quam sit sed amet delectus, atque doloribus aspernatur expedita tenetur! Vitae voluptas sunt incidunt accusantium! Odio, excepturi a.</p>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------ Main Sections ------------------ */}
      <footer style={{ marginTop: '120px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', alignItems: 'center' }}>
          <div>
            <Image src={userImage} alt='User Image' width={100} height={100} />
            <p style={{ textAlign: 'center', marginTop: '20px' }}>© 2023 Opal Labs. All rights reserved.</p>
          </div>
          <div>
            <p>Follow us</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <p>Twitter</p>
              <p>Mastodon</p>
              <p>YouTube</p>
              <p>GitHub</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
