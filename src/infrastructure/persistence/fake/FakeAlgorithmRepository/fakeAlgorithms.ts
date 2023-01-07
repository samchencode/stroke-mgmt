import {
  LessThanCriterion,
  ScoredAlgorithm,
  AlgorithmId,
  AlgorithmInfo,
  GreaterThanCriterion,
  Outcome,
  Switch,
  SwitchId,
  TextAlgorithm,
} from '@/domain/models/Algorithm';

const gwnsAlgorithm = (() => {
  const info = new AlgorithmInfo({
    id: new AlgorithmId('1'),
    title: 'GWNS',
    body: 'All need immediate Rx and activate brain attack team immediately. ABCT = (airway, breathing, circulation, time of stroke onset). Endotracheal intubation if compromised airway or GCS less than eight. Maintain SBP 140 to 180 mmHg. HR 60-100. Establish IV access and hydration is recommended based on height/weight and clinical scenarios',
    summary: 'Use after you know the ABCTs are stable',
    outcomes: [
      new Outcome({
        title: 'LVO',
        body: 'Go to Endovascular Suite, NO CTA NEEDED! Endovascular Strategies: Maintain SBP 140 to 180 mm Hg until to IR. Adequate hydration. Give IVTPA if candidate, if beyond TPA candidate, 300 mg rectal aspirin and bring the patient to IR. No EVMT patient should receive Foley unless indicated.',
        criterion: new GreaterThanCriterion(2),
      }),
      new Outcome({
        title: 'Non-LVO',
        body: 'Do Non-LVO procedures!',
        criterion: new LessThanCriterion(3),
      }),
    ],
  });

  const switches = [
    new Switch({
      id: new SwitchId('0'),
      label: 'Gaze Deviation',
      value: 1,
    }),
    new Switch({
      id: new SwitchId('1'),
      label: 'Weakness',
      value: 1,
    }),
    new Switch({
      id: new SwitchId('2'),
      label: 'Neglect/Disregard/Extinction',
      value: 1,
    }),
    new Switch({
      id: new SwitchId('3'),
      label: 'Speech impairment',
      value: 1,
    }),
  ];

  return new ScoredAlgorithm({ info, switches });
})();

const abctAlgorithm = (() => {
  const info = new AlgorithmInfo({
    id: new AlgorithmId('0'),
    title: 'ABCTs',
    body: '<ul><li>airway</li><li>breathing</li><li>circulation</li><li>time of stroke onset</li></ul>',
    summary: 'If patient meets AHA stroke criteria, check ABCTs!',
    outcomes: [
      new Outcome({
        title: 'Stable',
        body: 'Proceed to GWNS algorithm',
        next: gwnsAlgorithm,
      }),
      new Outcome({
        title: 'Not Stable',
        body: 'Stabilize ABCTs before continuing!',
      }),
    ],
  });

  return new TextAlgorithm({ info });
})();

export const algorithms = [gwnsAlgorithm, abctAlgorithm];
