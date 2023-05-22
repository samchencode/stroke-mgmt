import type { Switch, Level } from '@/domain/models/Algorithm';
import type {
  LevelData,
  SwitchData,
} from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/tableSchema';

function extractLevelData(l: Level): LevelData {
  return {
    id: l.getId().toString(),
    label: l.getLabel(),
    value: l.getValue(),
  };
}

function extractSwitchData(s: Switch): SwitchData {
  const levelData = s.getLevels().map(extractLevelData);
  return {
    id: s.getId().toString(),
    label: s.getLabel(),
    levels: levelData,
    description: s.getDescription() ?? null,
  };
}

function serializeSwitches(s: Switch[]) {
  const switchData = s.map(extractSwitchData);
  return JSON.stringify(switchData);
}

export { serializeSwitches };
