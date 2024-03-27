import React, { useState } from 'react'

{/* PROPS TYPE VALUES FOR ACCOUNT TYPE DISPLAY COMPONENT */ }
interface AccountTypeDisplayProps {
  status: string
  setStatus: (status: string) => void
  setIsUserBroke: (isBroke: boolean) => void
}

const AccountTypeDisplay: React.FC<AccountTypeDisplayProps> = ({ status: initialStatus, setStatus, setIsUserBroke }) => {
  const [status, updateStatus] = useState(initialStatus)

  let accountType = status.toUpperCase()
  let accountTypeDisplayBackgroundColor = status === 'premium' ? 'gold' : (status === 'freemium' ? 'grey' : 'purple')
  let accountTypeDisplayTextColor = status === 'premium' ? 'black' : "white"

  const testAccounts = () => {
    let newStatus = status === 'premium' ? 'enterprise' : (status === 'enterprise' ? 'freemium' : 'premium')
    updateStatus(newStatus)
    setStatus(newStatus)
    setIsUserBroke(newStatus === 'freemium')
  }

  return (
    <div onClick={() => testAccounts()} style={{
      fontSize: '0.5rem', marginBottom: '5px', marginTop: '5px',
      backgroundColor: accountTypeDisplayBackgroundColor, color: accountTypeDisplayTextColor, cursor: 'pointer',
      padding: '3px 5px', borderRadius: '5px', width: 'max-content', marginLeft: '20px', userSelect: 'none'
    }}>{accountType}</div>
  )
}

export default AccountTypeDisplay