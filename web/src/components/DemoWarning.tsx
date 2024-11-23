import React, { useEffect, useState } from 'react';

export const DemoWarning = () => {
  const [display, setDisplay] = useState('block');

  // アラートを5秒間表示した後、25秒間非表示、を繰り返す
  useEffect(() => {
    const toggleDisplay = () => {
      setDisplay((prevDisplay) => (prevDisplay === 'block' ? 'none' : 'block'));
    };

    // Set initial display to block, then repeat the cycle
    if (display === 'block') {
      const timer = setTimeout(toggleDisplay, 5000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(toggleDisplay, 25000);
      return () => clearTimeout(timer);
    }
  }, [display]);

  return (
    <div
      className="alert alert-warning"
      style={{
        display,
        position: 'fixed',
        border: '2px solid red',
        background: 'white',
        color: 'red',
        padding: '8px',
        zIndex: 1000,
        top: '16px',
        left: '16px',
        width: '320px',
      }}
    >
      This is DEMO MODE
      <hr />
      <br />
      <p style={{ fontSize: '0.8em', lineHeight: 1.5 }}>
        "&demo=1" is a parameter for display in demo data. After checking and adjusting the display with demo data,
        delete "&demo=1" from the URL to be set.
      </p>
      <br />
    </div>
  );
};
