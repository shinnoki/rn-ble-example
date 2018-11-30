/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

type Props = {};
class DeviceListScreen extends Component<Props> {
  state = {
    device: {},
    characteristics: {},
    loading: false,
    message: '',
  };

  get device() {
    return this.props.navigation.getParam('device', {});
  }

  async componentDidMount() {
    try {
      let device = this.props.navigation.getParam('device', {});
      this.setState({
        device,
        loading: true,
        message: 'Connecting to device...',
      });
      device = await device.connect();

      this.setState({
        device,
        message: 'Discovering services and characteristics...',
      });
      device = await device.discoverAllServicesAndCharacteristics();
      this.setState({ device });

      this.setState({
        device,
        message: 'Reading characteristic values...',
      });
      for (let service of await device.services()) {
        for (let characteristic of await service.characteristics()) {
          if (characteristic.isReadable) {
            characteristic = await characteristic.read();
            const { uuid, value } = characteristic;
            this.setState({
              characteristics: {
                ...this.state.characteristics,
                [uuid]: new Buffer(value, 'base64').toString(),
              },
            });
          }
        }
      }
    } catch (err) {
      console.warn(err);
    } finally {
      this.setState({ loading: false, message: '' });
    }
  }

  async componentWillUnmount() {
    if (this.state.device.cancelConnection) {
      await this.state.device.cancelConnection();
    }
  }

  render() {
    const { device, characteristics, loading, message } = this.state;

    return (
      <View style={styles.container}>
        {!!loading && <ActivityIndicator />}
        {!!message && <Text>{message}</Text>}
        <Text style={styles.welcome}>{device.id}</Text>
        <Text style={styles.instructions}>{device.name}</Text>
        {Object.values(characteristics).map(value => (
          <Text>{value}</Text>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    fontSize: 24,
    color: '#0087ff',
  },
});

export default DeviceListScreen;
