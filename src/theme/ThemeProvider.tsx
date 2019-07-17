import React, { ReactNode } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import theme from '../theme/theme';

type Props = {
  children: ReactNode;
};

function ViewProvider(props: Props) {
  let { children } = props;
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}

export default ViewProvider;
