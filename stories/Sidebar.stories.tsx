import { SessionProvider } from 'next-auth/react'

import Sidebar from '@/components/Sidebar'
import { APIProvider } from '@/contexts/API'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  title: 'Components/Sidebar',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <APIProvider>
        <SessionProvider>
          <Story />
        </SessionProvider>
      </APIProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    selectedPageUuid: {
      control: { type: 'radio' },
      options: ['uuid-1', 'uuid-2', 'uuid-3'],
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>
export const Base: Story = {
  args: {},
}
