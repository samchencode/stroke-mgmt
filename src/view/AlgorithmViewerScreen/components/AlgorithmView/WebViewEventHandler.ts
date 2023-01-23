import type {
  Event,
  ErrorEvent,
  SwitchChangedEvent,
  LayoutEvent,
  NextPressedEvent,
  LinkPressedEvent,
} from '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer';
import { openUrl } from '@/view/AlgorithmViewerScreen/components/AlgorithmView/ExpoLinking';

type HandlerCollection = {
  error?: (e: ErrorEvent['content']) => void;
  switchchanged?: (e: SwitchChangedEvent['content']) => void;
  layout?: (e: LayoutEvent['content']) => void;
  nextpressed?: (e: NextPressedEvent['content']) => void;
  linkpressed?: (e: LinkPressedEvent['content']) => void;
};

class WebViewEventHandler {
  constructor(private handlers: HandlerCollection) {}

  handle(e: Event) {
    if (e.type === 'error') this.handleError(e);
    if (e.type === 'layout') this.handleLayout(e);
    if (e.type === 'nextpressed') this.handleNextPressed(e);
    if (e.type === 'switchchanged') this.handleSwitchChanged(e);
    if (e.type === 'linkpressed') this.handleLinkPressed(e);
  }

  handleError(e: ErrorEvent) {
    if (!this.handlers.error) return;
    this.handlers.error(e.content);
  }

  handleSwitchChanged(e: SwitchChangedEvent) {
    if (!this.handlers.switchchanged) return;
    this.handlers.switchchanged(e.content);
  }

  handleLayout(e: LayoutEvent) {
    if (!this.handlers.layout) return;
    this.handlers.layout(e.content);
  }

  handleNextPressed(e: NextPressedEvent) {
    if (!this.handlers.nextpressed) return;
    this.handlers.nextpressed(e.content);
  }

  handleLinkPressed(e: LinkPressedEvent) {
    if (!this.handlers.linkpressed) {
      let url = e.content.href;
      if (!url.match(/^https?:/)) url = `https://${url}`;
      openUrl(url);
    } else {
      this.handlers.linkpressed(e.content);
    }
  }
}

export { WebViewEventHandler };
