import React from 'react';
import renderer from 'react-test-renderer';
import { factory as AppFactory } from '@/view/App';

describe('<App />', () => {
  it('has 1 child', () => {
    const App = AppFactory('hi');
    const tree: any = renderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(2);
  });
});
