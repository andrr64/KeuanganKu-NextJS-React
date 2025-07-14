import { API_ROUTES } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';

export async function login(email: string, password: string) {
  return fetcher(API_ROUTES.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(nama: string, email: string, password: string) {
  return fetcher(API_ROUTES.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify({ nama, email, password }),
  });
}

export async function logout() {
  return fetcher(API_ROUTES.AUTH.LOGOUT, {
    method: 'POST'
  });
}
