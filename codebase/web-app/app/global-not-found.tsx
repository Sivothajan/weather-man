import './globals.css';
import styles from './Error.module.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function GlobalNotFound() {
  return (
    <html>
      <body>
        <div className={styles.container}>
          <h1 className={styles.errorCode}>404 - Page Not Found</h1>
          <p className={styles.errorMessage}>This page does not exist.</p>
          <Link href="/" className={styles.homeButton}>
            Return Home
          </Link>
        </div>
      </body>
    </html>
  );
}
