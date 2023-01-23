import type {
  Event,
  ErrorEvent,
  SwitchChangedEvent,
  LayoutEvent,
  OutcomeSelectedEvent,
} from '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer';

type HandlerCollection = {
  error?: (e: ErrorEvent['content']) => void;
  switchchanged?: (e: SwitchChangedEvent['content']) => void;
  layout?: (e: LayoutEvent['content']) => void;
  outcomeselected?: (e: OutcomeSelectedEvent['content']) => void;
};

class WebViewEventHandler {
  constructor(private handlers: HandlerCollection) {}

  handle(e: Event) {
    if (e.type === 'error') this.handleError(e);
    if (e.type === 'layout') this.handleLayout(e);
    if (e.type === 'outcomeselected') this.handleOutcomeSelected(e);
    if (e.type === 'switchchanged') this.handleSwitchChanged(e);
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

  handleOutcomeSelected(e: OutcomeSelectedEvent) {
    if (!this.handlers.outcomeselected) return;
    this.handlers.outcomeselected(e.content);
  }
}

export { WebViewEventHandler };
