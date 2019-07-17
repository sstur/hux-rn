import React, { useState, useEffect, ReactNode, Fragment } from 'react';
import * as Font from 'expo-font';

import fonts from '../theme/fonts';

type Props = {
  children: ReactNode;
};

function FontLoader(props: Props) {
  let [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    Font.loadAsync(fonts).then(() => setLoaded(true));
  }, []);
  return isLoaded ? <Fragment>{props.children}</Fragment> : null;
}

export default FontLoader;
