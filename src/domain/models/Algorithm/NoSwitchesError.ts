class NoSwitchesError extends Error {
  constructor(algorithmName: string) {
    super(`No switches were provided to ScoredAlgorithm: ${algorithmName}`);
  }
}

export { NoSwitchesError };
