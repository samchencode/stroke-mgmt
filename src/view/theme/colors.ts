export const colors = {
  primary: '#478e3e',
  onPrimary: '#ffffff',
  primaryContainer: '#deefdc',
  onPrimaryContainer: '#122310',
  secondary: '#3c7590',
  onSecondary: '#ffffff',
  secondaryContainer: '#dbe9f0',
  onSecondaryContainer: '#0f1d24',
  background: '#fafafa',
  onBackground: '#1a1a1a',
  surface: '#fafafa',
  onSurface: '#1a1a1a',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5f5f5',
  surfaceContainer: '#f0f0f0',
  surfaceContainerHigh: '#ebebeb',
  surfaceContainerHighest: '#e6e6e6',
  surfaceVariant: '#eeeeee',
  onSurfaceVariant: '#495049',
  inverseSurface: '#111111',
  inverseOnSurface: '#eeeeee',
  inversePrimary: '#eeeeee',
  outline: '#798679',
  outlineVariable: '#c9cfc9',
  error: '#cb0e01',
  onError: '#ffffff',
  errorContainer: '#ffd0cc',
  onErrorContainer: '#330400',
  opacity: (opacity: number) => ({
    onSurface: `rgba(26, 26, 26, ${opacity})`,
    onPrimaryContainer: `rgba(18, 35, 16, ${opacity})`,
  }),
} as const;
