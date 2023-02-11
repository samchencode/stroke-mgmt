/* eslint-disable max-classes-per-file */

import React, { PureComponent } from 'react';
import type {
  Algorithm,
  AlgorithmId,
  RenderedAlgorithm,
} from '@/domain/models/Algorithm';
import { RenderedAlgorithmCollection } from '@/domain/models/Algorithm';
import { FilledAlgorithmCollectionView } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/FilledAlgorithmCollectionView';
import { EmptyAlgorithmCollectionView } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/EmptyAlgorithmCollectionView';

type AlgorithmCollectionViewProps = {
  renderAlgorithm: (a: Algorithm) => Promise<RenderedAlgorithm>;
  renderAlgorithmById: (id: AlgorithmId) => Promise<RenderedAlgorithm>;
  onNextAlgorithm: () => void;
  initialId: AlgorithmId;
  width: number;
  minHeight: number;
};

type AlgorithmCollectionViewState = {
  collection: RenderedAlgorithmCollection | null;
};

class AlgorithmCollectionView extends PureComponent<
  AlgorithmCollectionViewProps,
  AlgorithmCollectionViewState
> {
  constructor(props: AlgorithmCollectionViewProps) {
    super(props);
    this.state = {
      collection: null,
    };
    this.getInitialAlgorithm();
    this.handleChangeCollection = this.handleChangeCollection.bind(this);
  }

  handleChangeCollection(newCollection: RenderedAlgorithmCollection) {
    this.setState({ collection: newCollection });
  }

  async getInitialAlgorithm() {
    const { initialId, renderAlgorithmById } = this.props;
    const rAlgo = await renderAlgorithmById(initialId);
    const collection = new RenderedAlgorithmCollection(rAlgo);
    this.setState({ collection });
  }

  render() {
    const { collection } = this.state;
    const {
      renderAlgorithm,
      renderAlgorithmById,
      onNextAlgorithm,
      width,
      minHeight,
    } = this.props;

    if (collection === null) return <EmptyAlgorithmCollectionView />;

    return (
      <FilledAlgorithmCollectionView
        collection={collection}
        width={width}
        minHeight={minHeight}
        renderAlgorithm={renderAlgorithm}
        renderAlgorithmById={renderAlgorithmById}
        onChangeCollection={this.handleChangeCollection}
        onNextAlgorithm={onNextAlgorithm}
      />
    );
  }
}

export { AlgorithmCollectionView };
