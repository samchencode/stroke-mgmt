import React, { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { RenderDisclaimerAction } from '@/application/RenderDisclaimerAction';

function factory(renderDisclaimerAction: RenderDisclaimerAction) {
  return function DisclaimerModal() {
    const [html, setHtml] = useState('');
    useEffect(() => {
      renderDisclaimerAction.execute().then((h) => setHtml(h));
    }, []);

    const { width, height } = useWindowDimensions();

    return (
      <View>
        <WebView
          source={{ html }}
          originWhitelist={['*']}
          style={{ width, height }}
        />
      </View>
    );
  };
}

export { factory };
export type Type = ReturnType<typeof factory>;
