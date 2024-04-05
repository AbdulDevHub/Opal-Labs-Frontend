import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { useEffect } from 'react'

import GoogleIcon from '@mui/icons-material/Google';
import Button from '@mui/material/Button'

/**
 * Renders the homepage with user information and login functionality.
 * @returns {JSX.Element} The rendered homepage component.
 */
const HomePage = () => {
  const router = useRouter()
  const { data: session } = useSession()

  // Easily Changeable User & Image Values
  const logoImage = '/images/opal.png'
  const fullLogoNameImage = '/images/Logo/Full Name.png'
  const sampleImage = '/images/sampleHomePageImage.png'
  const sampleImageStyleText = '/images/sampleImageStyleText.png'
  const sampleImagePublish = '/images/sampleImagePublish.png'
  const sampleImageSubpages = '/images/sampleImageSubpages.png'
  const sampleImageEmbed = '/images/sampleImageEmbed.png'

  // If a session exists (user logged in), navigate to the dashboard
  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  {/* -------------------------- HOMEPAGE RENDERER -----------------------*/ }
  return (
    <div className='homepage' style={{ backgroundColor: '171717', color: 'white', padding: '60px 100px', textAlign: 'center' }}>
      <Head>
        <title>Opal Labs</title>
      </Head>

      {/* ------------------ Header ------------------ */}
      <header>
        <div className='responsive-login' style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
          <Image src={fullLogoNameImage} alt='Opal Labs' width={300} height={75} />

          <div style={{ display: 'flex', gap: '20px' }}>
            <Button onClick={() => signIn('google')} style={{ backgroundColor: '#54D8B3', color: 'white', padding: '15px 30px', borderRadius: '15px' }}><GoogleIcon fontSize='small' /> Log In</Button>
          </div>
        </div>

        <div className='responsive-logo' style={{ display: 'flex', justifyContent: 'space-between', gap: '80px', margin: '40px auto 0 auto', alignItems: 'center', maxWidth: '1040px' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '60px', fontWeight: 'bold' }}>Unleash Your{' '}
              <span style={{
                background: '-webkit-linear-gradient(45deg, #c0ebff, #00ff95 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Potential.
              </span>
            </h1>

            <h3 style={{ color: '#BFBFBF', fontFamily: 'Arial', fontWeight: 'normal', fontSize: '32px' }}>Opal Labs is the flexible writing app that adapts to the way you think.</h3>
          </div>
          <Image src={logoImage} alt='Site Opal Logo' width={225} height={225} />
        </div>

        <Image layout='responsive' src={sampleImage} alt='Sample Homepage Image' width={1250} height={650} style={{ borderRadius: '20px', marginTop: '40px', padding: '10px', backgroundColor: '#1E1E1E', border: '1px solid #fff' }} />
      </header>

      {/* ------------------ Main Sections ------------------ */}
      <main style={{ marginTop: '80px' }}>
        <section className="responsive-container use-section" style={{ display: 'flex', gap: '100px', padding: '0 110px', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'left' }}>
            <h2>For Personal Use.</h2>
            <p style={{ color: '#A3A3A3' }}>Our note-taking platform is perfect for personal use. Organize your thoughts, jot down your ideas, or simply keep track of your daily activities. With our rich text editor, you can style your notes to your liking.</p>

            <h2>For School Use.</h2>
            <p style={{ color: '#A3A3A3' }}>Whether you're a student or a teacher, our platform can help you stay on top of your academic work. Create subpages for different subjects or projects, embed relevant webpages, and even track your progress with checkboxes.</p>

            <h2>For Work Use.</h2>
            <p style={{ color: '#A3A3A3' }}>Stay productive with our platform's features tailored for professional use. Collaborate with your team by sharing your notes, keep track of tasks with checkboxes, and present your ideas clearly with our callout component.</p>
          </div>

          <div style={{ padding: '0 30px' }}>
            <div style={{ padding: '20px 30px', backgroundColor: '#222222', borderRadius: '20px', border: '2px solid #54D8B3' }}>
              <Image src={logoImage} alt='Sample Image' width={200} height={200} />
            </div>
            <h1 style={{ fontSize: '40px', fontWeight: 'bold' }}>Opal Labs</h1>
            <p style={{ fontSize: '18px' }}>Free for personal use <br /><span onClick={() => signIn('google')} style={{ color: '#54D8B3', cursor: 'pointer' }}>Start Now</span></p>
          </div>
        </section>

        <section style={{ marginTop: '80px' }}>
          <h1 style={{ fontSize: '60px', fontWeight: 'bold' }}>Spark Brilliance</h1>
          <p style={{ color: '#BFBFBF', fontFamily: 'Arial', fontWeight: 'normal', fontSize: '26px', margin: '0 auto 60px auto', maxWidth: '750px' }}>From personal notes to journal entries, knowledge bases, and project management, Opal Labs gives you the tools to come up with idea and oraganize them.</p>

          <div className="responsive-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginTop: '40px', padding: '0 20px' }}>
            <div style={{ backgroundColor: '#222222', padding: '20px 30px', maxWidth: '605px', borderRadius: '20px', border: '2px solid #424242' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '30px' }}>Styled Text</h3>
                <p style={{ color: '#A3A3A3', fontSize: '18px' }}>Enhance readability with various text sizes, styles, and colors</p>
              </div>
              <Image src={sampleImageStyleText} layout='responsive' alt='Sample Image' width={600} height={350} style={{ borderRadius: '20px', marginTop: '20px' }} />
            </div>

            <div style={{ backgroundColor: '#222222', padding: '20px 30px', maxWidth: '605px', borderRadius: '20px', border: '2px solid #424242' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '30px' }}>Publish & Share</h3>
                <p style={{ color: '#A3A3A3', fontSize: '18px' }}>Publish read-only versions of your notes to share with peers</p>
              </div>
              <Image src={sampleImagePublish} layout='responsive' alt='Sample Image' width={600} height={350} style={{ borderRadius: '20px', marginTop: '20px' }} />
            </div>
          </div>

          <div className="responsive-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginTop: '40px', padding: '0 20px' }}>
            <div style={{ backgroundColor: '#222222', padding: '20px 30px', maxWidth: '605px', borderRadius: '20px', border: '2px solid #424242' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '30px' }}>Page Hierarchy</h3>
                <p style={{ color: '#A3A3A3', fontSize: '18px' }}>Group your thoughts and stay organized with our subpages</p>
              </div>
              <Image src={sampleImageSubpages} layout='responsive' alt='Sample Image' width={600} height={350} style={{ borderRadius: '20px', marginTop: '20px' }} />
            </div>

            <div style={{ backgroundColor: '#222222', padding: '20px 30px', maxWidth: '605px', borderRadius: '20px', border: '2px solid #424242' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '30px' }}>Embed Elements</h3>
                <p style={{ color: '#A3A3A3', fontSize: '18px' }}>Enhance your notes by embedding entire websites & videos</p>
              </div>
              <Image src={sampleImageEmbed} layout='responsive' alt='Sample Image' width={600} height={350} style={{ borderRadius: '20px', marginTop: '20px' }} />
            </div>
          </div>
        </section>

        <section style={{ marginTop: '120px' }}>
          <h1 style={{ fontSize: '60px', fontWeight: 'bold' }}>It's your time to shine.</h1>
          <Button onClick={() => signIn('google')} style={{ backgroundColor: '#54D8B3', color: 'white', padding: '20px 40px', borderRadius: '15px' }}>Get Started Now</Button>

          <div className="responsive-container" style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginTop: '40px', textAlign: 'left' }}>
            <div className="hover-on-div" style={{ backgroundColor: '#222222', padding: '20px 30px', borderRadius: '20px', border: '2px solid #424242' }}>
              <h3>Customer 1</h3>
              <p style={{ color: '#A3A3A3' }}>“An incredible app. The distinction between Opal Labs and its competitors is beyond words.”</p>
            </div>

            <div className="hover-on-div" style={{ backgroundColor: '#222222', padding: '20px 30px', borderRadius: '20px', border: '2px solid #424242', textAlign: 'left' }}>
              <h3>Customer 2</h3>
              <p style={{ color: '#A3A3A3' }}>“Discovering Opal Labs has been a game-changer for my productivity, with its intuitive interface and seamless functionality.”</p>
            </div>

            <div className="hover-on-div" style={{ backgroundColor: '#222222', padding: '20px 30px', borderRadius: '20px', border: '2px solid #424242', textAlign: 'left' }}>
              <h3>Customer 3</h3>
              <p style={{ color: '#A3A3A3' }}>“Wow. Just wow. I've found myself effortlessly organizing my thoughts and tasks like never before.”</p>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------ Main Sections ------------------ */}
      <footer style={{ marginTop: '120px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', alignItems: 'center' }}>
          <div>
            <Image src={logoImage} alt='User Image' width={100} height={100} />
            <p style={{ textAlign: 'center', marginTop: '20px' }}>© 2024 Opal Labs. All rights reserved.</p>
          </div>
          <div>
            <p>Follow us</p>
            <div className='footer-links responsive-container' style={{ display: 'flex', gap: '20px' }}>
              <a href='https://abdulhadikhan.netlify.app/' target='_blank' rel='noreferrer' aria-label='Portfolio'><p>Portfolio</p></a>
              <a href='https://www.linkedin.com/in/abdul-hadi-khan/' target='_blank' rel='noreferrer' aria-label='LinkedIn'><p>LinkedIn</p></a>
              <a href='https://www.youtube.com/@learningexpressway/videos' target='_blank' rel='noreferrer' aria-label='YouTube'><p>YouTube</p></a>
              <a href='https://github.com/AbdulDevHub/' target='_blank' rel='noreferrer' aria-label='GitHub'><p>GitHub</p></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
