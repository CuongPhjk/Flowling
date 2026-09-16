import type { ReactNode } from "react";
/** Small, safe editorial subset: headings, bold and emphasis. No HTML injection. */
export function InlineMarkdown({
  text,
  render,
}: {
  text: string;
  render?: (text: string) => ReactNode;
}) {
  return (
    <>
      {text
        .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
        .map((part, index) =>
          part.startsWith("**") ? (
            <strong key={index}>
              {render ? render(part.slice(2, -2)) : part.slice(2, -2)}
            </strong>
          ) : part.startsWith("*") ? (
            <em key={index}>
              {render ? render(part.slice(1, -1)) : part.slice(1, -1)}
            </em>
          ) : (
            <span key={index}>{render ? render(part) : part}</span>
          ),
        )}
    </>
  );
}
export function MarkdownBlock({
  text,
  children,
  className = "",
}: {
  text: string;
  children: ReactNode;
  className?: string;
}) {
  return /^#{1,3}\s/.test(text) ? (
    <h2 className={className}>{children}</h2>
  ) : (
    <p className={className}>{children}</p>
  );
}
