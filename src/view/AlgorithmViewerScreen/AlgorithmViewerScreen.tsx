import React, { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import WebView from 'react-native-webview';
import type { AppNavigationProps } from '@/view/Router';
import type { GetAlgorithmByIdAction } from '@/application/GetAlgorithmByIdAction';
import type { RenderAlgorithmAction } from '@/application/RenderAlgorithmAction';

function factory(
  getAlgorithmByIdAction: GetAlgorithmByIdAction,
  renderAlgorithmAction: RenderAlgorithmAction
) {
  return function AlgorithmViewerScreen({
    route,
  }: AppNavigationProps<'AlgorithmViewerScreen'>) {
    const { id } = route.params;

    const { width } = useWindowDimensions();

    const [html, setHtml] = useState('');
    useEffect(() => {
      getAlgorithmByIdAction
        .execute(id)
        .then((a) => renderAlgorithmAction.execute(a))
        .then(setHtml);
    }, [id]);

    return (
      <View style={styles.container}>
        <WebView source={{ html }} originWhitelist={['*']} style={{ width }} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
