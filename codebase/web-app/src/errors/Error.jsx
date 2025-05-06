import PropTypes from "prop-types";
import styles from "./Error.module.css";

function Error({ errorCode, errorMessage }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>{errorCode}</h1>
      <p className={styles.errorMessage}>{errorMessage}</p>
    </div>
  );
}

Error.propTypes = {
  errorCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default Error;
