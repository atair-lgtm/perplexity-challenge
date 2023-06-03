import { KeyboardEvent, useState } from "react";
import styles from "@/styles/App.module.css";

const UserTextArea = ({
  fetchAnswer,
  isDisabled,
}: {
  fetchAnswer: (query: string) => void;
  isDisabled: boolean;
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
        disabled={isDisabled}
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
