'use client';

import {
  QueryClientProvider as Provider,
  QueryClient,
} from '@tanstack/react-query';
import { ReactNode } from 'react';

type Props = { children: ReactNode };

const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: Props) => {
  return <Provider client={queryClient}>{children}</Provider>;
};

export default QueryClientProvider;
