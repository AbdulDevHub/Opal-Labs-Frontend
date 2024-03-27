import { useState } from 'react'

import CustomTextField from '@/components/OurWebsiteElements/CustomTextField'
import type { Meta, StoryObj } from '@storybook/react'
import { v4 as uuidv4 } from 'uuid'

interface StoryArgs {
  index: number
  isEditable: boolean
  isDarkMode: boolean
  isDraggable: boolean
}

interface Item {
  type: string;
  content: string;
  elementStyling: string;
  element_uuid: string;
}

const meta: Meta<typeof CustomTextField> = {
  title: 'Components/CustomTextField',
  component: CustomTextField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
}

export default meta

export const Base: StoryObj<StoryArgs> = {
  render: (args) => {
    const [pageElements, setPageElementsState] = useState<
      { type: string; content: string; elementStyling: string; element_uuid: string }[]
    >([{ type: 'Paragraph', content: 'Sample text', elementStyling: '', element_uuid: 'demo-uuid' }])

    // Define a wrapper function that matches the expected type
    const setPageElements = (
      newContent: Item[] | ((prevState: Item[]) => Item[])
    ) => {
      // If newContent is a function, call it with the current state
      const contentToUse = typeof newContent === 'function' ? newContent(pageElements) : newContent;

      // Transform contentToUse to ensure each item has a uuid
      const contentWithUuid = contentToUse.map((item) => ({
        ...item,
        // Generate a uuid if it doesn't exist
        element_uuid: item.element_uuid || uuidv4(),
      }))
      setPageElementsState(contentWithUuid)
    }

    const handleDeleteContent = (index: number) => console.log(`Delete content at ${index}`)
    const moveElement = (index: number, moveBy: number) => console.log(`Move element at ${index} by ${moveBy}`)
    const handleSelectType = (type: string) => console.log(`Type selected: ${type}`)
    const setComponentFocused = (isFocused: boolean) => console.log(`Component focused: ${isFocused}`)

    return (
      <CustomTextField
        {...args}
        item={pageElements[0]}
        index={0}
        pageElements={pageElements}
        handleDeleteContent={handleDeleteContent}
        moveElement={moveElement}
        handleSelectType={handleSelectType}
        setPageElements={setPageElements}
        setComponentFocused={setComponentFocused}
      />
    )
  },
  args: {},
}