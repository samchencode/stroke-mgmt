import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { Message } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/AlgorithmWebViewMessages';
import type { Algorithm, ScoredAlgorithm } from '@/domain/models/Algorithm';
import { SwitchId } from '@/domain/models/Algorithm';

type AlgorithmViewProps = {
  html: string;
  width: number;
  algorithm: Algorithm;
  onChangeAlgorithm: (algo: Algorithm) => void;
};

function AlgorithmView({
  html,
  width,
  algorithm,
  onChangeAlgorithm,
}: AlgorithmViewProps) {
  const [height, setHeight] = useState(0);

  const handleMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const { type, content } = JSON.parse(nativeEvent.data) as Message;
      if (type === 'layout') {
        setHeight(content.height);
      } else if (type === 'switchchanged') {
        const { id: swId, active } = content;
        const newAlgo = (algorithm as ScoredAlgorithm).setSwitchById(
          new SwitchId(swId),
          active
        );
        onChangeAlgorithm(newAlgo);
      } else if (type === 'error') {
        console.error(content);
      }
    },
    [algorithm, onChangeAlgorithm]
  );

  return (
    <View style={{ height }}>
      <WebView
        source={{ html }}
        originWhitelist={['*']}
        style={{ width }}
        onMessage={handleMessage}
      />
    </View>
  );
}

export { AlgorithmView };
