import NewElementMenu from '@/components/DashboardComponents/NewElementMenu'
import { APIProvider } from '@/contexts/API'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof NewElementMenu> = {
  component: NewElementMenu,
  title: 'Components/NewElementMenu',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <APIProvider>
        <Story />
      </APIProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof meta>
export const Base: Story = {
  args: {},
}