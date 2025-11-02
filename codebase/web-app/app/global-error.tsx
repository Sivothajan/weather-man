'use client';

import './globals.css';
import styles from './Error.module.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className={styles.container}>
          <h1 className={styles.errorCode}>500 – Something went wrong</h1>
          <p className={styles.errorMessage}>{error.message}</p>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
}
