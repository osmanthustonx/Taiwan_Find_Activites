import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';

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

export default class Home extends React.Component {
  /** For Drawer Sample
  componentDidMount() {
    Actions.drawerOpen();
  }
  */

  onPress = () => {
    Actions[this.props.keyPrefix + '_about']({
      user: 'dmoon',
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome {this.props.title}</Text>
        <Button onPress={this.onPress} title="Go to About" />
        <Button title="Back" onPress={Actions.pop} />
      </View>
    );
  }
}
