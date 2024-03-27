import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

import { AlertColor } from '@mui/material/Alert'

type Toast = {
  key?: number
  type: AlertColor
  message: ReactNode
  autoHide?: boolean
}

type Props = {
  open: boolean
  toast: Toast
  setToast: (toast: Toast) => void
  onClose: () => void
  onExited: () => void
}

const ToastContext = createContext<Props | undefined>(undefined)

/**
 * Custom hook for accessing the ToastContext.
 *
 * @return {ToastContext} The ToastContext object
 */
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastContext')
  }
  return context
}

/**
 * ToastProvider component for providing toast notifications to the application.
 *
 * @param {{ children: ReactNode }} props - The props object with children as a ReactNode.
 * @return {JSX.Element} The provider component for toast notifications.
 */
export const ToastProvider = (props: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const defaultToast: Toast = { type: 'info', message: '' }
  const [_toast, _setToast] = useState<Toast>(defaultToast)
  const [toastPack, setToastPack] = useState<Toast[]>([])

  useEffect(() => {
    if (toastPack.length && !open) {
      _setToast(toastPack[0])
      setToastPack((prev) => prev.slice(1))
      setOpen(true)
    } else if (toastPack.length && open) {
      setOpen(false)
    }
  }, [toastPack, open])

  return (
    <ToastContext.Provider
      value={{
        open,
        toast: _toast,
        setToast: (toast: Toast) =>
          setToastPack((prev) => [...prev, { ...toast, key: Date.now() }]),
        onClose: () => setOpen(false),
        onExited: () => _setToast(defaultToast),
      }}
    >
      {props.children}
    </ToastContext.Provider>
  )
}
