import { Heading, type HeadingProps } from "@plop-ui/react";

type JournalHeadingProps = HeadingProps & {
  size?: "page" | "section" | "card";
};

export function JournalHeading({ size = "section", className = "", ...props }: JournalHeadingProps) {
  return (
    <Heading
      className={`journal-heading journal-heading--${size} ${className}`.trim()}
      {...props}
    />
  );
}
