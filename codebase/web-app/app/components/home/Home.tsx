import { useEffect, useState } from 'react';
import screenfull from 'screenfull';
import styles from '@/app/components/home/Home.module.css';
import Widget from '@/app/components/widget/Widget';

const Home = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!screenfull.isEnabled) return;

    const onChange = () => setIsFullscreen(screenfull.isFullscreen);
    screenfull.on('change', onChange);

    return () => screenfull.off('change', onChange);
  }, []);

  return (
    <div className={styles.container}>
      <Widget isFullscreen={isFullscreen} />
    </div>
  );
};

export default Home;
