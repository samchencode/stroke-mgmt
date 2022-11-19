import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { defaults } from 'ts-jest/presets';
import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
  ...defaults,
  preset: 'jest-expo',
  verbose: true,
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        isolatedModules: true,
        babelConfig: true,
      },
    ],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist'],
};

export default config;
