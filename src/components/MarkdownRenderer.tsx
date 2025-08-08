import Markdown from "react-markdown";

import { cn } from "../lib/utils";

export default function MarkdownRender({ content }: { content: string }) {
  return (
    <div
      className={cn(
        "prose prose-neutral prose-invert",
        "prose-a:text-green-400 prose-a:hover:text-green-500"
      )}
    >
      <Markdown
        components={{
          a: ({
            node, // eslint-disable-line
            ...props
          }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
