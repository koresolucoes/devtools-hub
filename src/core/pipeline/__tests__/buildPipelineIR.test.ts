import { describe, it, expect } from 'vitest';
import { buildPipelineIR } from '../buildPipelineIR';
import type { PipelineConfig } from '../types';

describe('buildPipelineIR', () => {
  it('builds a standard Node/Vercel pipeline correctly', () => {
    const config: PipelineConfig = {
      platform: 'github',
      language: 'node',
      packageManager: 'npm',
      runtimeStrategy: 'recommended',
      nodeVersion: '20.x',
      caching: true,
      linting: true,
      testing: true,
      containerize: false,
      deploy: 'vercel'
    };

    const ir = buildPipelineIR(config);
    expect(ir.steps.find(s => s.id === 'checkout')).toBeDefined();
    expect(ir.steps.find(s => s.id === 'setup-node')).toBeDefined();
    expect(ir.steps.find(s => s.id === 'install-deps')).toBeDefined();
    expect(ir.steps.find(s => s.id === 'lint')).toBeDefined();
    expect(ir.steps.find(s => s.id === 'test')).toBeDefined();
    expect(ir.steps.find(s => s.id === 'deploy-vercel')).toBeDefined();
    
    const nodeSetup = ir.steps.find(s => s.id === 'setup-node');
    expect(nodeSetup?.with?.cache).toBe('npm');
  });

  it('builds a Python/uv Docker pipeline correctly', () => {
    const config: PipelineConfig = {
      platform: 'github',
      language: 'python',
      packageManager: 'uv',
      pythonVersion: '3.12',
      containerize: true,
      dockerRegistry: 'ghcr',
      deploy: 'none'
    };

    const ir = buildPipelineIR(config);
    expect(ir.steps.find(s => s.id === 'setup-python')).toBeDefined();
    expect(ir.steps.find(s => s.id === 'setup-uv')).toBeDefined();
    expect(ir.steps.find(s => s.id === 'install-deps')?.run).toBe('uv sync');
    
    // Docker steps
    expect(ir.steps.find(s => s.id === 'setup-buildx')).toBeDefined();
    expect(ir.steps.find(s => s.id === 'docker-login')).toBeDefined();
    expect(ir.steps.find(s => s.id === 'docker-build')).toBeDefined();
    
    // Permissions for GHCR
    expect(ir.permissions.packages).toBe('write');
  });
});
