import { type SchemaTypeDefinition } from 'sanity'

import { blockContent } from './blockContent'
import { blog } from './blog'
import { category } from './category'
import { portfolio } from './portfolio'
import { tag } from './tag'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blog, portfolio, category, tag, blockContent],
}
