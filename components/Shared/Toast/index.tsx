import Alert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import Snackbar from '@mui/material/Snackbar'

import { useToast } from '@/contexts/Toast'

/**
 * Function component for displaying toast notifications.
 *
 * @return {JSX.Element} The JSX element representing the toast notification
 */
const Toast = () => {
  const { open, toast, onClose, onExited } = useToast()

  const autoHideDuration = toast.autoHide === false ? null : 5000

  /**
   * Handles the close event of the component.
   *
   * @param {any} _ - The first parameter (unused).
   * @param {string} reason - The reason for the close event (optional).
   * @return {void} This function does not return a value.
   */
  const handleClose = (_: any, reason?: string) => {
    if (reason === 'clickaway' && !autoHideDuration) return
    onClose()
  }

  {/* -------------------------- TOAST RENDER -----------------------*/ }
  return (
    <Snackbar
      open={open}
      key={toast.key}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={Slide}
      TransitionProps={{ onExited }}
      onClose={handleClose}
    >
      <Alert
        severity={toast.type}
        onClose={handleClose}
        sx={{
          width: '100%',
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  )
}

export default Toast
