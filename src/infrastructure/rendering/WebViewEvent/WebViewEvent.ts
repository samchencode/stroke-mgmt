export type WebViewSwitchChangedEvent = {
  readonly type: 'switchchanged';
  content: {
    id: string;
    levelId: string;
  };
};

export type WebViewLayoutEvent = {
  readonly type: 'layout';
  content: {
    width: number;
    height: number;
  };
};

export type WebViewErrorEvent = {
  readonly type: 'error';
  content: {
    name: string;
    message: string;
  };
};

export type WebViewNextPressedEvent = {
  readonly type: 'nextpressed';
  content: {
    id: string;
  };
};

export type WebViewLinkPressedEvent = {
  readonly type: 'linkpressed';
  content: {
    href: string;
  };
};

export type WebViewArticleLinkPressedEvent = {
  readonly type: 'articlelinkpressed';
  content: {
    articleId: string;
  };
};

export type WebViewLogEvent = {
  readonly type: 'log';
  content: {
    message: unknown;
  };
};

export type WebViewEvent =
  | WebViewSwitchChangedEvent
  | WebViewLayoutEvent
  | WebViewErrorEvent
  | WebViewNextPressedEvent
  | WebViewLinkPressedEvent
  | WebViewArticleLinkPressedEvent
  | WebViewLogEvent;
