import { slugToTitle } from '@/lib/utils';

const TagBlogListPage = ({ params }: { params: { tagTitle: string } }) => {
  return (
    <div>
      <p>{slugToTitle(params.tagTitle)}</p>
    </div>
  );
};

export default TagBlogListPage;
