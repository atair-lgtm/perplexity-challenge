import styles from "@/styles/EntityLink.module.css";

const EntityLink = ({
  onClick,
  content,
}: {
  onClick: () => void;
  content: string;
}) => {
  return (
    <span
      className={styles.EntityLink}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {content}
    </span>
  );
};

export default EntityLink;
