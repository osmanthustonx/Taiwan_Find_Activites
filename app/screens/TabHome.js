import React from 'react';
import {View, Text, StyleSheet, Button, Platform} from 'react-native';
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

import DateTimePicker from '@react-native-community/datetimepicker';

export default class Home extends React.Component {
  /** For Drawer Sample
  componentDidMount() {
    Actions.drawerOpen();
  }
  */

  state = {
    date: new Date(),
    mode: 'date',
    show: false,
  };

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
  };

  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  };

  unShow = mode => {
    this.setState({
      show: false,
      mode,
    });
  };

  datepicker = () => {
    this.show('date');
  };

  timepicker = () => {
    this.show('time');
  };

  onPress = () => {
    Actions[this.props.keyPrefix + '_about']({
      user: 'dmoon',
    });
  };

  render() {
    const {show, date, mode} = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome {this.props.title}</Text>
        <Button onPress={this.onPress} title="Go to About" />
        <Button title="Back" onPress={Actions.pop} />

        <View style={{width: '100%'}}>
          <View>
            <Button onPress={this.datepicker} title="Show date picker!" />
          </View>
          <View>
            <Button onPress={this.timepicker} title="Show time picker!" />
          </View>
          {show && (
            <DateTimePicker
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={this.setDate}
            />
          )}
          <Button title={'確定'} onPress={this.unShow} />
        </View>
      </View>
    );
  }
}
