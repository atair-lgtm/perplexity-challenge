import { KeyboardEvent, useState } from "react";
import styles from "@/styles/UserTextArea.module.css";

const UserTextArea = ({
  fetchAnswer,
  isDisabled,
  placeholder,
}: {
  fetchAnswer: (query: string) => void;
  isDisabled: boolean;
  placeholder: string;
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
    <div className={styles.userTextArea}>
      <textarea
        className={styles.textarea}
        value={userQuery}
        disabled={isDisabled}
        onChange={(e) => setUserQuery(e.target.value)}
        placeholder={placeholder}
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
