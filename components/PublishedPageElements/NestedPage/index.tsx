import DescriptionIcon from '@mui/icons-material/Description'

/**
 * React functional component for rendering a nested page element.
 *
 * @return {JSX.Element} The rendered nested page element
 */
const NestedPageElement = () => {
  {/* -------------------------- NESTED PAGE STATES -----------------------*/ }
  // Find the current page using the pageUUID
  const currentPageName = "Not Available On Published Page"

  {/* -------------------------- NESTED PAGE RENDER -----------------------*/ }
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

      {/* NESTED PAGE COMPONENT */}
      <div style={{ display: "inline-flex", alignItems: "center", padding: "5px 20px", cursor: "pointer" }}>
        <DescriptionIcon style={{ marginRight: "10px" }} />
        <p>{currentPageName}</p>
      </div>

      {/* NEW ELEMENT MENU GAP*/}
      <div style={{ height: '35px', width: '100%', marginTop: '10px' }}></div>
    </div>
  )
}

export default NestedPageElement