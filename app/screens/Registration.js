import React from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import {Input, Button} from 'react-native-elements';

export default class Login extends React.Component {
  state = {
    email: '',
  };
  onPress = () => {
    Actions.registered({user: '花的世界'});
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
        {/* <Input placeholder="BASIC INPUT" /> */}
        <Input
          placeholder="請輸入電子信箱"
          leftIcon={<Icon name="ios-mail" size={24} color="black" />}
          leftIconContainerStyle={{paddingRight: 10}}
          errorStyle={{color: 'red'}}
          errorMessage="ENTER A VALID ERROR HERE"
        />
        <Input
          placeholder="請輸入密碼"
          leftIcon={<Icon name="ios-lock" size={24} color="black" />}
          leftIconContainerStyle={{paddingRight: 10}}
          errorStyle={{color: 'red'}}
          errorMessage="ENTER A VALID ERROR HERE"
        />
        {/* <Input
          placeholder="INPUT WITH ERROR MESSAGE"
          errorStyle={{color: 'red'}}
          errorMessage="ENTER A VALID ERROR HERE"
        /> */}
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
