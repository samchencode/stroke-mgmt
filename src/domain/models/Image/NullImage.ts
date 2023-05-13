import { Image } from '@/domain/models/Image/Image';

const DEFAULT_IMAGE_URI =
  'data:image/png;base64,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';

class NullImage extends Image {
  constructor() {
    super(DEFAULT_IMAGE_URI);
  }
}

export { NullImage };
