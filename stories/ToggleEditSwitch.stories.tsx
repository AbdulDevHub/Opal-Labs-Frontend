import ToggleEditSwitch from '@/components/DashboardComponents/ToggleEditSwitch'
import { APIProvider } from '@/contexts/API'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ToggleEditSwitch> = {
  component: ToggleEditSwitch,
  title: 'Components/ToggleEditSwitch',
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