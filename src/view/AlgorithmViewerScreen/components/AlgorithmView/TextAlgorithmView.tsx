import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { Algorithm } from '@/domain/models/Algorithm';
import { AlgorithmId } from '@/domain/models/Algorithm';
import { WebViewEventHandler } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/WebViewEventHandler';
import { WebViewError } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/WebViewError';
import type { Event } from '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer';

type TextAlgorithmViewProps = {
  html: string;
  width: number;
  algorithm: Algorithm;
  onNextAlgorithm: (id: AlgorithmId, thisAlgorithm: Algorithm) => void;
};

function TextAlgorithmView({
  html,
  width,
  algorithm,
  onNextAlgorithm,
}: TextAlgorithmViewProps) {
  const [height, setHeight] = useState(1);

  const eventHandler = useMemo(
    () =>
      new WebViewEventHandler({
        layout: ({ height: h }) => setHeight(h),
        error: ({ name, message }) => {
          throw new WebViewError(name, message);
        },
        nextpressed: ({ id }) =>
          onNextAlgorithm(new AlgorithmId(id), algorithm),
      }),
    [algorithm, onNextAlgorithm]
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

export { TextAlgorithmView };
