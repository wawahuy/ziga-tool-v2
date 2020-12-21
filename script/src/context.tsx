import React from 'react';

export interface IContext {
  setTimeRemaining?: (time: number | null) => void,
  setAuth?: (status: boolean) => void
}

const Context = React.createContext<IContext>({});

export const withContext = (Cmp: any) => (props: any) => {
  return (
    <Context.Consumer>
      {(p: IContext) => <Cmp {...props} setTimeRemaining={p?.setTimeRemaining} setAuth={p?.setAuth} />}
    </Context.Consumer>
  );
};

export default Context;
