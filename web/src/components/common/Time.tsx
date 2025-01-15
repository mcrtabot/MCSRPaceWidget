import React from 'react';

type TimeProps = {
  value: number;
  displaySign?: boolean;
  displayMilliSeconds?: boolean;
};

export const Time = ({ value, displaySign, displayMilliSeconds = false }: TimeProps) => {
  const sign = value >= 0 ? 1 : -1;
  let t: ReturnType<typeof parseTime>;
  if (displayMilliSeconds) {
    t = parseTime(Math.abs(value) / 1000);
  } else {
    t = parseTime(Math.abs(Math.floor(value / 1000)));
  }
  let hms: string;
  if (t.h > 0) {
    hms = `${t.h.toString()}:${t.m.toString().padStart(2, '0')}:${t.s.toString().padStart(2, '0')}`;
  } else {
    hms = `${(t.h * 60 + t.m).toString().padStart(2, '0')}:${t.s.toString().padStart(2, '0')}`;
  }
  if (displayMilliSeconds) {
    const milliseconds = `000${t.ms}`.slice(-3);
    hms = hms + `.${milliseconds}`;
  }
  return (
    <>
      {displaySign && (sign === 1 ? '+' : '-')}
      {hms}
    </>
  );
};

const parseTime = (value: number) => {
  return {
    h: Math.floor(value / 3600),
    m: Math.floor(value / 60) % 60,
    s: Math.floor(value) % 60,
    ms: Math.round((value * 1000) % 1000),
  };
};

type DiffTimeProps = {
  time?: number;
  pbTime?: number;
  displayDiff?: boolean;
};

export const DiffTime = ({ time, pbTime, displayDiff = true }: DiffTimeProps) => {
  return (
    <>
      {time && pbTime && displayDiff ? (
        <Time value={time - pbTime} displaySign={true} />
      ) : (
        <>
          <span style={{ opacity: 0 }}>+</span>
          --:--
        </>
      )}
    </>
  );
};
