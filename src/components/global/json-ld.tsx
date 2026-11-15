type Props = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

const JsonLd = ({ data }: Props) => (
  <script
    type='application/ld+json'
    // CMS strings must not be able to terminate the script element.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
);

export default JsonLd;
