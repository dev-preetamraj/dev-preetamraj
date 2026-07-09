import { type SchemaTypeDefinition } from 'sanity';

import { blockContentType } from './blockContentType';
import { categoryType } from './categoryType';
import { commentType } from './commentType';
import { postType } from './postType';
import { projectType } from './projectType';
import { tagType } from './tagType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    postType,
    projectType,
    categoryType,
    tagType,
    commentType,
    blockContentType,
  ],
};
