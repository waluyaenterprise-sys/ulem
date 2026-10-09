import { PUBLIC_API_URL } from '$env/static/public';

const TOKEN_KEY = 'customer_token';

export function customerHeaders(): Record<string, string> {
  const token = typeof localStorage === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function customerLogin(accessCode: string) {
  const response = await fetch(`${PUBLIC_API_URL}/customer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessCode })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? 'Login gagal.');
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.invitation;
}

export function customerLogout() {
  localStorage.removeItem(TOKEN_KEY);
}
