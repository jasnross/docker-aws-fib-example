import React from 'react';

import { Link } from 'react-router-dom';

export const OtherPage: React.FunctionComponent = () => (
  <div>
    I'm some other page!
    <Link to="/">Go back home</Link>
  </div>
);
