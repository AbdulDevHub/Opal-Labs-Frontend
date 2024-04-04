import React, { useCallback, useEffect, useState } from 'react'

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import LanguageIcon from '@mui/icons-material/Language'

import NewElementMenu from '@/components/DashboardComponents/NewElementMenu'
import IframeToolbarElement from '@/components/Toolbar/Iframe'
import styled from 'styled-components'
import isURL from 'validator/lib/isURL'

interface Item {
  type: string;
  content: string;
  elementStyling: string;
  element_uuid: string;
}

{/* PROPS TYPE VALUES FOR IFRAME COMPONENT */ }
interface IframeElementProps {
  item: { type: string; content: string; elementStyling: string; element_uuid: string }
  index: number
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  handleSelectType: (type: string, index: number) => void
  pageElements: { type: string; content: string; elementStyling: string; element_uuid: string }[]
  isEditable: boolean
  isDarkMode: boolean
  isDraggable: boolean
  setPageElements: (value: Item[] | ((prevState: Item[]) => Item[])) => void
  setComponentFocused: (isFocused: boolean) => void
}

{/* POSITION THE TOOLBAR TO THE TOP OF THE SCREEN */ }
type StyledDivProps = {
  isDarkMode: boolean;
};

const StyledDiv = styled.div<StyledDivProps>`
  position: fixed;
  top: 90px;
  left: 555px;
  background-color: ${props => props.isDarkMode ? '#212121' : 'white'};
  z-index: 1;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid ${props => props.isDarkMode ? 'white' : 'lightgray'};

  @media (max-width: 1920px) and (min-width: 870px) {
    left: calc(990px + ((100vw - 1920px) / 2));
  }

  @media (max-width: 870px) {
    left: 460px;
  }

  @media (max-width: 884px) {
    top: calc(90px + 25px);
  }
`;

/**
 * Generates a React functional component for an iframe element with toolbar functionality.
 *
 * @param {IframeElementProps} item - The item representing the iframe element
 * @param {number} index - The index of the element
 * @param {Function} handleDeleteContent - Function to handle deletion of content
 * @param {Function} moveElement - Function to move the element
 * @param {Function} handleSelectType - Function to handle selection of type
 * @param {Array} pageElements - Array of page elements
 * @param {boolean} isEditable - Flag indicating if the element is editable
 * @param {boolean} isDraggable - Flag indicating if the element can be dragged
 * @param {Function} setPageElements - Function to set page elements
 * @param {Function} setComponentFocused - Function to set the focused component
 * @return {JSX.Element} The rendered React component
 */
