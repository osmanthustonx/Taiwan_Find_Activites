import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class Activity extends React.Component {
  onPress = () => {
    Actions.activityInfo({user: '花的世界'});
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome {this.props.title}</Text>
        <Button onPress={this.onPress} title="Go to About" />
      </View>
    );
  }
}

var styles = StyleSheet.create({
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
});
