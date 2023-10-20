'use client';
import { store } from '@/features/store';
import { FC, ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

export interface IProvider {
  children: ReactNode;
}

const Provider: FC<IProvider> = ({ children }) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export default Provider;