const IframeElement: React.FC<IframeElementProps> = ({
  item,
  index,
  handleDeleteContent,
  moveElement,
  handleSelectType,
  pageElements,
  isEditable,
  isDarkMode,
  isDraggable,
  setPageElements,
  setComponentFocused
}) => {
  {/* -------------------------- IFRAME STATES -----------------------*/ }
  const [showError, setShowError] = useState(false)
  const [showIframeInput, setShowIframeInput] = useState(false)
  const [iframeApplyUrl, setIframeApplyUrl] = useState(false)
  const [iframeUrl, setIframeUrl] = useState(item.content)
  const [appliedIframeUrl, setAppliedIframeUrl] = useState('')
  const [isIframeFocused, setIframeFocused] = useState(false)
  const [iframeActive, setIframeActive] = useState(false)

  {/* -------------------------- IFRAME EFFECTS -----------------------*/ }
  {/* CHECK IF URL IS VALID, IF SO, SET APPLIED URL */ }
  const checkURL = useCallback(() => {
    if (isURL(iframeUrl) || iframeUrl === '') {
      setShowIframeInput(false)
      setShowError(false)
      setAppliedIframeUrl(iframeUrl)
      if (iframeUrl !== '') setIframeActive(true)

      // Save the iframeUrl into the pageElements state
      const updatedContent = {
        ...item,
        content: iframeUrl,
        ...(item.element_uuid ? { element_uuid: item.element_uuid } : {})
      }
      setPageElements([
        ...pageElements.slice(0, index),
        updatedContent,
        ...pageElements.slice(index + 1)
      ])

    } else {
      setIframeActive(false)
      setShowError(true)
    }
    setIframeApplyUrl(false)
  }, [iframeUrl, pageElements, index, item, setPageElements])

  {/* CHECK IF APPLIED URL IT IS VALID FIRST */ }
  useEffect(() => {
    if (iframeApplyUrl) checkURL()
  }, [iframeApplyUrl, checkURL, setIframeActive])

  {/* APPLY IFRAME URL IF IT ALREADY EXISTS IN PAGE ELEMENTS */ }
  useEffect(() => {
    if (item.content !== '') checkURL()
    // No dependencies added b/c only want to run once
  }, []) // eslint-disable-line

  {/* IF USER CLICKS OUTSIDE OF IFRAME, MAKE IT LOSE FOCUS */ }
  useEffect(() => {
    /**
     * Handles the click event outside of the 'iframeDiv' element.
     *
     * @param {MouseEvent} event - The click event object.
     */
    function handleClickOutside(event: MouseEvent) {
      if ((event.target as Element).id !== 'iframeDiv') {
        setIframeFocused(false)
        setComponentFocused(false)
        setShowIframeInput(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('click', handleClickOutside)
    }
  }, [setComponentFocused])

  {/* -------------------------- IFRAME RENDER -----------------------*/ }
  return (
    <div style={{ width: '100%' }}>

      {/* TOOLBAR */}
      {(isIframeFocused || showIframeInput) && !isDraggable && isEditable && (
        <StyledDiv isDarkMode={isDarkMode}>
          <IframeToolbarElement
            index={index}
            handleDeleteContent={handleDeleteContent}
            moveElement={moveElement}
            isDarkMode={isDarkMode}
            setIframeUrl={setIframeUrl}
            iframeUrl={iframeUrl}
            showIframeInput={showIframeInput}
            setShowIframeInput={setShowIframeInput}
            setIframeApplyUrl={setIframeApplyUrl}
            setComponentFocused={setComponentFocused}
          />
        </StyledDiv>
      )}

      {/* IFRAME COMPONENT => INACTVE, ACTIVE, AND ERROR MODE*/}
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px" }}>
        {(appliedIframeUrl === '' && !showError) ? (
          <div
            id="iframeDiv"
            style={{
              display: 'flex',
              width: '100%',
              background: isDarkMode ? '#424242' : '#F5F5F5',
              padding: '15px 20px',
              borderRadius: '5px',
              outline: isIframeFocused ? '2px solid #1976d2' : 'none',
            }}
            onClick={() => { setIframeFocused(true); setComponentFocused(true); }}
          >
            <LanguageIcon style={{ marginRight: '10px', color: isDarkMode ? 'white' : 'black' }} />
            <p style={{ margin: '0', color: isDarkMode ? 'white' : 'black' }}>Missing URL</p>
          </div>
        ) : iframeActive ? (
          <div
            id="iframeDiv"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isDarkMode ? '#424242' : '#F5F5F5',
              borderRadius: '5px',
              outline: isIframeFocused ? '2px solid #1976d2' : 'none',
            }}
            onClick={() => { setIframeFocused(true); setComponentFocused(true); }}
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
              outline: isIframeFocused ? '2px solid #1976d2' : 'none',
            }}
            onClick={() => { setIframeFocused(true); setComponentFocused(true); }}
          >
            <LanguageIcon style={{ marginRight: '10px' }} />
            <p style={{ margin: '0' }}>Provided URL does not support embed</p>
          </div>
        ) : null}

        {isDraggable && isEditable && <DragIndicatorIcon />}
      </div>

      {/* NEW ELEMENT MENU */}
      <NewElementMenu
        index={index}
        isTopElement={false}
        isEditable={isEditable}
        isDarkMode={isDarkMode}
        isDraggable={isDraggable}
        handleSelectType={handleSelectType}
      />
    </div>
  )
}

export default IframeElement