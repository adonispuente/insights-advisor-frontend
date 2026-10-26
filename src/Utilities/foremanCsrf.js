import axios from 'axios';

const getCsrfToken = () => {
  const localToken = document.querySelector('meta[name="csrf-token"]')?.content;
  if (localToken) return localToken;

  // The standalone iframe has no Rails-generated meta tag. Read the current
  // session token from its same-origin Foreman parent, including after rotation.
  try {
    if (
      window.parent !== window &&
      window.parent.location.origin === window.location.origin
    ) {
      return window.parent.document.querySelector('meta[name="csrf-token"]')
        ?.content;
    }
  } catch {
    // Cross-origin embeds cannot access Foreman's session context.
  }

  return undefined;
};

export const foremanCsrfInterceptor = (config) => {
  if (
    typeof window === 'undefined' ||
    !['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())
  ) {
    return config;
  }

  const target = new URL(axios.getUri(config), window.location.href);
  if (
    target.origin !== window.location.origin ||
    !target.pathname.startsWith('/insights_cloud/api/')
  ) {
    return config;
  }

  const token = getCsrfToken();
  if (token) {
    config.headers ||= {};
    config.headers['X-CSRF-Token'] = token;
  }

  return config;
};
