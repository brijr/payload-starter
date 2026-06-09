import type { JsonLdObject } from '@/lib/seo'

type StructuredDataProps = {
  data: JsonLdObject | JsonLdObject[]
}

const serializeJsonLd = (data: JsonLdObject | JsonLdObject[]) =>
  JSON.stringify(data).replace(/</g, '\\u003c')

export const StructuredData = ({ data }: StructuredDataProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: serializeJsonLd(data),
    }}
  />
)
