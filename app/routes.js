import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Router, Stack, Scene} from 'react-native-router-flux';

import Tabs from './routes/Tabs';

export default class Routes extends Component {
  render() {
    return <Tabs />;
  }
}
