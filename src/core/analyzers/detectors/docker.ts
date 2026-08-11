import { DockerInfo } from '../../project/types';
import { DetectorContext } from './types';

export function detectDocker(ctx: DetectorContext): DockerInfo | undefined {
  const hasDockerfile = Array.from(ctx.files.keys()).some(k => k.startsWith('Dockerfile'));
  const hasCompose = ctx.files.has('docker-compose.yml') || ctx.files.has('docker-compose.yaml') || ctx.files.has('compose.yml') || ctx.files.has('compose.yaml');

  if (!hasDockerfile && !hasCompose) {
    return undefined;
  }

  const info: DockerInfo = {
    hasDockerfile,
    hasCompose,
    images: [],
    exposedPorts: []
  };

  const dockerfile = ctx.files.get('Dockerfile');
  if (dockerfile?.content) {
    const lines = dockerfile.content.split('\n');
    let fromCount = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('FROM ')) {
        fromCount++;
        const parts = trimmed.split(' ');
        if (parts[1]) {
          info.images.push(parts[1]);
        }
      } else if (trimmed.startsWith('EXPOSE ')) {
        const ports = trimmed.replace('EXPOSE', '').trim().split(' ').map(p => parseInt(p)).filter(p => !isNaN(p));
        if (ports.length > 0) {
          info.exposedPorts = (info.exposedPorts || []).concat(ports);
        }
      } else if (trimmed.startsWith('HEALTHCHECK ')) {
        info.hasHealthcheck = true;
      }
    }
    info.isMultiStage = fromCount > 1;
  }

  return info;
}
