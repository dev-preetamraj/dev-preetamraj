import { CommentIcon } from '@sanity/icons/Comment';
import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Comments split into a moderation queue: pending (awaiting approval)
      // vs approved. Approve by opening a pending comment, ticking "Approved",
      // and publishing.
      S.listItem()
        .title('Comments')
        .icon(CommentIcon)
        .child(
          S.list()
            .title('Comments')
            .items([
              S.listItem()
                .title('Pending approval')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Pending approval')
                    .filter('_type == "comment" && isApproved != true')
                    .defaultOrdering([
                      { field: '_createdAt', direction: 'desc' },
                    ]),
                ),
              S.listItem()
                .title('Approved')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Approved')
                    .filter('_type == "comment" && isApproved == true')
                    .defaultOrdering([
                      { field: '_createdAt', direction: 'desc' },
                    ]),
                ),
            ]),
        ),
      S.divider(),
      // Everything else except the comment type (handled above).
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'comment',
      ),
    ]);
