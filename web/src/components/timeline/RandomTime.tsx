import { useEffect, useState } from 'react';

type RandomTimeProps = {
  interval?: number;
};

const randomInt = (max: number) => Math.floor(Math.random() * max);

export const RandomTime = ({ interval = 30 }: RandomTimeProps) => {
  const [time, setTime] = useState('00:00');
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(`${('00' + randomInt(60).toString()).slice(-2)}:${('00' + randomInt(60).toString()).slice(-2)}`);
    }, interval);

    return () => {
      clearInterval(timerId);
    };
  }, [interval]);

  return <>{time}</>;
};
