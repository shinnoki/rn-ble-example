/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import Icon from 'react-native-vector-icons/Ionicons';
import PlayButton from '../components/PlayButton';
import DeviceListItem from '../components/DeviceListItem';

type Props = {};
class DeviceListScreen extends Component<Props> {
  state = {
    initialScan: false,
    scanning: false,
    bleState: 'Unknown',
    devices: {},
  };

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <PlayButton
        playing={navigation.getParam('scanning')}
        onStart={navigation.getParam('scanStart')}
        onStop={navigation.getParam('scanStop')}
      />
    ),
  });

  constructor() {
    super();
    this.manager = new BleManager();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      scanStart: this.scanStart,
      scanStop: this.scanStop,
    });

    this.manager.onStateChange(bleState => {
      this.setState({ bleState });
      if (!this.state.initialScan && bleState === 'PoweredOn') {
        // this.setState({ initialScan: true });
        // this.scanStart();
      }
    });
  }

  scanStart = () => {
    this.setState({ devices: {}, scanning: true });
    this.props.navigation.setParams({ scanning: true });
    this.manager.startDeviceScan(null, null, this.onDeviceScanned);
  };

  scanStop = () => {
    this.manager.stopDeviceScan();
    this.setState({ scanning: false });
    this.props.navigation.setParams({ scanning: false });
  };

  onDeviceScanned = (err, device) => {
    if (err) {
      console.error(err);
      return;
    }

    this.setState({
      initialized: true,
      devices: {
        ...this.state.devices,
        [device.id]: device,
      },
    });
  };

  onPressItem = item => {
    this.props.navigation.navigate('DeviceDetail', { device: item });
  };

  renderItem = ({ item, index }) => (
    <DeviceListItem item={item} onPress={() => this.onPressItem(item)} />
  );

  render() {
    const data = Object.values(this.state.devices);
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
          ItemSeparatorComponent={() => (
            <View
              style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
              }}
            />
          )}
        />
        <Text style={styles.bleState}>BLE State: {this.state.bleState}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  bleState: {
    position: 'absolute',
    top: 5,
    right: 5,
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
