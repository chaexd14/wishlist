import { Tag, type TagProps } from "@plop-ui/react";

export function JournalTag({ className = "", ...props }: TagProps) {
  return <Tag className={`journal-tag ${className}`.trim()} {...props} />;
}
