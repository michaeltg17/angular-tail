export const themeColors = [
  'red',
  'green',
  'blue',
  'yellow',
  'cyan',
  'magenta',
  'orange',
  'chartreuse',
  'spring-green',
  'azure',
  'violet',
  'rose',
] as const;

export type ThemeColor = typeof themeColors[number];

export interface Theme {
  type: 'light' | 'dark';
  color: ThemeColor;
}