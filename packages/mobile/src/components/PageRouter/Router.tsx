import React from 'react';
import { Router as ReachRouter } from '@reach/router';

type RouterProps = {
  basePath:string
  style?:any
  defaultPath?:string
};

export const Router: React.FC<RouterProps> = (props) => {
  const { children, style, basePath, defaultPath } = props;
  const base = `/:language${basePath}`;


  return (
    <React.Fragment>
    
      <ReachRouter basepath={base}>
        {children}
      </ReachRouter>
    </React.Fragment>
  );
};
