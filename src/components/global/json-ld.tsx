type Props = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

const JsonLd = ({ data }: Props) => (
  <script
    type='application/ld+json'
    // Sanity-authored strings only; no user input reaches this payload.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default JsonLd;
