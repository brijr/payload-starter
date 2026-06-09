import type { FieldHook } from 'payload'

/**
 * Turn an arbitrary string into a URL-safe slug.
 *
 * @example formatSlug('Hello, World!') // 'hello-world'
 */
export const formatSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // drop punctuation/symbols
    .replace(/[\s_-]+/g, '-') // collapse whitespace/underscores to a single dash
    .replace(/^-+|-+$/g, '') // trim leading/trailing dashes

/**
 * A `beforeValidate` field hook that keeps a `slug` field in sync with a source
 * field (e.g. `title`). If an editor types a custom slug it is normalized and
 * kept; otherwise the slug is derived from the fallback field.
 */
export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    // 1. An explicitly-entered slug wins — but only if it normalizes to a
    //    non-empty value (e.g. a punctuation-only entry would format to '').
    if (typeof value === 'string') {
      const formatted = formatSlug(value)
      if (formatted) return formatted
    }

    // 2. Otherwise derive the slug from the fallback field (e.g. the title).
    if (operation === 'create' || !value) {
      const fallbackValue = data?.[fallback]
      if (typeof fallbackValue === 'string') {
        const formatted = formatSlug(fallbackValue)
        if (formatted) return formatted
      }
    }

    // 3. Nothing usable — keep the existing value (avoids overwriting a saved
    //    slug on a partial update).
    return value
  }
