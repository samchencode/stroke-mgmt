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
  renderAlgorithm: (a: Algorithm) => Promise<RenderedAlgorithm>;
  renderAlgorithmById: (id: AlgorithmId) => Promise<RenderedAlgorithm>;
  onChangeCollection: (collection: RenderedAlgorithmCollection) => void;
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
    const { collection, renderAlgorithmById, onChangeCollection } = this.props;
    const rAlgo = await renderAlgorithmById(id);
    const updatedCollection = collection.selectAlgorithm(
      rAlgo,
      sourceAlgorithm
    );
    onChangeCollection(updatedCollection);
  }

  render() {
    const { collection, width } = this.props;

    return (
      <>
        {collection.get().map((rAlgo) => (
          <AlgorithmView
            key={rAlgo.getAlgorithmId().toString()}
            width={width}
            html={rAlgo.getHtml()}
            algorithm={rAlgo.getAlgorithm()}
            onChangeAlgorithm={this.handleChangeAlgorithm}
            onNextAlgorithm={this.handleNextAlgorithm}
            style={styles.algorithm}
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
});

export { FilledAlgorithmCollectionView };
