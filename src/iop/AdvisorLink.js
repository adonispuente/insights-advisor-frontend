import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const normalizeTo = (to) => {
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

const AdvisorLink = ({ to, children, ...props }) => (
  <Link to={normalizeTo(to)} {...props}>
    {children}
  </Link>
);

AdvisorLink.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.node,
};

export default AdvisorLink;
