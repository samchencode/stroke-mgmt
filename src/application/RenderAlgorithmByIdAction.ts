import type { GetAlgorithmByIdAction } from '@/application/GetAlgorithmByIdAction';
import type { RenderAlgorithmAction } from '@/application/RenderAlgorithmAction';
import type { AlgorithmId } from '@/domain/models/Algorithm';

class RenderAlgorithmByIdAction {
  constructor(
    private getAlgorithmByIdAction: GetAlgorithmByIdAction,
    private renderAlgorithmAction: RenderAlgorithmAction
  ) {}

  async execute(id: AlgorithmId) {
    const algorithm = await this.getAlgorithmByIdAction.execute(id);
    return this.renderAlgorithmAction.execute(algorithm);
  }
}

export { RenderAlgorithmByIdAction };
