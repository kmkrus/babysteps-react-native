import React from 'react';
import { registerRootComponent, Logs } from 'expo';

import useKeepAwake from 'expo-keep-awake';

if (__DEV__) {
  //https://github.com/expo/expo/issues/2623
  const isRemoteDebuggingEnabled = typeof atob !== 'undefined';
  if (isRemoteDebuggingEnabled) {
    Logs.disableExpoCliLogging();
  } else {
    Logs.enableExpoCliLogging();
  }
  useKeepAwake();
  const AppEntry = () => {
    const App = require('./App').default;
    return <App />;
  };
  console.disableYellowBox = true;
  registerRootComponent(AppEntry);
} else {
  const App = require('./App').default;
  registerRootComponent(App);
}
