import React, { Component } from 'react';
import type {
  Algorithm,
  AlgorithmId,
  AlgorithmVisitor,
  ScoredAlgorithm,
} from '@/domain/models/Algorithm';
import { TextAlgorithmView } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/TextAlgorithmView';
import { ScoredAlgorithmView } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/ScoredAlgorithmView';

type AlgorithmViewProps = {
  algorithm: Algorithm;
  html: string;
  width: number;
  onChangeAlgorithm: (a: Algorithm) => void;
  onNextAlgorithm: (id: AlgorithmId, thisAlgorithm: Algorithm) => void;
};

type AlgorithmType = 'text' | 'scored' | null;

class AlgorithmView
  extends Component<AlgorithmViewProps, Record<string, never>>
  implements AlgorithmVisitor
{
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
    const { html, width, onNextAlgorithm, algorithm } = this.props;
    return (
      <TextAlgorithmView
        html={html}
        width={width}
        algorithm={algorithm}
        onNextAlgorithm={onNextAlgorithm}
      />
    );
  }

  private renderScoredAlgorithm() {
    const { html, width, onNextAlgorithm, onChangeAlgorithm, algorithm } =
      this.props;
    return (
      <ScoredAlgorithmView
        html={html}
        width={width}
        algorithm={algorithm as ScoredAlgorithm}
        onNextAlgorithm={onNextAlgorithm}
        onChangeAlgorithm={onChangeAlgorithm}
      />
    );
  }

  render() {
    if (this.type === 'text') return this.renderTextAlgorithm();
    if (this.type === 'scored') return this.renderScoredAlgorithm();
    throw Error('AlgorithmViewVisitor not visited');
  }
}

export { AlgorithmView };
