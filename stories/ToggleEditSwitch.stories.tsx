import ToggleEditSwitch from '@/components/DashboardComponents/ToggleEditSwitch'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ToggleEditSwitch> = {
  component: ToggleEditSwitch,
  title: 'Components/ToggleEditSwitch',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <>
        <Story />
      </>
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