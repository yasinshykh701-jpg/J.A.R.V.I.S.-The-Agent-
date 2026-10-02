const DEFAULT_BASE_URL = 'http://127.0.0.1:8000';
const LOCAL_USERS_STORAGE_KEY = 'JARVIS-local-users';
const LOCAL_SESSION_STORAGE_KEY = 'JARVIS-local-session';

export interface SQLiteAuthResult {
  success: boolean;
  error?: string;
  username?: string;
}

interface StoredUserRecord {
  username: string;
  passwordHash: string;
  createdAt: string;
}

function getBaseUrl() {
  return import.meta.env.VITE_SQLITE_AUTH_URL || DEFAULT_BASE_URL;
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function getStorage() {
  return typeof window !== 'undefined' ? window.localStorage : undefined;
}

function readStoredUsers(): StoredUserRecord[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const stored = storage.getItem(LOCAL_USERS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredUserRecord[]) : [];
  } catch {
    return [];
  }
}

function writeStoredUsers(users: StoredUserRecord[]) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(users));
}

function readStoredSession() {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const stored = storage.getItem(LOCAL_SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function writeStoredSession(username: string) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(LOCAL_SESSION_STORAGE_KEY, JSON.stringify({ username }));
}

export function clearStoredSession() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(LOCAL_SESSION_STORAGE_KEY);
}

export function getStoredLocalSession() {
  return readStoredSession();
}

async function hashPassword(password: string) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const data = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  return password;
}

function isNetworkFailure(errorMessage: string) {
  return /failed to fetch|networkerror|fetch resource|aborted|econnrefused|timed out|socket hang up/i.test(errorMessage);
}

async function request(path: string, body: Record<string, string>): Promise<SQLiteAuthResult> {
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1500);
    const response = await fetch(`${getBaseUrl()}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    window.clearTimeout(timeout);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Authentication failed',
      };
    }

    return {
      success: true,
      username: data.username,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication service unavailable';
    return {
      success: false,
      error: message,
    };
  }
}

async function createLocalUser(username: string, password: string): Promise<SQLiteAuthResult> {
  const normalizedUsername = normalizeUsername(username);
  const users = readStoredUsers();

  if (!normalizedUsername || password.length < 6) {
    return { success: false, error: 'Username and password must be provided' };
  }

  if (users.some((user) => user.username === normalizedUsername)) {
    return { success: false, error: 'User already exists' };
  }

  const passwordHash = await hashPassword(password);
  users.push({
    username: normalizedUsername,
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  writeStoredUsers(users);
  writeStoredSession(normalizedUsername);

  return {
    success: true,
    username: normalizedUsername,
  };
}

async function authenticateLocalUser(username: string, password: string): Promise<SQLiteAuthResult> {
  const normalizedUsername = normalizeUsername(username);
  const users = readStoredUsers();
  const existingUser = users.find((user) => user.username === normalizedUsername);

  if (!existingUser) {
    return { success: false, error: 'Invalid credentials' };
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== existingUser.passwordHash) {
    return { success: false, error: 'Invalid credentials' };
  }

  writeStoredSession(normalizedUsername);

  return {
    success: true,
    username: normalizedUsername,
  };
}

export async function signUpWithSQLite(username: string, password: string) {
  const backendResult = await request('/signup', { username: normalizeUsername(username), password });

  if (backendResult.success) {
    writeStoredSession(normalizeUsername(username));
    return backendResult;
  }

  if (backendResult.error && isNetworkFailure(backendResult.error)) {
    return createLocalUser(username, password);
  }

  return backendResult;
}

export async function signInWithSQLite(username: string, password: string) {
  const backendResult = await request('/login', { username: normalizeUsername(username), password });

  if (backendResult.success) {
    writeStoredSession(normalizeUsername(username));
    return backendResult;
  }

  if (backendResult.error && isNetworkFailure(backendResult.error)) {
    return authenticateLocalUser(username, password);
  }

  return backendResult;
}
