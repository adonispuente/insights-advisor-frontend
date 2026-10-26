import { useNavigate } from 'react-router-dom';

const normalizePath = (to) => {
  if (typeof to === 'string') {
    return to.startsWith('/') ? to : `/${to}`;
  }

  if (to?.pathname) {
    const pathname = to.pathname.startsWith('/')
      ? to.pathname
      : `/${to.pathname}`;
    return { ...to, pathname };
  }

  return to;
};

const useAdvisorNavigate = () => {
  const navigate = useNavigate();

  return (to, options) =>
    navigate(typeof to === 'number' ? to : normalizePath(to), options);
};

export default useAdvisorNavigate;
export { useAdvisorNavigate };
