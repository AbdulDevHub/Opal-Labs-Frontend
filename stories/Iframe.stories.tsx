import { useState } from 'react'

import IframeElement from '@/components/OurWebsiteElements/Iframe' // Ensure the import path matches your project structure
import type { Meta, StoryObj } from '@storybook/react'

interface Item {
  type: string;
  content: string;
  elementStyling: string;
  element_uuid: string;
}

interface StoryArgs {
  index: number
  isEditable: boolean
  isDraggable: boolean
}

const meta: Meta<typeof IframeElement> = {
  title: 'Components/Iframe',
  component: IframeElement,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
}

export default meta

// Define the StoryObj with explicit StoryArgs
export const Base: StoryObj<StoryArgs> = {
  render: (args) => {
    // Mock states and functions needed for the IframeElement component
    const [pageElements, setPageElements] = useState<Item[]>([])
    const handleDeleteContent = (index: number) => console.log(`Delete content at ${index}`)
    const moveElement = (index: number, moveBy: number) => console.log(`Move element at ${index} by ${moveBy}`)
    const handleSelectType = (type: string) => console.log(`Type selected: ${type}`)
    const setComponentFocused = (isFocused: boolean) => console.log(`Component focused: ${isFocused}`)

    return (
      <IframeElement
        {...args}
        item={{ type: 'iframe', content: '', elementStyling: '', element_uuid: '' }}
        index={0}
        handleDeleteContent={handleDeleteContent}
        moveElement={moveElement}
        handleSelectType={handleSelectType}
        pageElements={pageElements}
        isEditable
        isDarkMode
        isDraggable
        setPageElements={setPageElements}
        setComponentFocused={setComponentFocused}
      />
    )
  },
  args: {},
}