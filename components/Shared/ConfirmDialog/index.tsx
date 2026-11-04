import { ReactNode } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

export type ConfirmRequest = {
  title: string
  body: ReactNode
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
}

/** A small "are you sure?" dialog (instead of the browser's confirm) */
const ConfirmDialog = ({
  request,
  onClose,
}: {
  request: ConfirmRequest | null
  onClose: () => void
}) => (
  <Dialog open={Boolean(request)} onClose={onClose} maxWidth="xs" fullWidth>
    {request && (
      <>
        <DialogTitle sx={{ fontSize: 17, fontWeight: 650, pb: 1 }}>{request.title}</DialogTitle>
        <DialogContent sx={{ color: 'text.secondary', fontSize: 14 }}>{request.body}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color={request.danger ? 'error' : 'primary'}
            autoFocus
            onClick={() => {
              request.onConfirm()
              onClose()
            }}
          >
            {request.confirmLabel}
          </Button>
        </DialogActions>
      </>
    )}
  </Dialog>
)

export default ConfirmDialog
