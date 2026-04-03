import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Content')
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('blog').title('Blog'),
              S.documentTypeListItem('portfolio').title('Portfolio'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Taxonomy')
        .child(
          S.list()
            .title('Taxonomy')
            .items([
              S.documentTypeListItem('category').title('Category'),
              S.documentTypeListItem('tag').title('Tag'),
            ]),
        ),
    ])
