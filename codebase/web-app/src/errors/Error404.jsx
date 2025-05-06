import styles from "./Error.module.css";

function Error404() {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.errorMessage}>Not Found!</p>
    </div>
  );
}

export default Error404;
