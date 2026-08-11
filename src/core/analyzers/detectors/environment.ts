import { EnvironmentVariable } from '../../project/types';
import { DetectorContext } from './types';

export function detectEnvironmentVariables(ctx: DetectorContext): { declaredVariables: EnvironmentVariable[], sourceFiles: string[] } {
  const declaredVariables: EnvironmentVariable[] = [];
  const sourceFiles: string[] = [];

  const envFiles = ['.env.example', '.env.template', '.env.sample'];

  for (const filename of envFiles) {
    const file = ctx.files.get(filename);
    if (file?.content) {
      sourceFiles.push(filename);
      const lines = file.content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([^=]+)=/);
          if (match && match[1]) {
            const key = match[1].trim();
            // Don't add duplicates if present in multiple sample files
            if (!declaredVariables.find(v => v.key === key)) {
              declaredVariables.push({
                key,
                type: key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD') || key.includes('TOKEN') ? 'Secret' : 'Variable',
                scope: 'global'
              });
            }
          }
        }
      }
    }
  }

  return { declaredVariables, sourceFiles };
}
