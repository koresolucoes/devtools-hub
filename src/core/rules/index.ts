import { QUALITY001, QUALITY002 } from './quality';
import { CI001, CI002 } from './ci';
import { BUILD001 } from './build';
import type { Rule } from './types';

export * from './types';

export const RULE_PACK: Rule[] = [
  QUALITY001,
  QUALITY002,
  CI001,
  CI002,
  BUILD001
];
