import type { GetAlgorithmByIdAction } from '@/application/GetAlgorithmByIdAction';
import type { RenderAlgorithmAction } from '@/application/RenderAlgorithmAction';
import type {
  Algorithm,
  AlgorithmId,
  RenderedAlgorithm,
} from '@/domain/models/Algorithm';

class RenderAlgorithmByIdAction {
  constructor(
    private getAlgorithmByIdAction: GetAlgorithmByIdAction,
    private renderAlgorithmAction: RenderAlgorithmAction
  ) {}

  static $inject = ['getAlgorithmByIdAction', 'renderAlgorithmAction'];

  async execute(
    id: AlgorithmId,
    onStaleCallback: (renderedAlgorithm: RenderedAlgorithm) => void
  ) {
    const handleStale = (v: Algorithm) =>
      this.renderAlgorithmAction.execute(v).then((r) => onStaleCallback(r));
    const algorithm = await this.getAlgorithmByIdAction.execute(
      id,
      handleStale
    );
    return this.renderAlgorithmAction.execute(algorithm);
  }
}

export { RenderAlgorithmByIdAction };
