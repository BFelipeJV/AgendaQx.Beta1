export const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || 'secret-token';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Request failed');
  }
  return res.json();
}

export function getUsers() {
  return request<any[]>('/api/users');
}

export function createUser(data: any) {
  return request('/api/users', { method: 'POST', body: JSON.stringify(data) });
}

export function deleteUser(id: string) {
  return request(`/api/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function getSurgeries() {
  return request<any[]>('/api/surgeries');
}

export function createSurgery(data: any) {
  return request('/api/surgeries', { method: 'POST', body: JSON.stringify(data) });
}
