import ReactMarkdown from "react-markdown";
import React from "react";
import EntityLink from "./EntityLink";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import * as styles from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "@/styles/App.module.css";

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
    p: ({ children }) => {
      const processedChildren = children.map((child) => {
        if (typeof child === "object") {
          return child;
        }

        const text = child;

        const renderedWords = text && _renderTextWithEntityLinksRegex(text);

        return renderedWords;
      });

      return processedChildren;
    },
    li: ({ children }) => {
      const childrenToProcess =
        children && children.filter((el) => el !== "\n");
      const result =
        childrenToProcess &&
        childrenToProcess.map((child) => {
          if (typeof child === "object") {
            return child;
          }
          return _renderTextWithEntityLinksRegex(child);
        });

      return <li>{result}</li>;
    },
    code: ({ node, inline, className, children, ...props }) => {
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

  const _renderTextWithEntityLinksRegex = (textOrObject: string | Object) => {
    let textToProcess = textOrObject;
    if (typeof textOrObject === "object") {
      textToProcess = textOrObject.props.children[0];
    }

    const splitText = (textToProcess as string).split(capitalizedWordRegex);

    const updatedText = splitText.map((word, index) => {
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

    return updatedText;
  };

  return (
    <ReactMarkdown components={components} className={styles.lineBreak}>
      {content}
    </ReactMarkdown>
  );
}
