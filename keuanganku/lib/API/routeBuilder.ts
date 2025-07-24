const API_BASE_URL = 'http://localhost:8080/api';
export const SECURE_BASE = `${API_BASE_URL}/secure`;

/**
 * Builder function untuk endpoint yang diawali dengan `/secure/{prefix}/...`
 * Contoh: makeSecureRoute('transaksi')('filter') => /secure/transaksi/filter
 */
export const makeSecureRoute = (prefix: string) => (path = ''): string =>
  `${SECURE_BASE}/${prefix}${path ? `/${path}` : ''}`;
