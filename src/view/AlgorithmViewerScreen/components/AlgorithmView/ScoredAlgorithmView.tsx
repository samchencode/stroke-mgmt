import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { Outcome, ScoredAlgorithm } from '@/domain/models/Algorithm';
import { SwitchId } from '@/domain/models/Algorithm';
import { WebViewEventHandler } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/WebViewEventHandler';
import type { Event } from '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer';
import { WebViewError } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/WebViewError';

type ScoredAlgorithmViewProps = {
  html: string;
  width: number;
  algorithm: ScoredAlgorithm;
  onChangeAlgorithm: (algo: ScoredAlgorithm) => void;
  onSelectOutcome: (outcome: Outcome) => void;
};

function ScoredAlgorithmView({
  html,
  width,
  algorithm,
  onChangeAlgorithm,
  onSelectOutcome,
}: ScoredAlgorithmViewProps) {
  const [height, setHeight] = useState(1);

  const eventHandler = useMemo(
    () =>
      new WebViewEventHandler({
        layout: ({ height: h }) => setHeight(h),
        error: ({ name, message }) => {
          throw new WebViewError(name, message);
        },
        switchchanged: ({ id, active }) => {
          const newAlgo = algorithm.setSwitchById(new SwitchId(id), active);
          onChangeAlgorithm(newAlgo);
        },
      }),
    [algorithm, onChangeAlgorithm]
  );

  const handleMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const event = JSON.parse(nativeEvent.data) as Event;
      eventHandler.handle(event);
    },
    [eventHandler]
  );

  return (
    <View style={{ height }}>
      <WebView
        source={{ html }}
        originWhitelist={['*']}
        style={{ width }}
        onMessage={handleMessage}
        scrollEnabled={false}
      />
    </View>
  );
}

export { ScoredAlgorithmView };
