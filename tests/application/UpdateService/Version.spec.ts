import { Version } from '@/application/UpdateService';

describe('Version', () => {
  describe('Instantiation', () => {
    it('should instantiate with version numbers', () => {
      const create = () => new Version(0, 0, 0);
      expect(create).not.toThrow();
    });

    it('should throw error with negative values', () => {
      const boom1 = () => new Version(-51, 1, 1);
      const boom2 = () => new Version(1, -99, 1);
      const boom3 = () => new Version(-1, 1, -12);

      expect(boom1).toThrow('negative');
      expect(boom2).toThrow('negative');
      expect(boom3).toThrow('negative');
    });

    it('should make a default version 1.0.0', () => {
      const create = () => Version.DEFAULT_VERSION;
      expect(create).not.toThrow();
      expect(Version.DEFAULT_VERSION.is(new Version(1, 0, 0))).toBe(true);
    });
  });

  describe('Behavior', () => {
    it('should make semver string', () => {
      const version = new Version(0, 0, 1);
      expect(version.toString()).toBe('0.0.1');
    });

    it('should compare versions', () => {
      const version100 = new Version(1, 0, 0);
      const version110 = new Version(1, 1, 0);
      const version101 = new Version(1, 0, 1);
      const version010 = new Version(0, 1, 0);
      const version011 = new Version(0, 1, 1);
      const version001 = new Version(0, 0, 1);
      const version000 = new Version(0, 0, 0);
      const version111 = new Version(1, 1, 1);

      expect(version100.isLessThan(version110)).toBe(true);
      expect(version100.isLessThan(version101)).toBe(true);
      expect(version100.isLessThan(version111)).toBe(true);
      expect(version100.isLessThan(version010)).toBe(false);
      expect(version100.isLessThan(version011)).toBe(false);
      expect(version100.isLessThan(version001)).toBe(false);
      expect(version100.isLessThan(version000)).toBe(false);

      expect(version110.isLessThan(version100)).toBe(false);
      expect(version110.isLessThan(version101)).toBe(false);
      expect(version110.isLessThan(version111)).toBe(true);
      expect(version110.isLessThan(version010)).toBe(false);
      expect(version110.isLessThan(version011)).toBe(false);
      expect(version110.isLessThan(version001)).toBe(false);
      expect(version110.isLessThan(version000)).toBe(false);

      expect(version101.isLessThan(version100)).toBe(false);
      expect(version101.isLessThan(version110)).toBe(true);
      expect(version101.isLessThan(version111)).toBe(true);
      expect(version101.isLessThan(version010)).toBe(false);
      expect(version101.isLessThan(version011)).toBe(false);
      expect(version101.isLessThan(version001)).toBe(false);
      expect(version101.isLessThan(version000)).toBe(false);

      expect(version010.isLessThan(version100)).toBe(true);
      expect(version010.isLessThan(version110)).toBe(true);
      expect(version010.isLessThan(version101)).toBe(true);
      expect(version010.isLessThan(version111)).toBe(true);
      expect(version010.isLessThan(version011)).toBe(true);
      expect(version010.isLessThan(version001)).toBe(false);
      expect(version010.isLessThan(version000)).toBe(false);

      expect(version011.isLessThan(version100)).toBe(true);
      expect(version011.isLessThan(version110)).toBe(true);
      expect(version011.isLessThan(version101)).toBe(true);
      expect(version011.isLessThan(version111)).toBe(true);
      expect(version011.isLessThan(version010)).toBe(false);
      expect(version011.isLessThan(version001)).toBe(false);
      expect(version011.isLessThan(version000)).toBe(false);

      expect(version001.isLessThan(version100)).toBe(true);
      expect(version001.isLessThan(version110)).toBe(true);
      expect(version001.isLessThan(version101)).toBe(true);
      expect(version001.isLessThan(version111)).toBe(true);
      expect(version001.isLessThan(version010)).toBe(true);
      expect(version001.isLessThan(version011)).toBe(true);
      expect(version001.isLessThan(version000)).toBe(false);

      expect(version000.isLessThan(version100)).toBe(true);
      expect(version000.isLessThan(version110)).toBe(true);
      expect(version000.isLessThan(version101)).toBe(true);
      expect(version000.isLessThan(version111)).toBe(true);
      expect(version000.isLessThan(version010)).toBe(true);
      expect(version000.isLessThan(version011)).toBe(true);
      expect(version000.isLessThan(version001)).toBe(true);
    });
  });
});
