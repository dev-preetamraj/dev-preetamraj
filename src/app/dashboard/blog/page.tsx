import Blogs from './_components/actions/blogs';
import EditBlog from './_components/actions/edit-blog';
import PreviewBlog from './_components/actions/preview-blog';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page = ({ searchParams }: Props) => {
  if (!searchParams) return <Blogs />;

  const action = searchParams['action'];
  const _id = searchParams['_id'] as string;

  switch (action) {
    case 'edit':
      if (!_id) return null;
      return <EditBlog _id={_id} />;
    case 'preview':
      if (!_id) return null;
      return <PreviewBlog _id={_id} />;
    default:
      return <Blogs />;
  }
};

export default Page;
