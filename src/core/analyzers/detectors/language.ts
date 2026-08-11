import { DetectedTechnology } from '../../project/types';
import { DetectorContext } from './types';

export function detectLanguages(ctx: DetectorContext): DetectedTechnology[] {
  const languages: DetectedTechnology[] = [];

  // TypeScript
  if (ctx.files.has('tsconfig.json')) {
    languages.push({
      id: 'typescript',
      name: 'TypeScript',
      category: 'language',
      confidence: 'high',
      evidence: [{
        source: 'tsconfig.json',
        message: 'Found tsconfig.json in the repository root'
      }]
    });
  }

  // JavaScript (Infer from package.json)
  if (ctx.files.has('package.json')) {
    languages.push({
      id: 'javascript',
      name: 'JavaScript',
      category: 'language',
      confidence: 'high',
      evidence: [{
        source: 'package.json',
        message: 'Found package.json indicating a Node.js/JavaScript project'
      }]
    });
  }

  // Python
  if (ctx.files.has('requirements.txt') || ctx.files.has('pyproject.toml') || ctx.files.has('Pipfile')) {
    languages.push({
      id: 'python',
      name: 'Python',
      category: 'language',
      confidence: 'high',
      evidence: [{
        source: ctx.files.has('pyproject.toml') ? 'pyproject.toml' : (ctx.files.has('requirements.txt') ? 'requirements.txt' : 'Pipfile'),
        message: 'Found Python dependency manifest'
      }]
    });
  }

  return languages;
}
