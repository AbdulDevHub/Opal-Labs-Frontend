import { SessionProvider } from 'next-auth/react'

import CodeBlockElement from '@/components/OurWebsiteElements/CodeBlock'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof CodeBlockElement> = {
  component: CodeBlockElement,
  title: 'Components/CodeBlockElement',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <>
        <SessionProvider session={null}>
          <Story />
        </SessionProvider>
      </>
    ),
  ],
  argTypes: {
    isEditable: {
      control: 'boolean',
      defaultValue: true,
    },
  },
}

export default meta

export const Base: StoryObj<typeof CodeBlockElement> = {
  args: {
    isEditable: true,
  },
}