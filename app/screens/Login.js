import React from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class Login extends React.Component {
  state = {
    email: '',
  };
  onPress = () => {
    Actions.tabbar({user: '花的世界'});
  };
  validate = text => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log('Email is Not Correct');
      this.setState({email: text});
      return false;
    } else {
      this.setState({email: text});
      console.log('Email is Correct');
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome {this.props.title}</Text>
        <TextInput
          placeholder="Email"
          onChangeText={text => this.validate(text)}
          style={{
            width: 100,
            borderRadius: 1,
            borderColor: 'black',
            backgroundColor: '#ddd',
          }}
        />
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
