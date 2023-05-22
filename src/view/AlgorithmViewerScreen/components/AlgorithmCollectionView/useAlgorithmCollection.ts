import { useCallback, useMemo, useRef, useState } from 'react';
import type { AlgorithmId } from '@/domain/models/Algorithm';
import { AlgorithmCollection } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/AlgorithmCollection';
import { v4 as uuidv4 } from 'uuid';

function useAlgorithmCollection(initialId: AlgorithmId, onAppend: () => void) {
  const initialUuid = useMemo(() => uuidv4(), []);
  const validUuids = useRef<Set<string>>(new Set([initialUuid]));

  function pruneUuids(newCollection: AlgorithmCollection) {
    Array.from(validUuids.current.values())
      .filter(
        (currentlyValid) =>
          newCollection.getUuids().indexOf(currentlyValid) === -1
      )
      .forEach((uuid) => {
        validUuids.current.delete(uuid);
      });
  }

  const [collection, setCollection] = useState(
    AlgorithmCollection.fromInitial(initialId, initialUuid)
  );

  const handleAppendToCollection = useCallback(
    (afterUuid: string, newId: AlgorithmId) => {
      const newUuid = uuidv4();
      const newCollection = collection.append(afterUuid, newId, newUuid);
      validUuids.current.add(newUuid);
      setCollection(newCollection);
      onAppend();
    },
    [collection, onAppend]
  );

  const handleDropItemsFromCollectionAfter = useCallback(
    (uuid: string) => {
      const isInvalidated = !validUuids.current.has(uuid);
      if (isInvalidated) return;

      const newCollection = collection.drop(uuid);

      pruneUuids(newCollection);
      setCollection(newCollection);
    },
    [collection]
  );

  return {
    collection,
    handleAppendToCollection,
    handleDropItemsFromCollectionAfter,
  };
}

export { useAlgorithmCollection };
