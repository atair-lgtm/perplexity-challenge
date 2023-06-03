import { Query } from "@/types/Query";
import styles from "@/styles/App.module.css";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useRef, useEffect } from "react";

export default function ChatMessages({
  queries,
  fetchAnswer,
}: {
  queries: Query[];
  fetchAnswer: (query: string) => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [queries.length]);

  return (
    <div className={styles.chatArea}>
      {queries.map((query, index) => (
        <div key={index} className={styles.queryAndResponse}>
          <div className={styles.userQuery} ref={bottomRef}>
            <h3>{query.userQuery}</h3>
          </div>

          {query.response && (
            <div className={styles.response}>
              <MarkdownRenderer
                content={query.response}
                onEntityLinkClick={(content) => fetchAnswer(content)}
              />
            </div>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
}
