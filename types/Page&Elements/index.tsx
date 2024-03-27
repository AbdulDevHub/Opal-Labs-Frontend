export type PageListReq = {}

export type PageListResp = {
  pages: Page[]
}

export type PageGetReq = {
  page_uuid: string
}

export type PageGetResp = {
  page: Page
  elements: Elements[] // BE send empty list if there’s nothing
}

export type Page = {
  page_uuid: string
  page_name: string
  is_root: boolean
  element_positions: string[] // BE send empty list if there’s nothing
  parent_page_uuid?: string
  public_page: boolean
  page_uuid_url?: string
}

export type Elements = {
  element_uuid: string
  type: string
  content: { text: string }
  etc: {
    color?: string
    background_color?: string
    bold?: boolean
    italics?: boolean
    underline?: boolean
    url?: string
  }
  size?: string // This field is optional and can be omitted for certain types
}

//PAGE CREATE (POST)
/**
 * Endpoint to create a page object
 * 400 if uuid is already being used (99.999….% won't happen but just in case)
 * 200 Success, 401 No Auth Token, 400 Token Invalid
 */
export type PageCreateReq = {
  page_uuid: string // FE generates uuid
  page_name?: string
  is_root?: boolean
  parent_page_id?: string
}

export type PageCreateResp = {}

// PAGE UPDATE (POST)
/**
 * Endpoint to update the data of a specific page and all of its elements
 * Only send elements that have been updated / deleted / created (unedited elements not included in the arrays)
  - For example: if you just rename page or just reorder elements, req body should not have any elements or remove_elements objects
 * Unknown uuids are to be considered as new created elements
 * 200 Success, 401 No Auth Token, 400 Token Invalid, 404 if page doesn't exist / belong to current user
 * 400 if uuid is already being used for new element objects (99.999….% won't happen but just in case)
 */
export type PageUpdateReq = {
  page: PageUpdateObject
  elements?: ElementsUpdateObject[] // List of elements that have been changed
  remove_elements?: string[] // List of element uuid to delete from page
}

export type PageUpdateResp = {}

export type PageUpdateObject = {
  page_uuid: string
  page_name: string
  is_root: boolean
  element_positions: string[] // uuid of ALL elements ordered in the page
  parent_page_uuid?: string
  public_page: boolean
}

/**
 * Element types include: p, h1, h2, h3 (for now)
 * For types ‘p’, ‘h1’, ‘h2’, ‘h3’: 
  - content: {text: string}
  - etc: {color? : string, background_color? : string, bold?: boolean, italics?: boolean, underline?: boolean, url? : string}
  - size: field doesn't exist for these types
 */
export type ElementsUpdateObject = {
  element_uuid: string // FE generates uuid for new elements
  type: string
  content: {} // Check below for the specifics
  etc: {} // Check below for the specifics
  size?: string // Check below for the specifics
}

//Page Delete (POST)
/**
 * Endpoint to delete a page object and all of its child elements & pages
 * 200 Success, 401 No Auth Token, 400 Token Invalid, 404 if page doesn't exist / belong to current user
 */

export type PageDeleteReq = {
  page_uuid: string
}

export type PageDeleteResp = {}