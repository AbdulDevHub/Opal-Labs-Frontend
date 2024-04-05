import React from 'react'

import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'

{/* PROPS TYPE VALUES FOR CHECKBOX COMPONENT */ }
interface CheckBoxProps {
  item: { type: string; content: string; elementStyling: string; element_uuid: string }
}

/**
 * Renders a checkbox component with a text field next to it.
 *
 * @param {CheckBoxProps} item - The item object containing the checkbox props.
 * @return {ReactElement} The rendered checkbox component.
 */
const CheckBox: React.FC<CheckBoxProps> = ({
  item,
}) => {
  {/* -------------------------- CHECKBOX RENDER -----------------------*/ }
  return (
    <>
      {/* CHECKBOX COMPONENT */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '20px' }}>
        <Checkbox checked={item.elementStyling === 'checked'} />
        <TextField
          value={item.content}
          multiline
          variant="outlined"
          size="small"
          fullWidth
        />
      </div>

      {/* NEW ELEMENT MENU GAP*/}
      <div style={{ height: '35px', width: '100%', marginTop: '10px' }}></div>
    </>
  )
}

export default CheckBox