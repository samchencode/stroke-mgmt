import {
  AlgorithmId,
  AlgorithmInfo,
  Outcome,
  ScoredAlgorithm,
  Switch,
  SwitchId,
  TextAlgorithm,
} from '@/domain/models/Algorithm';
import type { Criterion } from '@/domain/models/Algorithm/Criterion';
import {
  GreaterThanCriterion,
  LessThanCriterion,
  NoCriterion,
} from '@/domain/models/Algorithm/Criterion';
import { Level, LevelId } from '@/domain/models/Algorithm/Switch';
import { Image } from '@/domain/models/Image';
import type { StrapiAlgorithmData } from '@/infrastructure/persistence/strapi/StrapiApiResponse';

export const strapiResponseToAlgorithm = (
  defaultThumbnail: Image,
  { id: algoId, attributes }: StrapiAlgorithmData
): TextAlgorithm | ScoredAlgorithm => {
  const {
    Title,
    Summary,
    Body,
    outcomes: outcomeData,
    switches: switchData,
  } = attributes;

  const outcomes = outcomeData.map(
    ({ Title: tData, Body: bData, criterion: critData, next: nextData }) => {
      let criterion: Criterion = new NoCriterion();

      if (critData?.Type === 'GreaterThan') {
        criterion = new GreaterThanCriterion(critData.Value);
      } else if (critData?.Type === 'LessThan') {
        criterion = new LessThanCriterion(critData?.Value);
      }

      const next = nextData.data
        ? new AlgorithmId(nextData.data.id.toString(10))
        : undefined;

      return new Outcome({ title: tData, body: bData, criterion, next });
    }
  );

  let thumbnail = defaultThumbnail;
  if (attributes.Thumbnail.data !== null) {
    thumbnail = new Image(
      attributes.Thumbnail.data.attributes.formats.thumbnail.url
    );
  }

  const info = new AlgorithmInfo({
    id: new AlgorithmId(algoId.toString()),
    title: Title,
    summary: Summary,
    body: Body,
    outcomes,
    thumbnail,
  });

  if (switchData.length === 0) {
    return new TextAlgorithm({ info });
  }
  const switches = switchData.map(
    ({ id: switchId, Label, Description, levels }) =>
      new Switch({
        id: new SwitchId(switchId.toString()),
        label: Label,
        description: Description ?? undefined,
        levels: levels.map(
          (l) => new Level(new LevelId(l.id.toString()), l.Label, l.Value)
        ),
      })
  );

  return new ScoredAlgorithm({ info, switches });
};
