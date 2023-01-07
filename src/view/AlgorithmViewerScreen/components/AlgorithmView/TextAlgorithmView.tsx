import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { Message } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/AlgorithmWebViewMessages';
import type { Outcome, TextAlgorithm } from '@/domain/models/Algorithm';

type TextAlgorithmViewProps = {
  html: string;
  width: number;
  algorithm: TextAlgorithm;
  onSelectOutcome: (outcome: Outcome) => void;
};

function TextAlgorithmView({
  html,
  width,
  algorithm,
  onSelectOutcome,
}: TextAlgorithmViewProps) {
  const [height, setHeight] = useState(0);

  const handleMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const { type, content } = JSON.parse(nativeEvent.data) as Message;
      if (type === 'layout') {
        setHeight(content.height);
      } else if (type === 'outcomeselected') {
        const outcomeTitle = content.title;
        const outcome = algorithm
          .getOutcomes()
          .find((o) => o.getTitle() === outcomeTitle);
        if (!outcome) throw Error();
        onSelectOutcome(outcome);
      } else if (type === 'error') {
        throw new Error(`${content.type}: ${content.message}`);
      }
    },
    [algorithm, onSelectOutcome]
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
