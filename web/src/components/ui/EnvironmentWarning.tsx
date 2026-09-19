import React from 'react';

import { Alert, Code, Text } from '@mantine/core';

import { useEnvironment } from '../../hooks';

/**
 * 「起動したのに動かない」の原因になる前提だけを出す。
 * 問題が無いときは何も出さない。
 */
export const EnvironmentWarning = () => {
  const environment = useEnvironment();

  if (!environment || environment.autoSaveIntervalOk) {
    return null;
  }

  // ワールドが見つからない = SpeedRunIGT でまだ一度も遊んでいない
  if (!environment.worldPath) {
    return (
      <Alert color="yellow" title="No world found yet" mb="md">
        <Text size="sm">
          Play a world once with SpeedRunIGT installed. The widget reads the run from there, so it has nothing to show
          until then.
        </Text>
      </Alert>
    );
  }

  if (!environment.autoSaveInterval) {
    return (
      <Alert color="yellow" title="Could not read the SpeedRunIGT settings" mb="md">
        <Text size="sm">
          Looked for <Code>{environment.optionsPath}</Code>. The widget still works, but it cannot check that{' '}
          <Code>Auto Save Interval</Code> is set to <Code>Ticks</Code>.
        </Text>
      </Alert>
    );
  }

  return (
    <Alert color="red" title="Splits will not update in real time" mb="md">
      <Text size="sm">
        SpeedRunIGT&apos;s <Code>Auto Save Interval</Code> is <Code>{environment.autoSaveInterval}</Code>. The run data
        is only written when the game pauses, so the widget will look frozen while you play.
      </Text>
      <Text size="sm" mt="xs">
        Set it to <Code>Ticks</Code> in SpeedRunIGT Options &gt; Timer, then restart the game.
      </Text>
    </Alert>
  );
};
