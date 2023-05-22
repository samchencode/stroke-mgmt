import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { Algorithm, ScoredAlgorithm } from '@/domain/models/Algorithm';
import { AlgorithmId, SwitchId } from '@/domain/models/Algorithm';
import type { WebViewEvent } from '@/infrastructure/rendering/WebViewEvent';
import {
  WebViewEventHandler,
  WebViewError,
} from '@/infrastructure/rendering/WebViewEvent';
import { LevelId } from '@/domain/models/Algorithm/Switch';
import { ArticleId } from '@/domain/models/Article';

type ScoredAlgorithmViewProps = {
  html: string;
  width: number;
  algorithm: ScoredAlgorithm;
  onChangeAlgorithm: (algo: ScoredAlgorithm) => void;
  onNextAlgorithm: (id: AlgorithmId, thisAlgorithm: Algorithm) => void;
  onPressArticleLink: (id: ArticleId) => void;
};

function ScoredAlgorithmView({
  html,
  width,
  algorithm,
  onChangeAlgorithm,
  onNextAlgorithm,
  onPressArticleLink,
}: ScoredAlgorithmViewProps) {
  const [height, setHeight] = useState(1);

  const eventHandler = useMemo(
    () =>
      new WebViewEventHandler({
        layout: ({ height: h }) => setHeight(h),
        error: ({ name, message }) => {
          throw new WebViewError(name, message);
        },
        switchchanged: ({ id, levelId }) => {
          const newAlgo = algorithm.setSwitchById(
            new SwitchId(id),
            new LevelId(levelId)
          );
          onChangeAlgorithm(newAlgo);
        },
        nextpressed: ({ id }) =>
          onNextAlgorithm(new AlgorithmId(id), algorithm),
        articlelinkpressed: ({ articleId }) =>
          onPressArticleLink(new ArticleId(articleId)),
      }),
    [algorithm, onChangeAlgorithm, onNextAlgorithm, onPressArticleLink]
  );

  const handleMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const event = JSON.parse(nativeEvent.data) as WebViewEvent;
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
        textInteractionEnabled
      />
    </View>
  );
}

export { ScoredAlgorithmView };
