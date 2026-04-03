import { CodeBlockIcon, ImageIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block' as const,
      styles: [
        { title: 'Normal', value: 'normal' as const },
        { title: 'H2', value: 'h2' as const },
        { title: 'H3', value: 'h3' as const },
        { title: 'H4', value: 'h4' as const },
        { title: 'Quote', value: 'blockquote' as const },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' as const },
          { title: 'Emphasis', value: 'em' as const },
          { title: 'Underline', value: 'underline' as const },
          { title: 'Code', value: 'code' as const },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) =>
                  rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image' as const,
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (rule) =>
            rule.required().warning('Alt text is important for accessibility and SEO'),
        }),
      ],
    }),
    defineArrayMember({
      type: 'code' as const,
      icon: CodeBlockIcon,
      options: {
        language: 'typescript',
        languageAlternatives: [
          { title: 'TypeScript', value: 'typescript' },
          { title: 'JavaScript', value: 'javascript' },
          { title: 'Python', value: 'python' },
          { title: 'Go', value: 'go' },
          { title: 'Rust', value: 'rust' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'JSON', value: 'json' },
          { title: 'Bash', value: 'bash' },
          { title: 'SQL', value: 'sql' },
          { title: 'GraphQL', value: 'graphql' },
          { title: 'Markdown', value: 'markdown' },
          { title: 'GROQ', value: 'groq' },
          { title: 'Plain Text', value: 'text' },
        ],
        withFilename: true,
      },
    }),
  ],
})
