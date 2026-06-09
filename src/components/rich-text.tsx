import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { Prose } from '@/components/ds'

type RichTextProps = {
  /** Serialized Lexical content from a Payload `richText` field. */
  data: SerializedEditorState
  className?: string
  /** Constrain width and render as an <article>. Use for long-form content. */
  isArticle?: boolean
  /** Add vertical rhythm between blocks. Defaults to true. */
  isSpaced?: boolean
}

/**
 * Renders Payload Lexical rich text inside the design system's `Prose`
 * typography. This is the bridge between CMS content and the design system —
 * use it anywhere you output a `richText` field.
 */
export const RichText = ({ data, className, isArticle = false, isSpaced = true }: RichTextProps) => (
  <Prose className={className} isArticle={isArticle} isSpaced={isSpaced}>
    <LexicalRichText data={data} />
  </Prose>
)
