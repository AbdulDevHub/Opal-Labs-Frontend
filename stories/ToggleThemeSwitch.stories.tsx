import ToggleThemeSwitch from '@/components/DashboardComponents/ToggleThemeSwitch'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ToggleThemeSwitch> = {
  component: ToggleThemeSwitch,
  title: 'Components/ToggleThemeSwitch',
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