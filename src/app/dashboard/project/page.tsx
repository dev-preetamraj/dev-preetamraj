import EditProject from './_components/actions/edit-project';
import PreviewProject from './_components/actions/preview-project';
import Projects from './_components/actions/projects';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page = ({ searchParams }: Props) => {
  if (!searchParams) return <Projects />;

  const action = searchParams['action'];
  const _id = searchParams['_id'] as string;
  const keyword = searchParams['keyword'] as string;

  switch (action) {
    case 'edit':
      if (!_id) return null;
      return <EditProject _id={_id} />;
    case 'preview':
      if (!_id) return null;
      return <PreviewProject _id={_id} />;
    default:
      return <Projects keyword={keyword} />;
  }
};

export default Page;
