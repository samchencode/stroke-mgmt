import React, { PureComponent } from 'react';
import type {
  Algorithm,
  AlgorithmId,
  RenderedAlgorithm,
  RenderedAlgorithmCollection,
} from '@/domain/models/Algorithm';
import { AlgorithmView } from '@/view/AlgorithmViewerScreen/components/AlgorithmView';
import { StyleSheet } from 'react-native';
import { theme } from '@/view/theme';

type FilledAlgorithmCollectionProps = {
  collection: RenderedAlgorithmCollection;
  width: number;
  minHeight: number;
  renderAlgorithm: (a: Algorithm) => Promise<RenderedAlgorithm>;
  renderAlgorithmById: (id: AlgorithmId) => Promise<RenderedAlgorithm>;
  onChangeCollection: (collection: RenderedAlgorithmCollection) => void;
  onNextAlgorithm: () => void;
};

class FilledAlgorithmCollectionView extends PureComponent<FilledAlgorithmCollectionProps> {
  constructor(props: FilledAlgorithmCollectionProps) {
    super(props);
    this.handleChangeAlgorithm = this.handleChangeAlgorithm.bind(this);
    this.handleNextAlgorithm = this.handleNextAlgorithm.bind(this);
  }

  private async handleChangeAlgorithm(a: Algorithm) {
    const { collection, renderAlgorithm, onChangeCollection } = this.props;
    const rAlgo = await renderAlgorithm(a);
    const updatedCollection = collection.setAlgorithm(rAlgo);
    onChangeCollection(updatedCollection);
  }

  private async handleNextAlgorithm(
    id: AlgorithmId,
    sourceAlgorithm: Algorithm
  ) {
    const {
      collection,
      renderAlgorithmById,
      onChangeCollection,
      onNextAlgorithm,
    } = this.props;
    const rAlgo = await renderAlgorithmById(id);
    const updatedCollection = collection.selectAlgorithm(
      rAlgo,
      sourceAlgorithm
    );
    onChangeCollection(updatedCollection);
    setTimeout(onNextAlgorithm, 300);
  }

  render() {
    const { collection, width, minHeight } = this.props;

    return (
      <>
        {collection.get().map((rAlgo, i, arr) => (
          <AlgorithmView
            key={rAlgo.getAlgorithmId().toString()}
            width={width}
            html={rAlgo.getHtml()}
            algorithm={rAlgo.getAlgorithm()}
            onChangeAlgorithm={this.handleChangeAlgorithm}
            onNextAlgorithm={this.handleNextAlgorithm}
            style={[styles.algorithm, arr.length - 1 === i && { minHeight }]}
          />
        ))}
      </>
    );
  }
}

const styles = StyleSheet.create({
  algorithm: {
    marginBottom: theme.spaces.lg,
  },
  lastAlgorithm: {
    backgroundColor: 'red',
    minHeight: 534, // CHANGE THIS
  },
});

export { FilledAlgorithmCollectionView };
