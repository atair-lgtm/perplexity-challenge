import { Query } from "@/types/Query";
import styles from "@/styles/ChatMessages.module.css";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useRef, useEffect } from "react";

export default function ChatMessages({
  queries,
  fetchAnswer,
  isLoading,
}: {
  queries: Query[];
  fetchAnswer: (query: string) => void;
  isLoading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [queries]);

  const _onEntityLinkClick = (content: string) => {
    if (isLoading) {
      return;
    }
    fetchAnswer(content);
  };

  return (
    <div className={styles.chatMessages}>
      {queries.map((query, index) => (
        <div key={index} className={styles.queryAndResponse}>
          <div className={styles.userQuery} ref={bottomRef}>
            <h3>{query.userQuery}</h3>
          </div>

          {query.response && (
            <div className={styles.response}>
              <MarkdownRenderer
                content={query.response}
                onEntityLinkClick={_onEntityLinkClick}
              />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      ))}
    </div>
  );
}
