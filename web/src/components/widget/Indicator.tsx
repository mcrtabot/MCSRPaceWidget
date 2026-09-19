import React, { useContext, useMemo } from 'react';

import { AppContext } from '../../context';
import { skinFaceUrl, usePlayer, useThemeCSS, useThemeOverrides, useTimelineInfo } from '../../hooks';
import {
  calcPosition,
  getContextItems,
  getFaceStatus,
  getTimelineDotItems,
  getTimelineLineItems,
} from '../../utils/indicator';
import { ThemeOverrides } from '../../utils/overrides';
import { resolveScale } from '../../utils/scale';
import { hasPBTime } from '../../utils/utils';
import { DiffTime, Time } from './Time';
import { TimelineIcon } from './TimelineIcon';

/*
 * タイムは区切り位置から右下へ伸びるので、右端に近いスプリットは画面の外へ出る。
 * 完走すると credits は必ず 100% に来るため、放っておくと最後のタイムが必ず切れる。
 * ここを超えたものに data-align="end" を付けて、逃がし方はテーマに委ねる。
 *
 * 下げすぎると手前のスプリットまで左へ動き、後のタイムが前のタイムより左に
 * 並んで順序が読めなくなる。実際に切れるのは終端付近だけなので高めに取る。
 */
const TEXT_ALIGN_END_RATIO = 0.95;

