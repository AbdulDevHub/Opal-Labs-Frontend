import React, { useCallback, useEffect, useState } from 'react'

import LanguageIcon from '@mui/icons-material/Language'

import isURL from 'validator/lib/isURL'

{/* PROPS TYPE VALUES FOR IFRAME COMPONENT */ }
interface IframeElementProps {
  item: { type: string; content: string; elementStyling: string; element_uuid: string }
}

/**
 * Generates a React functional component for an iframe element with toolbar functionality.
 *
 * @param {IframeElementProps} item - The item representing the iframe element
 * @return {JSX.Element} The rendered React component
 */
const IframeElement: React.FC<IframeElementProps> = ({
  item,
}) => {
  {/* -------------------------- IFRAME STATES -----------------------*/ }
  const [showError, setShowError] = useState(false)
  const iframeUrl = item.content
  const [appliedIframeUrl, setAppliedIframeUrl] = useState('')
  const [iframeActive, setIframeActive] = useState(false)

  {/* -------------------------- PAGE CONTENT EFFECTS -----------------------*/ }
  {/* CHECK IF URL IS VALID, IF SO, SET APPLIED URL */ }
  const checkURL = useCallback(() => {
    if (isURL(iframeUrl)) {
      setShowError(false)
      setAppliedIframeUrl(iframeUrl)
      setIframeActive(true)
    } else {
      setIframeActive(false)
      setShowError(true)
    }
  }, [iframeUrl])

  {/* APPLY IFRAME URL IF IT ALREADY EXISTS IN PAGE ELEMENTS */ }
  useEffect(() => {
    if (item.content !== '') checkURL()
    // No dependencies added b/c only want to run once
  }, []) // eslint-disable-line

  {/* -------------------------- IFRAME RENDER -----------------------*/ }
  return (
    <div style={{ width: '100%' }}>
      {/* IFRAME COMPONENT => INACTVE, ACTIVE, AND ERROR MODE*/}
      {(appliedIframeUrl === '' && !showError) ? (
        <div
          id="iframeDiv"
          style={{
            display: 'flex',
            width: '100%',
            background: '#F5F5F5',
            padding: '15px 20px',
            borderRadius: '5px',
          }}
        >
          <LanguageIcon style={{ marginRight: '10px' }} />
          <p style={{ margin: '0' }}>Missing URL</p>
        </div>
      ) : iframeActive ? (
        <div
          id="iframeDiv"
          style={{
            padding: '14px',
            backgroundColor: '#F5F5F5',
            borderRadius: '5px',
          }}
        >
          <iframe
            src={appliedIframeUrl}
            width="100%"
            height="400px"
            onError={() => {
              setIframeActive(false)
              setShowError(true)
              setTimeout(() => setShowError(false), 3000)
            }}
          />
        </div>
      ) : showError ? (
        <div
          id="iframeDiv"
          style={{
            backgroundColor: '#FFEBEE',
            borderRadius: '5px',
            color: '#FF5252',
            padding: '15px 20px',
            display: 'flex',
            width: '100%',
          }}
        >
          <LanguageIcon style={{ marginRight: '10px' }} />
          <p style={{ margin: '0' }}>Provided URL does not support embed</p>
        </div>
      ) : null}


      {/* NEW ELEMENT MENU GAP*/}
      <div style={{ height: '35px', width: '100%', marginTop: '10px' }}></div>
    </div>
  )
}

export default IframeElement