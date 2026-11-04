import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'

import { coverBackground } from '@/lib/blocks/covers'
import { PAGE_TEMPLATES, PageTemplate } from '@/lib/blocks/templates'

/** Shown on an empty page: one click fills it with a starting structure */
const TemplatePicker = ({ onPick }: { onPick: (template: PageTemplate) => void }) => (
  <Box sx={{ mt: 1 }}>
    <Box sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: 1.25 }}>
      Or start from a template
    </Box>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
        gap: 1.25,
      }}
    >
      {PAGE_TEMPLATES().map((template) => (
        <ButtonBase
          key={template.id}
          onClick={() => onPick(template)}
          sx={{
            flexDirection: 'column',
            alignItems: 'stretch',
            textAlign: 'left',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            transition: 'transform 150ms, box-shadow 150ms, border-color 150ms',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: 'primary.main',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(15,15,15,0.08)',
            },
          }}
        >
          <Box sx={{ height: 36, background: coverBackground(template.cover) }} />
          <Box sx={{ p: 1.25, pt: 0 }}>
            <Box sx={{ fontSize: 24, mt: -1.5, lineHeight: 1 }}>{template.icon}</Box>
            <Box sx={{ fontSize: 14, fontWeight: 600, mt: 0.75 }}>{template.name}</Box>
            <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{template.description}</Box>
          </Box>
        </ButtonBase>
      ))}
    </Box>
  </Box>
)

export default TemplatePicker
