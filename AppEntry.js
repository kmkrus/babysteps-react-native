import React from 'react';
import { KeepAwake, registerRootComponent, Logs } from 'expo';

if (__DEV__) {
  //https://github.com/expo/expo/issues/2623
  const isRemoteDebuggingEnabled = typeof atob !== 'undefined';
  if (isRemoteDebuggingEnabled) {
    Logs.disableExpoCliLogging();
  } else {
    Logs.enableExpoCliLogging();
  }
  KeepAwake.activate();
  const AppEntry = () => {
    const App = require('./App').default;
    return <App />;
  };
  console.disableYellowBox = true;
  registerRootComponent(AppEntry);
} else {
  const App = require('./App').default;
  registerRootComponent(App);
};
