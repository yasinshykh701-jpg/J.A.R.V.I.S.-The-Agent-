export interface IoTDevice {
  id?: string;
  name: string;
  status: string;
  transport?: string;
  endpoint?: string;
  type?: string;
}

const BASE_URL = import.meta.env.DEV
  ? '/iot'
  : (import.meta.env.VITE_IOT_API_URL ?? 'http://127.0.0.1:8010');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail || payload.error || `IoT request failed (${response.status})`);
  }
  return payload as T;
}

export function getIoTHealth(): Promise<{ status: string; service: string }> {
  return request('/health');
}

export function getDevices(): Promise<IoTDevice[]> {
  return request('/devices/');
}

export const iotApi = { getIoTHealth, getDevices };
