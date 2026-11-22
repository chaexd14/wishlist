import type { HTMLAttributes, ReactNode } from "react";

type JournalHeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, "children"> & {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "page" | "section" | "card";
  scribble?: boolean;
  /** Kept for API compatibility. Journal headings are deliberately stable. */
  writeOn?: boolean;
};

export function JournalHeading({
  children,
  level = 2,
  size = "section",
  scribble = level <= 2,
  writeOn,
  className = "",
  ...props
}: JournalHeadingProps) {
  void writeOn;
  const HeadingTag = `h${level}` as const;

  return (
    <HeadingTag
      className={`journal-heading journal-heading--${size}${scribble ? " journal-heading--scribble" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </HeadingTag>
  );
}
