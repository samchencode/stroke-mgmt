class Version {
  constructor(
    private readonly major: number,
    private readonly minor: number,
    private readonly patch: number
  ) {
    if (major < 0 || minor < 0 || patch < 0)
      throw new Error(
        `Invalid version number (${major}.${minor}.${patch}). No negative values.`
      );
  }

  getMajor() {
    return this.major;
  }

  getMinor() {
    return this.minor;
  }

  getPatch() {
    return this.patch;
  }

  isLessThan(other: Version) {
    const oMajor = other.getMajor();
    const oMinor = other.getMinor();
    const oPatch = other.getPatch();
    if (oMajor !== this.major) return this.major < oMajor;
    if (oMinor !== this.minor) return this.minor < oMinor;
    if (oPatch !== this.patch) return this.patch < oPatch;
    return false; // versions are equal
  }

  is(other: Version) {
    return (
      this.major === other.getMajor() &&
      this.minor === other.getMinor() &&
      this.patch === other.getPatch()
    );
  }

  toString() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  serialize(): string {
    return JSON.stringify({
      major: this.major,
      minor: this.minor,
      patch: this.patch,
    } satisfies VersionJson);
  }

  static get DEFAULT_VERSION() {
    return new Version(1, 0, 0);
  }

  static deserialize(json: string): Version {
    const jsonObj = JSON.parse(json) as VersionJson;
    return new Version(jsonObj.major, jsonObj.minor, jsonObj.patch);
  }
}

type VersionJson = {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
};

export { Version };
