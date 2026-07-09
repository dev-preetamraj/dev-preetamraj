'use client';

/**
 * This configuration is used to power the embedded Sanity Studio
 * mounted at `/studio` (see `src/app/studio/[[...tool]]/page.tsx`).
 */

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, projectId } from '@/sanity/env';
import { schema } from '@/sanity/schemaTypes';
import { structure } from '@/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
