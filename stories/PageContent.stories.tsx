import PageContent from '@/components/PageContent'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof PageContent> = {
  component: PageContent,
  title: 'Components/PageContent',
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
  argTypes: {
    selectedPageUuid: {
      control: { type: 'radio' },
      options: ['uuid-1', 'uuid-2', 'uuid-3'],
    },
    isEditable: {
      control: 'boolean',
      defaultValue: true,
    },
    isDarkMode: {
      control: 'boolean',
      defaultValue: false,
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>
export const Base: Story = {
  args: {},
}
