import platformInstance, {
  useAxiosWithPlatformInterceptors as usePlatformAxios,
} from '@redhat-cloud-services/frontend-components-utilities/interceptors/interceptors';
import { foremanCsrfInterceptor } from '../Utilities/foremanCsrf';

export * from '@redhat-cloud-services/frontend-components-utilities/interceptors/interceptors';

const installed = new WeakSet();

export const iopRequestInterceptor = (config) => {
  // Generated insights-client endpoints contain absolute HCC API paths. Only
  // rewrite the known same-origin services, never a third-party request.
  const target = new URL(
    config.url || '',
    config.baseURL || window.location.origin,
  );
  if (
    target.origin === window.location.origin &&
    /^\/api\/(insights|inventory|remediations)\//.test(target.pathname)
  ) {
    config.url = `/insights_cloud${target.pathname}${target.search}`;
    config.baseURL = window.location.origin;
  }
  return foremanCsrfInterceptor(config);
};

const prepare = (instance) => {
  if (!installed.has(instance)) {
    instance.interceptors.request.use(iopRequestInterceptor);
    installed.add(instance);
  }
  return instance;
};

export const instance = prepare(platformInstance);
export const useAxiosWithPlatformInterceptors = () =>
  prepare(usePlatformAxios());
export default instance;
