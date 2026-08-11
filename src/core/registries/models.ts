export const MODEL_REGISTRY = {
  gpt4o: {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    tokenizer: 'cl100k_base',
    inputPricePerMillion: 5.00,
    outputPricePerMillion: 15.00,
    contextWindow: 128000,
    currency: 'USD',
    verifiedAt: '2024-05-13'
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
    verifiedAt: '2024-07-18'
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
    verifiedAt: '2024-06-20'
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
    verifiedAt: '2024-03-07'
  }
};
