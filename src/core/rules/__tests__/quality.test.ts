import { describe, it, expect } from 'vitest';
import { QUALITY001, QUALITY002 } from '../quality';
import { createEmptyProjectIR } from '../../project/createProjectIR';
import type { ProjectIR, RepositoryContext } from '../../project/types';

describe('Quality Rules', () => {
  const dummyRepo: RepositoryContext = { provider: 'local', owner: 'test', repo: 'test', defaultBranch: 'main', url: '' };

  describe('QUALITY001 (Missing Tests)', () => {
    it('returns finding when node project has no tests', () => {
      const ir: ProjectIR = createEmptyProjectIR(dummyRepo);
      ir.primaryLanguage = 'node';
      ir.hasTests = false;

      const finding = QUALITY001.evaluate(ir);
      expect(finding).not.toBeNull();
      expect(finding?.ruleId).toBe('QUALITY001');
    });

    it('returns null when node project has tests', () => {
      const ir: ProjectIR = createEmptyProjectIR(dummyRepo);
      ir.primaryLanguage = 'node';
      ir.hasTests = true;

      const finding = QUALITY001.evaluate(ir);
      expect(finding).toBeNull();
    });
  });

  describe('QUALITY002 (Missing Linting)', () => {
    it('returns finding when python project has no linting', () => {
      const ir: ProjectIR = createEmptyProjectIR(dummyRepo);
      ir.primaryLanguage = 'python';
      ir.hasLinting = false;

      const finding = QUALITY002.evaluate(ir);
      expect(finding).not.toBeNull();
      expect(finding?.severity).toBe('moderate');
    });

    it('returns null when project has linting', () => {
      const ir: ProjectIR = createEmptyProjectIR(dummyRepo);
      ir.primaryLanguage = 'python';
      ir.hasLinting = true;

      const finding = QUALITY002.evaluate(ir);
      expect(finding).toBeNull();
    });
  });
});
