import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Box from '@mui/material/Box'

/** A page's emoji, or the default page icon */
const PageIcon = ({ icon, size = 18 }: { icon?: string; size?: number }) => (
  <Box
    component="span"
    aria-hidden
    sx={{
      width: size + 4,
      height: size + 4,
      flexShrink: 0,
      display: 'inline-grid',
      placeItems: 'center',
      fontSize: size - 2,
      lineHeight: 1,
    }}
  >
    {icon || <DescriptionOutlinedIcon sx={{ fontSize: size, opacity: 0.7 }} />}
  </Box>
)

export default PageIcon
