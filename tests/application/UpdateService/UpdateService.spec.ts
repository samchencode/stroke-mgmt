import type {
  PostUpdateChangeClass,
  VersionRepository,
} from '@/application/UpdateService';
import { UpdateService, Version } from '@/application/UpdateService';
import { Injector } from 'didi';

describe('UpdateService', () => {
  describe('Instantiation', () => {
    it('should be created with dependencies', () => {
      const version = new Version(1, 0, 0);
      const versionRepository = {
        getLastUsedVersion: jest.fn(),
        update: jest.fn(),
      } satisfies VersionRepository;
      const injector = new Injector([]);
      const create = () =>
        new UpdateService([], version, versionRepository, injector);

      expect(create).not.toThrow();
    });
  });

  describe('Behavior', () => {
    let injector: Injector;

    beforeEach(() => {
      injector = new Injector([
        {
          a: ['value', 1],
          b: ['value', 2],
        },
      ]);
    });

    it('should run updates for versions after stale version', async () => {
      const version = new Version(2, 1, 3);
      const versionRepository = {
        getLastUsedVersion: jest.fn().mockResolvedValue(new Version(2, 0, 0)),
        update: jest.fn().mockResolvedValue(Promise.resolve()),
      } satisfies VersionRepository;

      const v210 = jest.fn().mockResolvedValue(Promise.resolve());
      const v213 = jest.fn().mockResolvedValue(Promise.resolve());

      const updates = [
        class {
          static version = new Version(2, 1, 0);

          apply = v210;
        },
        class {
          static version = new Version(2, 1, 3);

          apply = v213;
        },
      ];

      const updateService = new UpdateService(
        updates,
        version,
        versionRepository,
        injector
      );
      await updateService.performPostUpdateChangesIfNecessary();
      expect(v210).toHaveBeenCalledTimes(1);
      expect(v213).toHaveBeenCalledTimes(1);
    });

    it('should save new version after update', async () => {
      const version = new Version(2, 1, 3);
      const versionRepository = {
        getLastUsedVersion: jest.fn().mockResolvedValue(new Version(2, 0, 0)),
        update: jest.fn().mockResolvedValue(undefined),
      } satisfies VersionRepository;

      const updates: PostUpdateChangeClass[] = [];

      const updateService = new UpdateService(
        updates,
        version,
        versionRepository,
        injector
      );
      await updateService.performPostUpdateChangesIfNecessary();
      expect(versionRepository.update).toHaveBeenCalledTimes(1);
      expect(versionRepository.update).toHaveBeenCalledWith(version);
    });

    it('should not run post-updates for versions prior to stale version', async () => {
      const version = new Version(2, 1, 5);
      const versionRepository = {
        getLastUsedVersion: jest.fn().mockResolvedValue(new Version(2, 0, 0)),
        update: jest.fn().mockResolvedValue(undefined),
      } satisfies VersionRepository;

      const v150 = jest.fn().mockResolvedValue(Promise.resolve());
      const v210 = jest.fn().mockResolvedValue(Promise.resolve());

      const updates = [
        class {
          static version = new Version(1, 5, 0);

          apply = v150;
        },
        class {
          static version = new Version(2, 1, 0);

          apply = v210;
        },
      ];

      const updateService = new UpdateService(
        updates,
        version,
        versionRepository,
        injector
      );
      await updateService.performPostUpdateChangesIfNecessary();
      expect(v150).not.toHaveBeenCalled();
      expect(v210).toHaveBeenCalledTimes(1);
    });

    it('should not run if version is not stale', async () => {
      const version = new Version(2, 1, 3);
      const versionRepository = {
        getLastUsedVersion: jest.fn().mockResolvedValue(new Version(2, 1, 3)),
        update: jest.fn().mockResolvedValue(undefined),
      } satisfies VersionRepository;

      const v999 = jest.fn().mockResolvedValue(Promise.resolve());

      const updates = [
        class {
          static version = new Version(9, 9, 9);

          apply = v999;
        },
      ];

      const updateService = new UpdateService(
        updates,
        version,
        versionRepository,
        injector
      );
      await updateService.performPostUpdateChangesIfNecessary();
      expect(v999).not.toHaveBeenCalled();
    });

    it('should not run if no interval update', async () => {
      const version = new Version(2, 2, 5);
      const versionRepository = {
        getLastUsedVersion: jest.fn().mockResolvedValue(new Version(2, 1, 3)),
        update: jest.fn().mockResolvedValue(undefined),
      } satisfies VersionRepository;

      const v213 = jest.fn().mockResolvedValue(Promise.resolve());

      const updates = [
        class {
          static version = new Version(2, 1, 3);

          apply = v213;
        },
      ];

      const updateService = new UpdateService(
        updates,
        version,
        versionRepository,
        injector
      );
      await updateService.performPostUpdateChangesIfNecessary();
      expect(v213).not.toHaveBeenCalled();
    });

    it('should inject dependencies to post update class constructor', async () => {
      const version = new Version(2, 1, 0);
      const versionRepository = {
        getLastUsedVersion: jest.fn().mockResolvedValue(new Version(1, 1, 25)),
        update: jest.fn().mockResolvedValue(undefined),
      } satisfies VersionRepository;

      const constructorDone = jest.fn();

      const updates = [
        class {
          static version = new Version(2, 1, 0);

          static $inject = ['a', 'b'];

          constructor(a: number, b: number) {
            expect(a).toBe(1);
            expect(b).toBe(2);
            constructorDone();
          }

          apply = jest.fn().mockResolvedValue(Promise.resolve());
        },
      ];

      const updateService = new UpdateService(
        updates,
        version,
        versionRepository,
        injector
      );
      await updateService.performPostUpdateChangesIfNecessary();
      expect(constructorDone).toHaveBeenCalled();
    });

    it('should not throw if no post-update changes provided', async () => {
      const version = new Version(2, 1, 3);
      const versionRepository = {
        getLastUsedVersion: jest.fn().mockResolvedValue(new Version(2, 0, 0)),
        update: jest.fn().mockResolvedValue(undefined),
      } satisfies VersionRepository;

      const updates: PostUpdateChangeClass[] = [];

      const updateService = new UpdateService(
        updates,
        version,
        versionRepository,
        injector
      );
      const promise = updateService.performPostUpdateChangesIfNecessary();

      await expect(promise).resolves.not.toThrow();
    });
  });
});
