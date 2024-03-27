import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import AnalyticsChart from '@/components/PublishedPageElements/AnalyticsChart'
import CalloutElement from '@/components/PublishedPageElements/Callout'
import CheckBox from '@/components/PublishedPageElements/CheckBox'
import CodeBlockElement from '@/components/PublishedPageElements/CodeBlock'
import CustomTextField from '@/components/PublishedPageElements/CustomTextField'
import IframeElement from '@/components/PublishedPageElements/Iframe'
import NestedPageElement from '@/components/PublishedPageElements/NestedPage'
import { usePageGet } from '@/hooks/Page/usePageGet'
import Error403 from 'public/images/403.png'
import loadingGif from 'public/images/loader.gif'
import logo from 'public/images/opal.png'

/**
 * A functional component for rendering the Live Page.
 *
 * @return {JSX.Element} The rendered Live Page component
 */
const LivePage = () => {
  const router = useRouter()
  // The uuid below should link to the generated UUID from the handlePublish function in PageContent.tsx
  const { uuid } = router.query

  const isEditable = false
  // Add a new state for tracking loading status
  const [isLoading, setIsLoading] = useState(true)

  // Get the Page object associated with the UUID
  const {
    pageTitle,
    dateViewCount,
    pageElements,
    isPublicPage,
  } = usePageGet(uuid as string, setIsLoading)

  return (
    <main style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      width: '100%', margin: '0'
    }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '85vh', // 100vh - header height
          width: '70%',
          margin: '0',
          marginTop: '10px'
        }}
      >
        {/* Render loading indicator if page still being fetched from server */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Image src={loadingGif} alt="Loading..." />
          </div>
        ) : (
          !isPublicPage ? (
            // Render error if user doesn't have access to page
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Image src={Error403} alt="403 Error: Access Denied" />
            </Box>
          ) : (
            // Render your page content when isLoading is false (complete)
            <>
              {/* Page Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px 8px 50px', width: '100vw', height: '80px', borderBottom: '1px solid #E0E0E0', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Image src={logo} alt={'Site Opal Logo'} width={50} height={50} />
                  <Typography variant="h4" sx={{ marginLeft: '20px', lineHeight: '40px', letterSpacing: '0.25px', fontSize: '34px', fontWeight: 400 }}>
                    Opalescence
                  </Typography>
                </div>

                <Button onClick={() => router.push('/')} sx={{ marginLeft: '20px' }} variant="contained" color="secondary">
                  Go To Homepage
                </Button>
              </div>


              {/* Page Title Textfield*/}
              <TextField
                variant="standard"
                placeholder="Untitled"
                fullWidth
                value={pageTitle}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    // Override Color For Disabled TextField
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                    }
                  },
                  style: {
                    fontSize: '60px',
                    paddingLeft: '10px'
                  }
                }}
                style={{ marginBottom: '20px' }}
                disabled={!isEditable}
              />

              {/* Generated Page Elements/Widgets */}
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <DndProvider backend={HTML5Backend}>
                  {pageElements.map((item, index) => {
                    const renderElement = () => {
                      if (item.type === 'iFrame') {
                        return <IframeElement key={index} item={item} />
                      } else if (item.type === 'Callout') {
                        return <CalloutElement key={index} item={item} isEditable={isEditable} />
                      } else if (item.type === 'Code Block') {
                        return <CodeBlockElement key={index} item={item} />
                      } else if (item.type === 'Page Analytics') {
                        return <AnalyticsChart key={index} dateViewCount={dateViewCount} />
                      } else if (item.type === 'Nested Page') {
                        return <NestedPageElement key={index} />
                      } else if (item.type === 'Checkbox') {
                        return <CheckBox key={index} item={item} />
                      } else {
                        return <CustomTextField key={index} item={item} isEditable={isEditable} />
                      }
                    }

                    const element = renderElement()
                    return element
                  })}
                </DndProvider>
              </Box>
            </>
          )
        )}
      </div>
    </main >
  )
}

export default LivePage