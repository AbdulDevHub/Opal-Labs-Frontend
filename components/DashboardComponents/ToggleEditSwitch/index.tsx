import * as React from 'react'

import LockIcon from '@mui/icons-material/Lock'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import FormControlLabel from '@mui/material/FormControlLabel'
import { styled } from '@mui/material/styles'
import Switch, { SwitchProps } from '@mui/material/Switch'

/**
 * Custom styled switch component for iOS theme.
 */
const IOSSwitch = styled(({ ...props }: SwitchProps & { isDarkMode: boolean }) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme, isDarkMode }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#1976D2',
      '& + .MuiSwitch-track': {
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(25, 118, 210, 0.5)'
            : isDarkMode
              ? 'rgba(25, 118, 210, 0.5)'
              : 'rgba(25, 118, 210, 0.2)',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.38)' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}))

interface ToggleEditSwitchProps {
  /** Toggle for whether or not dark mode is activated */
  isDarkMode: boolean
  /** Toggle for whether or not edit mode is activated */
  isEditable: boolean
  /** Handles the current page on whether it's editable or not */
  toggleEdit: () => void
}

/**
 * React functional component for rendering a toggle switch for editing mode.
 *
 * @param {boolean} isDarkMode - Indicates whether the dark mode is enabled.
 * @param {boolean} isEditable - Indicates whether the edit mode is enabled.
 * @param {function} toggleEdit - Function to toggle the edit mode.
 * @return {JSX.Element} The rendered toggle switch component.
 */
const ToggleEditSwitch: React.FC<ToggleEditSwitchProps> = ({
  isDarkMode,
  isEditable,
  toggleEdit,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }} >
      <LockIcon fontSize='small' sx={{ color: isDarkMode ? '#fff' : 'black' }} />
      <FormControlLabel
        control={
          <IOSSwitch
            checked={isEditable}
            onChange={toggleEdit}
            sx={{ m: 1 }}
            isDarkMode={isDarkMode}
          />
        }
        label=""
        sx={{ color: isDarkMode ? '#fff' : 'black', margin: '0' }}
      />
      <ModeEditIcon fontSize='small' sx={{ color: isDarkMode ? '#fff' : 'black' }} />
    </div>
  )
}

export default ToggleEditSwitch