import React from 'react';
import {View, StyleSheet, Text, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import {Input, Button} from 'react-native-elements';

export default class Login extends React.Component {
  state = {
    email: '',
    password: '',
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

  // 登入信箱Input
  onChangeLoginEmail = email => {
    this.setState({
      email,
    });
  };

  // 登入密碼Input
  onChangeLoginPassword = password => {
    this.setState({
      password,
    });
  };

  /*------撈API資料------*/
  goLogin = () => {
    let data = JSON.stringify({
      userName: this.state.email,
      password: this.state.password,
    });
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', async function() {
      if (this.readyState === 4) {
        if (this.responseText !== '登入失敗') {
          let Id = await AsyncStorage.setItem(
            'userID',
            JSON.stringify(JSON.parse(this.responseText)[0].Id),
          );
          if (Id != null) {
            console.log('好了');
            Actions.tabbar();
          }
        } else {
          console.log(this.responseText);
        }
      }
    });
    xhr.open('POST', 'https://tfa.rocket-coding.com/Member/Login');
    xhr.setRequestHeader('Content-Type', 'application/json,application/json');
    xhr.send(data);
  };

  test() {
    let data = {
      userName: this.state.email,
      password: this.state.password,
    };
    console.log(data);
  }

  render() {
    return (
      <View style={styles.container}>
        <Input
          placeholder="請輸入電子信箱"
          leftIcon={<Icon name="ios-mail" size={24} color="black" />}
          leftIconContainerStyle={{paddingRight: 10}}
          // errorStyle={{color: 'red'}}
          // errorMessage="ENTER A VALID ERROR HERE"
          onChangeText={this.onChangeLoginEmail}
        />
        <Input
          placeholder="請輸入密碼"
          leftIcon={<Icon name="ios-lock" size={24} color="black" />}
          leftIconContainerStyle={{paddingRight: 10}}
          // errorStyle={{color: 'red'}}
          // errorMessage="ENTER A VALID ERROR HERE"
          onChangeText={this.onChangeLoginPassword}
          secureTextEntry={true}
        />
        <View paddingVertical={10} />
        <Button onPress={this.goLogin} title="登入" type="outline" />
        <Button title="註冊" type="clear" />
        <Text onPress={() => console.log('忘記密碼了ＱＱ')}>忘記密碼</Text>
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
