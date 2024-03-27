import TextField from '@mui/material/TextField'

{/* PROPS TYPE VALUES FOR CUSTOM TEXT FIELD COMPONENT */ }
interface CustomTextFieldProps {
  item: { type: string; content: string; elementStyling: string; element_uuid: string }
  isEditable: boolean
}

/**
 * Generates the custom text field component with various styling and editing options.
 *
 * @param {CustomTextFieldProps} item - The properties for the custom text field
 * @param {boolean} isEditable - Flag indicating if the text field is editable
 * @return {JSX.Element} The custom text field component
 */
const CustomTextField: React.FC<CustomTextFieldProps> = ({
  item,
  isEditable,
}) => {
  {/* -------------------------- CUSTOM TEXT FIELD RENDER -----------------------*/ }
  return (
    <div>

      {/* CUSTOM TEXT FIELD COMPONENT */}
      <div style={{ borderRadius: '5px', display: 'flex' }}>
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
            style: {
              fontSize: item.type === 'Heading 1' ? '48px' : item.type === 'Heading 2' ? '34px' : item.type === 'Heading 3' ? '23px' : '16px',
              color: item.elementStyling.split(';').find(style => style.includes('color'))?.split(':')[1]?.trim() || '#000000',
              backgroundColor: item.elementStyling.split(';').find(style => style.includes('background-color'))?.split(':')[1]?.trim() || 'transparent',
              fontWeight: item.elementStyling.includes('bold') ? 'bold' : 'normal',
              fontStyle: item.elementStyling.includes('italic') ? 'italic' : 'normal',
              textDecoration: item.elementStyling.includes('underline') ? 'underline' : 'none',
              paddingLeft: '10px'
            }
          }}
          autoFocus={item.elementStyling.includes('autofocus')} // Set cursor to the new text field
        />
      </div>


      {/* NEW ELEMENT MENU GAP*/}
      <div style={{ height: '35px', width: '100%', marginTop: '10px' }}></div>
    </div>
  )
}

export default CustomTextField