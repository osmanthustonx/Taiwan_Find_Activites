import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Router, Stack, Scene} from 'react-native-router-flux';
import Home from '../screens/Home';
import About from '../screens/About';

export default class Routes extends Component {
  render() {
    return (
      <Router>
        <Stack key="root">
          <Scene key="home" component={Home} title="Home" />
          <Scene key="about" component={About} title="About" user="test" />
        </Stack>
      </Router>
    );
  }
}
