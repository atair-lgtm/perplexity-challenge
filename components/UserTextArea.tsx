import { KeyboardEvent, useState } from "react";
import styles from "@/styles/App.module.css";

const UserTextArea = ({
  fetchAnswer,
}: {
  fetchAnswer: (query: string) => void;
}) => {
  const _submitQuery = () => {
    fetchAnswer(userQuery);
    setUserQuery("");
  };
  const _handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      _submitQuery();
    }
  };

  const [userQuery, setUserQuery] = useState("");
  return (
    <div className={styles.textAreaDiv}>
      <textarea
        className={styles.textarea}
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        placeholder="Ask anything..."
        onKeyDown={_handleKeyDown}
      ></textarea>
      <div className={styles.submitButton}>
        <button disabled={!userQuery} onClick={_submitQuery}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default UserTextArea;
