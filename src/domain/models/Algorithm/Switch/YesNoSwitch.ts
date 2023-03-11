import { Level } from '@/domain/models/Algorithm/Switch/Level';
import { LevelId } from '@/domain/models/Algorithm/Switch/LevelId';
import { Switch } from '@/domain/models/Algorithm/Switch/Switch';
import type { SwitchId } from '@/domain/models/Algorithm/Switch/SwitchId';

type SwitchParams = {
  id: SwitchId;
  label: string;
  valueIfActive: number;
  set?: boolean;
  description?: string;
};

class YesNoSwitch extends Switch {
  constructor(params: SwitchParams) {
    super({
      ...params,
      levels: [
        new Level(YesNoSwitch.YES, 'Yes', params.valueIfActive),
        new Level(YesNoSwitch.NO, 'No', 0),
      ],
    });
  }

  static YES = new LevelId('yes');

  static NO = new LevelId('no');
}

export { YesNoSwitch };
