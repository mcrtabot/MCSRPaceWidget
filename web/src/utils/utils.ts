export const convertTimeToMilliSeconds = (time?: string) => {
  if (!time) {
    return undefined;
  }
  const match = time.match(/(?:(\d+):)?(\d{1,2}):(\d{1,2})(?:\.(\d+))?/);
  if (!match) {
    return undefined;
  }
  const h = match.at(1);
  const m = match.at(2);
  const s = match.at(3);
  const ms = match.at(4);
  return (
    (h ? parseInt(h, 10) * 60 * 60 * 1000 : 0) +
    (m ? parseInt(m, 10) * 60 * 1000 : 0) +
    (s ? parseInt(s, 10) * 1000 : 0) +
    (ms ? parseInt((ms + '000').substring(0, 3), 10) : 0)
  );
};

/**
 * ミリ秒を時間フォーマットへ変換する関数
 * @param milliseconds - ミリ秒
 * @returns フォーマットされた時間文字列
 */
export const convertMillisecondsToTime = (milliseconds?: number, displayMilliSeconds = true): string | undefined => {
  if (milliseconds === undefined || milliseconds < 0) {
    return undefined;
  }

  let ms = milliseconds % 1000;
  let seconds = Math.floor(milliseconds / 1000);
  const s = seconds % 60;
  seconds = Math.floor(seconds / 60);
  const m = seconds % 60;
  const h = Math.floor(seconds / 60);

  // ミリ秒が0の場合には出力しない
  const msPart = displayMilliSeconds && ms > 0 ? `.${String(ms).padStart(3, '0')}` : '';

  // 時間が存在しない場合でも 'MM:SS' の形式で返す
  const timeFormat =
    h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;

  return timeFormat + msPart;
};

export const createKey = () => new Date().getTime().toString(36);
