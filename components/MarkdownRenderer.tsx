import ReactMarkdown from "react-markdown";
import React from "react";
import EntityLink from "./EntityLink";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styles from "@/styles/MarkdownRenderer.module.css";

// REGEX for capturing multiple adjacent capitalized words first then attempts to capture single capitalized word
const capitalizedWordRegex =
  /(\b[A-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*(?:\s+[A-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*)+\b)|(\b[A-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*\b)/g;

export default function MarkdownRenderer({
  content,
  onEntityLinkClick,
}: {
  content: string;
  onEntityLinkClick: (text: string) => void;
}) {
  const components = {
    p: ({ children }: { children: React.ReactNode[] }) => {
      const processedChildren = children.map((child) => {
        if (typeof child === "object") {
          return child;
        }
        const text = child;
        const renderedWords =
          text && _renderTextWithEntityLinks(text as string);
        return renderedWords;
      });
      return <p>{processedChildren}</p>;
    },
    li: ({ children }: { children: React.ReactNode[] }) => {
      if (children === undefined) {
        return;
      }
      const childrenToProcess = children.filter((el) => el !== "\n");
      const processedChildren = childrenToProcess.map((child) => {
        if (typeof child === "object") {
          return child;
        }
        return _renderTextWithEntityLinks(child as string);
      });
      return <li>{processedChildren}</li>;
    },
    code: ({
      inline,
      className,
      children,
      ...props
    }: {
      inline: boolean;
      className: string;
      children: React.ReactNode[];
    }) => {
      const match = /language-(\w+)/.exec(className || "language-markdown");

      return !inline && match ? (
        <SyntaxHighlighter {...props} language={match[1]} PreTag="div">
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code {...props} className={className}>
          {children}
        </code>
      );
    },
  };

  const _renderTextWithEntityLinks = (text: string) => {
    const splitText = text.split(capitalizedWordRegex);

    const textWithEntityLinks = splitText.map((word, index) => {
      if (word && word.match(capitalizedWordRegex)) {
        return (
          <EntityLink
            key={index}
            onClick={() => onEntityLinkClick(word)}
            content={word}
          />
        );
      }
      return word;
    });

    return textWithEntityLinks;
  };

  return (
    //@ts-ignore
    <ReactMarkdown components={components} className={styles.MarkdownRenderer}>
      {content}
    </ReactMarkdown>
  );
}
