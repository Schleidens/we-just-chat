import { auth } from '../firebase/main';

export type ApiFetchContentType = 'json' | 'text' | 'blob';

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  contentType: ApiFetchContentType = 'json'
) {
  const token = await auth.currentUser?.getIdToken();
  const defaultOptions: RequestInit = {
    headers: {
      authorization: 'Bearer ' + token,
    },
  };

  options = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const result = await fetch(
    `${import.meta.env.VITE_API_URL}/${path}`,
    options
  );
  if (
    result.status.toString().startsWith('4') ||
    result.status.toString().startsWith('5')
  ) {
    throw new Error(result.statusText);
  }

  const data = await result[contentType]?.();

  return data;
}
