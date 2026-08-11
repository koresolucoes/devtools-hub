export interface AIModel {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'Meta';
  tokenizer: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  contextWindow: number;
  currency: 'USD';
  verifiedAt: string | null;
  source?: string;
  status: 'verified' | 'unverified' | 'deprecated';
}

export const MODEL_REGISTRY: Record<string, AIModel> = {
  gpt4o: {
    id: 'gpt-4o',
    name: 'GPT-4o (2026)',
    provider: 'OpenAI',
    tokenizer: 'cl100k_base',
    inputPricePerMillion: 2.50, // Updated 2026 pricing assumption
    outputPricePerMillion: 10.00,
    contextWindow: 128000,
    currency: 'USD',
    verifiedAt: null,
    status: 'unverified',
    source: 'https://openai.com/api/pricing/'
  },
  gpt4oMini: {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    tokenizer: 'cl100k_base',
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.60,
    contextWindow: 128000,
    currency: 'USD',
    verifiedAt: '2026-08-01',
    status: 'verified',
    source: 'https://openai.com/api/pricing/'
  },
  claude35Sonnet: {
    id: 'claude-3-5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tokenizer: 'claude',
    inputPricePerMillion: 3.00,
    outputPricePerMillion: 15.00,
    contextWindow: 200000,
    currency: 'USD',
    verifiedAt: '2026-08-01',
    status: 'verified',
    source: 'https://www.anthropic.com/pricing'
  },
  claude3Haiku: {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    tokenizer: 'claude',
    inputPricePerMillion: 0.25,
    outputPricePerMillion: 1.25,
    contextWindow: 200000,
    currency: 'USD',
    verifiedAt: '2026-08-01',
    status: 'verified',
    source: 'https://www.anthropic.com/pricing'
  }
};
