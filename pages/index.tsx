import UserTextArea from "@/components/UserTextArea";
import styles from "@/styles/App.module.css";
import { useState } from "react";
import { Query } from "@/types/Query";
import ChatMessages from "@/components/ChatMessages";

export default function App() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnswer = async (userQuery: string) => {
    const newQuery: Query = { userQuery, response: null };

    setQueries((prevQueries) => [...prevQueries, newQuery]);
    setIsLoading(true);

    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prevHistory: queries,
        prompt: userQuery,
      }),
    });

    const data = response.body;
    if (!data) {
      setQueries((prevQueries) => prevQueries.slice(0, -1));
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
    setIsLoading(false);
  };

  const _onClickClear = () => {
    setQueries([]);
    setIsLoading(false);
  };

  const isActive = queries.length > 0;

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1>Perplexity Challenge</h1>

        <ChatMessages
          queries={queries}
          isLoading={isLoading}
          fetchAnswer={(query) => fetchAnswer(query)}
        />

        <div className={isActive ? styles.footer : ""}>
          <UserTextArea
            fetchAnswer={(query) => fetchAnswer(query)}
            placeholder={isActive ? "Ask follow-up" : "Ask anything..."}
            isDisabled={isLoading}
          />

          {isActive ? (
            <button className={styles.clearButton} onClick={_onClickClear}>
              {"Clear chat"}
            </button>
          ) : null}
        </div>
        {isActive ? null : (
          <div className={styles.footer}>
            <p>
              Made by Abdul Al Tair.{" "}
              <a
                href="https://github.com/atair-lgtm/perplexity-challenge"
                target="_blank"
              >
                Link to repo
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
