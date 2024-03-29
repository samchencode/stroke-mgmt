import React, { Component } from 'react';
import type {
  Algorithm,
  AlgorithmId,
  AlgorithmVisitor,
  ScoredAlgorithm,
} from '@/domain/models/Algorithm';
import { TextAlgorithmView } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/TextAlgorithmView';
import { ScoredAlgorithmView } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/ScoredAlgorithmView';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import type { ArticleId } from '@/domain/models/Article';

type AlgorithmViewProps = {
  algorithm: Algorithm;
  html: string;
  width: number;
  onChangeAlgorithm: (a: Algorithm) => void;
  onNextAlgorithm: (id: AlgorithmId, thisAlgorithm: Algorithm) => void;
  onPressArticleLink: (id: ArticleId) => void;
  onPressExternalLink: (url: string) => void;
  onFirstLayout: () => void;
  style?: StyleProp<ViewStyle>;
};

type AlgorithmType = 'text' | 'scored' | null;

class AlgorithmView
  extends Component<AlgorithmViewProps, Record<string, never>>
  implements AlgorithmVisitor
{
  static defaultProps = {
    style: {},
  };

  private type: AlgorithmType = null;

  constructor(props: AlgorithmViewProps) {
    super(props);
    props.algorithm.acceptVisitor(this);
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  visitTextAlgorithm(): void {
    this.type = 'text';
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  visitScoredAlgorithm(): void {
    this.type = 'scored';
  }

  private renderTextAlgorithm() {
    const {
      html,
      width,
      onNextAlgorithm,
      algorithm,
      onPressArticleLink,
      onPressExternalLink,
      onFirstLayout,
    } = this.props;
    return (
      <TextAlgorithmView
        html={html}
        width={width}
        algorithm={algorithm}
        onNextAlgorithm={onNextAlgorithm}
        onPressArticleLink={onPressArticleLink}
        onPressExternalLink={onPressExternalLink}
        onFirstLayout={onFirstLayout}
      />
    );
  }

  private renderScoredAlgorithm() {
    const {
      html,
      width,
      onNextAlgorithm,
      onChangeAlgorithm,
      algorithm,
      onPressArticleLink,
      onPressExternalLink,
      onFirstLayout,
    } = this.props;
    return (
      <ScoredAlgorithmView
        html={html}
        width={width}
        algorithm={algorithm as ScoredAlgorithm}
        onNextAlgorithm={onNextAlgorithm}
        onChangeAlgorithm={onChangeAlgorithm}
        onPressArticleLink={onPressArticleLink}
        onPressExternalLink={onPressExternalLink}
        onFirstLayout={onFirstLayout}
      />
    );
  }

  private renderAlgorithm() {
    if (this.type === 'text') return this.renderTextAlgorithm();
    if (this.type === 'scored') return this.renderScoredAlgorithm();
    throw Error('AlgorithmViewVisitor not visited');
  }

  render() {
    const { style } = this.props;

    return <View style={style}>{this.renderAlgorithm()}</View>;
  }
}

export { AlgorithmView };
