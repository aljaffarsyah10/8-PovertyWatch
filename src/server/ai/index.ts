import { AIProvider } from "./provider.interface";
import { MockAIProvider } from "./mock-ai.provider";
import { OpenAICompatibleProvider } from "./openai.provider";

let providerInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL;
  const model = process.env.OPENAI_MODEL;
  const configuredProvider = process.env.AI_PROVIDER;

  if (configuredProvider === "openai" && apiKey) {
    providerInstance = new OpenAICompatibleProvider(apiKey, baseUrl, model);
  } else {
    // Default reliable rule-based mock provider (offline / test safe)
    providerInstance = new MockAIProvider();
  }

  return providerInstance;
}

export * from "./provider.interface";
export * from "./mock-ai.provider";
export * from "./openai.provider";

