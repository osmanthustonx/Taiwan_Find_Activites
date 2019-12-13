import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import {Input, Button, Card, Image} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends React.Component {
  state = {
    email: '',
    password: '',
    loading: false,
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
  async goLogin() {
    this.setState({
      loading: true,
    });
    let data = {
      userName: this.state.email,
      password: this.state.password,
    };
    let opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      let res = await fetch('https://tfa.rocket-coding.com/Member/Login', opts);
      let resJson = await res.text();
      if (resJson === '登入失敗') {
        this.setState({
          loading: false,
        });
      } else {
        (async function() {
          try {
            await AsyncStorage.setItem('userData', resJson);
            Actions.tabbar();
          } catch (e) {
            console.log(e);
          }
        })();
        this.setState({
          loading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Card
          image={require('../assets/loginIcon2.png')}
          imageProps={{resizeMode: 'contain'}}
          containerStyle={{
            width: '95%',
            height: '60%',
            shadowColor: '#D8D2D3',
            shadowOffset: {width: 2, height: 2},
          }}>
          <Input
            placeholder="example@address.com"
            leftIcon={<Icon name="ios-mail" size={24} color="black" />}
            leftIconContainerStyle={{paddingRight: 10}}
            // errorStyle={{color: 'red'}}
            // errorMessage="ENTER A VALID ERROR HERE"
            onChangeText={this.onChangeLoginEmail}
            label="Your email address"
          />
          <View paddingVertical={10} />
          <Input
            placeholder="Password"
            leftIcon={<Icon name="ios-lock" size={24} color="black" />}
            leftIconContainerStyle={{paddingRight: 10}}
            // errorStyle={{color: 'red'}}
            // errorMessage="ENTER A VALID ERROR HERE"
            onChangeText={this.onChangeLoginPassword}
            label="Password"
            secureTextEntry={true}
          />
          <View paddingVertical={10} />
          <Button
            onPress={() => {
              this.goLogin();
            }}
            title="登入"
            type="outline"
            loading={this.state.loading}
            // loading={this.state.loading}
          />
          <View paddingVertical={5} />
          <Text
            style={{alignSelf: 'center', color: '#CDD6DA'}}
            onPress={() => console.log('忘記密碼了ＱＱ')}>
            忘記密碼
          </Text>
        </Card>

        <View paddingVertical={10} />

        <Button
          onPress={() => {
            Actions.registered();
          }}
          title="註冊"
          type="clear"
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
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
