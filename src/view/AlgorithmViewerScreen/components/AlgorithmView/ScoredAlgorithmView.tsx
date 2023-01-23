import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { ScoredAlgorithm } from '@/domain/models/Algorithm';
import { AlgorithmId, SwitchId } from '@/domain/models/Algorithm';
import { WebViewEventHandler } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/WebViewEventHandler';
import type { Event } from '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer';
import { WebViewError } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/WebViewError';

type ScoredAlgorithmViewProps = {
  html: string;
  width: number;
  algorithm: ScoredAlgorithm;
  onChangeAlgorithm: (algo: ScoredAlgorithm) => void;
  onNextAlgorithm: (id: AlgorithmId) => void;
};

function ScoredAlgorithmView({
  html,
  width,
  algorithm,
  onChangeAlgorithm,
  onNextAlgorithm,
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
        nextpressed: ({ id }) => onNextAlgorithm(new AlgorithmId(id)),
      }),
    [algorithm, onChangeAlgorithm, onNextAlgorithm]
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