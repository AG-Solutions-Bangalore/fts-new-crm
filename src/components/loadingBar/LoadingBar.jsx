

import { useEffect, useState } from 'react';
import './TopLoadingBar.css'; 
import Layout from '../../layout/Layout';

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
 <Layout>
       <div className="top-loading-bar" style={{ width: `${progress}%` }}></div>
 </Layout>
  );
};

export default LoadingBar;