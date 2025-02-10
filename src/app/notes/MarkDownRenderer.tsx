import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface MarkdownRendererProps {
  content: string;
}

function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      // REMARK PLUGINS
      remarkPlugins={[
        remarkGfm,
        // (notice: no remark-unwrap-images here)
      ]}

      // REHYPE PLUGINS
      rehypePlugins={[
        rehypeRaw,         // allows raw HTML in Markdown
        rehypeSlug,        // adds IDs to headings
        rehypeAutolinkHeadings, // auto-links headings with IDs
      ]}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;
