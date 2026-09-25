/**
 * JSON-LD block renderer (SEO-05 / GEO-L3).
 *
 * A native `<script type="application/ld+json">` is the documented approach —
 * `next/script` is for executable JavaScript, structured data is not code
 * (`node_modules/next/dist/docs/01-app/02-guides/json-ld.md`). The payload is
 * escaped so a string containing `<` can never break out of the tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
