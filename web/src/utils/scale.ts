/**
 * Visual Timeline の時間軸の分母を決める。
 *
 * これまでは PB の完走タイムで正規化していたため、PB が未設定だと分母が 0 になり、
 * すべてのアイコンが左端に潰れていた。貼っただけで使えるように、PB が無いときは
 * ラン自身の長さから分母を作る。
 */

const SECOND_MS = 1000;

/** 10分から始めて3分ずつ伸ばす */
export const DEFAULT_MIN_SECONDS = 10 * 60;
export const DEFAULT_STEP_SECONDS = 3 * 60;

export type ScaleSetting = {
  /** PB が無いときに最初から見せる幅（秒） */
  minSeconds?: number;
  /** 分母を伸ばす単位（秒） */
  stepSeconds?: number;
};

/**
 * 秒の指定をミリ秒に直す。刻みに 0 や負値が入ると分母が壊れる（0除算で
 * Infinity や NaN になる）ので、下限を置いてから使う。
 */
const toMs = (seconds: number | undefined, fallbackSeconds: number, minimumSeconds: number) => {
  const value = typeof seconds === 'number' && Number.isFinite(seconds) ? seconds : fallbackSeconds;
  return Math.max(minimumSeconds, value) * SECOND_MS;
};

/**
 * @param pbFinalIGT PB の完走タイム。未設定なら 0
 * @param currentIGT 現在のペース（完走していれば完走タイム）
 */
export const resolveScale = (
  pbFinalIGT: number,
  currentIGT: number,
  isCompleted: boolean,
  setting: ScaleSetting = {},
): number => {
  // PB があるうちは PB の完走タイムが右端。
  // 超えたあとも PB のままだと、はみ出した分が画面の外へ出ていくので刻みに切り替える
  if (pbFinalIGT > 0 && currentIGT <= pbFinalIGT) {
    return pbFinalIGT;
  }

  // 完走したら、その完走タイムがちょうど右端になる
  if (isCompleted) {
    return Math.max(currentIGT, 1);
  }

  const stepMs = toMs(setting.stepSeconds, DEFAULT_STEP_SECONDS, 1);
  // PB を超えたぶんは PB の右端から刻む。10分基準のままだと、超えた瞬間に
  // PB と無関係な目盛りへ飛んでアイコンが一斉に動く
  const baseMs = Math.max(toMs(setting.minSeconds, DEFAULT_MIN_SECONDS, 0), pbFinalIGT);

  // 下限を超えたら、そこから刻みぶんずつ伸ばす（10分→13分→16分…）
  if (currentIGT <= baseMs) {
    return baseMs;
  }
  return baseMs + Math.ceil((currentIGT - baseMs) / stepMs) * stepMs;
};