export const Indicator = () => {
  const { timeline: timelineData, pbTimeline, theme, setting } = useContext(AppContext);
  useThemeCSS(theme, 'indicator');

  /*
   * 走者のスキンは --mcsr-skin-face として渡すだけにする。
   * 使うかどうかはテーマCSSが var(--mcsr-skin-face, ...) を書くかで表明する。
   * 自前の顔を持つテーマは参照しなければよく、widget 側でテーマを名指しする必要がない。
   *
   * ?face=skin はその表明を無視してでもスキンにしたいときの逃げ道で、
   * --id-face-* を直接上書きする。?face=theme はスキンを渡さない。
   */
  const player = usePlayer();
  const skinUrl = player ? `url(${skinFaceUrl(player.id)})` : undefined;
  const offerSkin = setting.faceSkin !== false && !!skinUrl;
  const forceSkin = setting.faceSkin === true && !!skinUrl;

  /*
   * テーマは :root で var(--mcsr-skin-face, ...) を宣言するので、変数も :root に
   * 無いと解決されない。カスタムプロパティの置換は「使う場所」ではなく
   * 「宣言した場所」のスコープで起きるため、ウィジェットの要素に付けても届かない。
   */
  const skinVariable = useMemo<ThemeOverrides>(() => {
    const variables: ThemeOverrides = {};
    if (offerSkin && skinUrl) {
      // スキンは外部(mc-heads)から来るので、取れなかったときのために後ろへ既定の顔を重ねる。
      // 変数を立てた時点でテーマ側 var() のフォールバックは使われなくなるため
      variables['--mcsr-skin-face'] = `${skinUrl}, var(--mcsr-face-fallback, url(/setting/face.png))`;
    }
    return variables;
  }, [offerSkin, skinUrl]);
  useThemeOverrides(skinVariable);

  // ?face=skin はテーマの表明を無視する逃げ道なので、要素側から直接上書きする
  const faceStyle = forceSkin
    ? ({
        '--id-face-file': `${skinUrl}, var(--mcsr-face-fallback, url(/setting/face.png))`,
        '--id-face-smile-file': `${skinUrl}, var(--mcsr-face-fallback, url(/setting/face.png))`,
        '--id-face-sad-file': `${skinUrl}, var(--mcsr-face-fallback, url(/setting/face-sad.png))`,
      } as React.CSSProperties)
    : undefined;

  const igt = timelineData.igt;
  const { timeline, pbTimelinePattern, timelinePattern, displayItemTypes } = useTimelineInfo(
    timelineData.timelines,
    pbTimeline ?? [],
    setting.label,
  );

  const timelineMap = useMemo(() => new Map(timeline.map((item) => [item.type, item])), [timeline]);
  const pbTimelineMap = useMemo(() => new Map(pbTimeline.map((item) => [item.type, item])), [pbTimeline]);

  const pbFinalIGT = useMemo(() => pbTimeline.find((item) => item.type === 'credits')?.igt ?? 0, [pbTimeline]);
  // PB の終端。credits が空でも、入っているスプリットまでは比較できる
  const pbLastIGT = useMemo(() => Math.max(0, ...pbTimeline.map((item) => item.igt)), [pbTimeline]);
  const paceIGT = useMemo(() => {
    const finalIGT = timeline.find((item) => item.type === 'credits')?.igt;
    if (finalIGT) {
      return finalIGT;
    }

    return igt || 0;
  }, [igt, timeline]);

  const isCompleted = timelineMap.has('credits');

  // 位置計算の分母。PB が無ければラン自身の長さから作るので、未設定でも潰れない
  const denominator = resolveScale(pbFinalIGT, paceIGT, isCompleted, {
    minSeconds: setting.scaleMinSeconds,
    stepSeconds: setting.scaleStepSeconds,
  });
  // 判定は Timeline / Segment と同じ hasPBTime に揃える。ここだけ credits で見ると、
  // 途中まで入れた pb.json でウィジェットごとに差分の出る・出ないが食い違う
  const hasPB = hasPBTime(pbTimeline);

  // fit のときは分母がランの長さなので、PB の後半は分母を超える。
  // そのまま描くと画面の外へ出ていくだけなので、収まる範囲だけ描く
  const visiblePbTimeline = useMemo(
    () => pbTimeline.filter((item) => item.igt <= denominator),
    [pbTimeline, denominator],
  );
  const pbExtent = Math.min(pbLastIGT, denominator);

  const latestItem = timeline[timeline.length - 1];
  // PB が無ければ「速い/遅い」の判定もできない
  const faceStatus = hasPB
    ? getFaceStatus(paceIGT, pbFinalIGT, latestItem, pbTimeline, pbTimelinePattern, timelinePattern)
    : 'normal';
  const currentSegment = timeline.length > 0 ? timeline[timeline.length - 1].type : '';
  const indicatorStatus = timeline.length === 0 ? 'empty' : isCompleted ? 'completed' : 'running';

  const classNames: string[] = [
    'mcsr-indicator',
    `mcsr-indicator--${isCompleted ? 'completed' : 'running'}`,
  ];
  if (timeline.length === 0) {
    classNames.push('mcsr-indicator--empty');
  }

  const pbLineItems = hasPB ? getTimelineLineItems(visiblePbTimeline, pbExtent, denominator) : [];
  const lineItems = getTimelineLineItems(timeline, paceIGT || 0, denominator);

  // 出す・出さないはテーマCSSの --id-display-context が決める
  const contextItems = useMemo(
    () => getContextItems(timelineData.context ?? [], denominator),
    [timelineData.context, denominator],
  );

  return (
    <div
      className={classNames.join(' ')}
      data-segment={currentSegment}
      data-run-status={indicatorStatus}
      data-has-pb={hasPB}
      data-face={offerSkin ? 'skin' : undefined}
      style={faceStyle}
    >
      <div className="mcsr-indicator__line-container">
        {pbLineItems.map((lineItem) => (
          <div
            key={lineItem.type}
            className={`mcsr-indicator__line mcsr-indicator__line--pb mcsr-indicator__line--${lineItem.type}`}
            style={{ left: lineItem.left, width: lineItem.width }}
          />
        ))}
        {lineItems.map((lineItem) => (
          <div
            key={lineItem.type}
            className={`mcsr-indicator__line mcsr-indicator__line--pace mcsr-indicator__line--${lineItem.type}`}
            style={{ left: lineItem.left, width: lineItem.width }}
          />
        ))}
      </div>
      <div className="mcsr-indicator__dot-container">
        {/* PB が無いと目盛りが現在地までで切れるので、枠と同じく右端まで引く */}
        {(hasPB ? [] : getTimelineDotItems(timeline, denominator, denominator)).map((dotItem, index) => (
          <div
            key={`track_${dotItem.type}_${index}`}
            className={`mcsr-indicator__dot mcsr-indicator__dot--track mcsr-indicator__dot--${dotItem.type}`}
            style={{ left: dotItem.left }}
          />
        ))}
        {(hasPB ? getTimelineDotItems(visiblePbTimeline, pbExtent, denominator) : []).map((dotItem, index) => (
          <div
            key={`${dotItem.type}_${index}`}
            className={`mcsr-indicator__dot mcsr-indicator__dot--pb mcsr-indicator__dot--${dotItem.type}`}
            style={{ left: dotItem.left }}
          />
        ))}
        {getTimelineDotItems(timeline, paceIGT || 0, denominator).map((dotItem, index) => (
          <div
            key={`${dotItem.type}_${index}`}
            className={`mcsr-indicator__dot mcsr-indicator__dot--pace mcsr-indicator__dot--${dotItem.type}`}
            style={{ left: dotItem.left }}
          />
        ))}
      </div>
      <div className="mcsr-indicator__context-container">
        {contextItems.map(({ left, item }) => (
          <div
            key={`${item.type}_${item.igt}`}
            className="mcsr-indicator__context"
            style={{ left }}
            data-context={item.type}
            data-label={setting.contextLabel?.[item.type] ?? item.type}
          >
            <TimelineIcon className="mcsr-indicator__context-icon" type={item.type} />
          </div>
        ))}
      </div>
      <div className="mcsr-indicator__timeline-container mcsr-indicator__timeline-container--pb">
        {displayItemTypes.map((itemType) => {
          const item = pbTimelineMap.get(itemType);
          if (!item || !hasPB || item.igt > denominator) {
            return <React.Fragment key={itemType} />;
          }
          const status = timelineMap.has(itemType) ? 'done' : 'todo';
          return (
            <div
              key={itemType}
              className={['mcsr-indicator__item', `mcsr-indicator__item--${status}`].join(' ')}
              style={{ left: calcPosition(item.igt, denominator) }}
              data-segment={itemType}
              data-status={status}
            >
              <div className="mcsr-indicator__icon-container">
                <TimelineIcon className="mcsr-indicator__icon" type={itemType} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mcsr-indicator__timeline-container mcsr-indicator__timeline-container--pace">
        {displayItemTypes.map((itemType) => {
          const item = timelineMap.get(itemType);
          if (!item) {
            return <React.Fragment key={itemType} />;
          }

          const diffEnabled =
            (itemType === 'enter_bastion' || itemType === 'enter_fortress') && pbTimelinePattern !== timelinePattern
              ? false
              : true;
          const highlighted = diffEnabled && item.igt < (pbTimelineMap.get(itemType)?.igt ?? 0);
          const alignEnd = denominator > 0 && item.igt / denominator > TEXT_ALIGN_END_RATIO;
          return (
            <div
              key={itemType}
              className={[
                'mcsr-indicator__item',
                `mcsr-indicator__item--${highlighted ? 'highlighted' : 'normal'}`,
              ].join(' ')}
              style={{ left: calcPosition(item.igt, denominator) }}
              data-segment={itemType}
              data-highlighted={highlighted}
              data-align={alignEnd ? 'end' : 'start'}
            >
              <div className="mcsr-indicator__icon-container">
                <TimelineIcon className="mcsr-indicator__icon" type={itemType} />
              </div>
              <div className="mcsr-indicator__text">
                <div className="mcsr-indicator__text-inner">
                  <div className="mcsr-indicator__text__label">{setting.label[item.type]}</div>
                  <div className="mcsr-indicator__text__time">
                    <Time value={item.igt} />
                  </div>
                  {diffEnabled && (
                    <div className="mcsr-indicator__text__diff">
                      (
                      <DiffTime time={item.igt} pbTime={pbTimelineMap.get(itemType)?.igt} />)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mcsr-indicator__face-container">
        <div
          className={['mcsr-indicator__face', `mcsr-indicator__face--${faceStatus}`, 'mcsr-indicator__icon'].join(' ')}
          style={{ left: calcPosition(paceIGT, denominator) }}
        />
      </div>
    </div>
  );
};
