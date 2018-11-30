/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createStackNavigator, createAppContainer } from 'react-navigation';

import { DeviceListScreen, DeviceDetailScreen } from './screens';

const stackNavigator = createStackNavigator({
  DeviceList: { screen: DeviceListScreen },
  DeviceDetail: { screen: DeviceDetailScreen },
});

export default createAppContainer(stackNavigator);
