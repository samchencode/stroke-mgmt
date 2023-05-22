import { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import { AlgorithmInfo } from '@/domain/models/Algorithm/AlgorithmInfo';
import { TextAlgorithm } from '@/domain/models/Algorithm/TextAlgorithm';
import { NullImage } from '@/domain/models/Image/NullImage';

class NullAlgorithm extends TextAlgorithm {
  constructor() {
    const nullAlgorithmInfo = new AlgorithmInfo({
      id: new AlgorithmId('%%%NULL%%%'),
      title: 'Article Not Found',
      body: "The article you're looking for could not be found.",
      summary: "The article you're looking for could not be found.",
      thumbnail: new NullImage(),
      shouldShowOnHomeScreen: false,
      outcomes: [],
      lastUpdated: new Date(0),
    });
    super({ info: nullAlgorithmInfo });
  }
}

export { NullAlgorithm };
