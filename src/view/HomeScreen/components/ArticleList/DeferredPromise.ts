class DeferredPromise<T = undefined> {
  private promiseResolveCallback: (v: T | PromiseLike<T>) => void = () => {};

  private promiseRejectCallback: (reason?: unknown) => void = () => {};

  private promise: Promise<T>;

  constructor() {
    this.promise = new Promise((s, f) => {
      this.promiseResolveCallback = s;
      this.promiseRejectCallback = f;
    });
  }

  resolve(v: T | PromiseLike<T>) {
    this.promiseResolveCallback(v);
  }

  reject(reason: unknown) {
    this.promiseRejectCallback(reason);
  }

  get then() {
    return this.promise.then.bind(this.promise);
  }

  get catch() {
    return this.promise.catch.bind(this.promise);
  }

  get finally() {
    return this.promise.finally.bind(this.promise);
  }
}

export { DeferredPromise };
