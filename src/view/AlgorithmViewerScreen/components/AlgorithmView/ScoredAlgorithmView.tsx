import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { Message } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/AlgorithmWebViewMessages';
import type { Outcome, ScoredAlgorithm } from '@/domain/models/Algorithm';
import { SwitchId } from '@/domain/models/Algorithm';

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
  const [height, setHeight] = useState(0);

  const handleMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const { type, content } = JSON.parse(nativeEvent.data) as Message;
      if (type === 'layout') {
        setHeight(content.height);
      } else if (type === 'switchchanged') {
        const { id: swId, active } = content;
        const newAlgo = algorithm.setSwitchById(new SwitchId(swId), active);
        onChangeAlgorithm(newAlgo);
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
    [algorithm, onChangeAlgorithm, onSelectOutcome]
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
