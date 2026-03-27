import Blogs from './_components/actions/blogs';
import EditBlog from './_components/actions/edit-blog';
import PreviewBlog from './_components/actions/preview-blog';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Page = async (props: Props) => {
  const searchParams = await props.searchParams;
  if (!searchParams) return <Blogs />;

  const action = searchParams['action'];
  const _id = searchParams['_id'] as string;
  const keyword = searchParams['keyword'] as string;

  switch (action) {
    case 'edit':
      if (!_id) return null;
      return <EditBlog _id={_id} />;
    case 'preview':
      if (!_id) return null;
      return <PreviewBlog _id={_id} />;
    default:
      return <Blogs keyword={keyword} />;
  }
};

export default Page;
