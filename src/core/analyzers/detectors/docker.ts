import { DockerInfo } from '../../project/types';
import { DetectorContext } from './types';

export function detectDocker(ctx: DetectorContext): DockerInfo | undefined {
  const hasDockerfile = Array.from(ctx.files.keys()).some(k => k.startsWith('Dockerfile'));
  const hasCompose = ctx.files.has('docker-compose.yml') || ctx.files.has('docker-compose.yaml') || ctx.files.has('compose.yml') || ctx.files.has('compose.yaml');

  if (!hasDockerfile && !hasCompose) {
    return undefined;
  }

  // Very naive image extraction
  const images: string[] = [];
  const dockerfile = ctx.files.get('Dockerfile');
  if (dockerfile?.content) {
    const lines = dockerfile.content.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('FROM ')) {
        const parts = line.trim().split(' ');
        if (parts[1]) {
          images.push(parts[1]);
        }
      }
    }
  }

  return {
    hasDockerfile,
    hasCompose,
    images
  };
}
