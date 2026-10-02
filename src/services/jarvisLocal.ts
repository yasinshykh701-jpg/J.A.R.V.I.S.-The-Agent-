const DEFAULT_BASE_URL = 'http://127.0.0.1:8000';

function getBaseUrl() {
  return import.meta.env.VITE_JARVIS_URL || DEFAULT_BASE_URL;
}

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message =
      (data && typeof data === 'object' && 'error' in data && String((data as { error?: string }).error)) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getHealth() {
  const response = await fetch(`${getBaseUrl()}/health`);
  if (!response.ok) {
    throw new Error('Unable to reach J.A.R.V.I.S. backend');
  }
  return response.json();
}

export async function askJarvis(message: string, username?: string, engine?: string) {
  return postJson<{
    response: string;
    source?: string;
    engine?: string;
    modules?: string[];
    modules_detail?: Record<string, boolean>;
    sources?: Array<Record<string, unknown>>;
    image_url?: string;
  }>('/chat', { message, username, engine: engine || 'unified' });
}

export async function getLLMEngines() {
  const response = await fetch(`${getBaseUrl()}/engines`);
  if (!response.ok) {
    throw new Error('Unable to fetch LLM engines');
  }
  return response.json();
}

export async function askRag(query: string) {
  const response = await fetch(`${getBaseUrl()}/rag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = (await response.json().catch(() => ({}))) as {
    success: boolean;
    response?: string;
    error?: string;
    sources?: Array<Record<string, unknown>>;
    source?: string;
    hint?: string;
  };
  if (!response.ok && !data.error) {
    throw new Error(`RAG request failed (${response.status})`);
  }
  return data;
}

export async function runVoiceCommand(command: string) {
  return postJson<{
    success: boolean;
    command?: string;
    result?: string;
    error?: string;
    source?: string;
  }>('/voice', { command });
}

export async function generateJarvisImage(prompt: string) {
  return postJson<Record<string, unknown>>('/image', { prompt, self_train: '1' });
}

export async function generateJarvisVideo(prompt: string, duration: string | number = 5) {
  const response = await fetch(`${getBaseUrl()}/media/video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, duration: String(duration) }),
  });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok && !data.error && !data.success) {
    throw new Error(`Video request failed (${response.status})`);
  }
  return data;
}

export async function getSelfTrainStatus() {
  const response = await fetch(`${getBaseUrl()}/media/train-status`);
  if (!response.ok) {
    throw new Error('Unable to load self-train status');
  }
  return response.json();
}
