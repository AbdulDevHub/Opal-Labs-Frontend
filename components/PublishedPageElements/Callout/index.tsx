import React from 'react'

import TextField from '@mui/material/TextField'

{/* PROPS TYPE VALUES FOR CALLOUT COMPONENT */ }
interface CalloutElementProps {
  item: { type: string; content: string; elementStyling: string; element_uuid: string }
  isEditable: boolean
}

const CalloutElement: React.FC<CalloutElementProps> = ({
  item,
  isEditable,
}) => {
  {/* -------------------------- CALLOUT RENDER -----------------------*/ }
  return (
    <div style={{ width: "100%" }}>
      {/* CALLOUT COMPONENT */}
      <div style={{
        width: "100%",
        display: "flex",
        backgroundColor: "#F5F5F5",
        padding: " 10px",
        borderRadius: "5px",
      }}>

        {/* CALLOUT EMOJI */}
        <p style={{ marginTop: "0px", marginBottom: "0px", marginRight: "10px", paddingTop: "3px" }}>
          {item.elementStyling}
        </p>

        {/* CALLOUT TEXT */}
        <TextField
          value={item.content}
          fullWidth
          multiline
          variant="standard"
          disabled={(!isEditable)}
          InputProps={{
            disableUnderline: true,
            sx: {
              // Override Color For Disabled TextField
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000000',
              },
            },
          }}
        />
      </div>

      {/* NEW ELEMENT MENU GAP*/}
      <div style={{ height: '35px', width: '100%', marginTop: '10px' }}></div>
    </div >
  )
}

export default CalloutElement