import markdownit from 'markdown-it';

type Props = {
  content: string;
};

const RenderMarkdown = ({ content }: Props) => {
  const md = markdownit();
  return (
    <article
      className='prose !max-w-none dark:prose-invert prose-a:text-primary prose-headings:text-foreground prose-img:w-full prose-img:aspect-video prose-img:object-cover prose-img:object-left'
      dangerouslySetInnerHTML={{
        __html: md.render(content),
      }}
    />
  );
};

export default RenderMarkdown;
