import type {
  WebViewEvent,
  WebViewErrorEvent as ErrorEvent,
  WebViewSwitchChangedEvent as SwitchChangedEvent,
  WebViewLayoutEvent as LayoutEvent,
  WebViewNextPressedEvent as NextPressedEvent,
  WebViewLinkPressedEvent as LinkPressedEvent,
  WebViewArticleLinkPressedEvent as ArticleLinkPressedEvent,
  WebViewLogEvent as LogEvent,
} from '@/infrastructure/rendering/WebViewEvent/WebViewEvent';
import { openURL as openUrl } from 'expo-linking';

type HandlerCollection = {
  error?: (e: ErrorEvent['content']) => void;
  switchchanged?: (e: SwitchChangedEvent['content']) => void;
  layout?: (e: LayoutEvent['content']) => void;
  nextpressed?: (e: NextPressedEvent['content']) => void;
  linkpressed?: (e: LinkPressedEvent['content']) => void;
  articlelinkpressed?: (e: ArticleLinkPressedEvent['content']) => void;
};

class WebViewEventHandler {
  constructor(private handlers: HandlerCollection) {}

  handle(e: WebViewEvent) {
    if (e.type === 'error') this.handleError(e);
    if (e.type === 'layout') this.handleLayout(e);
    if (e.type === 'nextpressed') this.handleNextPressed(e);
    if (e.type === 'switchchanged') this.handleSwitchChanged(e);
    if (e.type === 'linkpressed') this.handleLinkPressed(e);
    if (e.type === 'articlelinkpressed') this.handleArticleLinkPressed(e);
    if (e.type === 'log') this.handleLog(e);
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

  handleArticleLinkPressed(e: ArticleLinkPressedEvent) {
    if (!this.handlers.articlelinkpressed) return;
    this.handlers.articlelinkpressed(e.content);
  }

  handleLog(e: LogEvent) {
    // eslint-disable-next-line no-console
    console.log(e.content.message);
  }
}

export { WebViewEventHandler };
