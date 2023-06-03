import MarkdownRenderer from "@/components/MarkdownRenderer";
import UserTextArea from "@/components/UserTextArea";
import styles from "@/styles/App.module.css";
import { useRef, useEffect, useState } from "react";

type Query = {
  userQuery: string;
  response: string | null;
};

export default function App() {
  const [queries, setQueries] = useState<Query[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [queries]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const fetchAnswer = async (userQuery: string) => {
    const newQuery: Query = { userQuery, response: null };
    setQueries((prevQueries) => [...prevQueries, newQuery]);

    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: userQuery,
      }),
    });

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      newQuery.response = (newQuery.response ?? "") + chunkValue;
      setQueries((prevQueries) => [...prevQueries]);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1>Perplexity</h1>

        <UserTextArea fetchAnswer={(query) => fetchAnswer(query)} />
        {queries.length > 0 ? (
          <button className={styles.clearButton} onClick={() => setQueries([])}>
            {"Clear chat"}
          </button>
        ) : null}

        <div className={styles.chatArea} ref={chatContainerRef}>
          {queries.map((query, index) => (
            <div key={index} className={styles.queryAndResponse}>
              <div className={styles.userQuery}>
                <h1>{query.userQuery}</h1>
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
      </div>
    </main>
  );
}
