import React from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import {Input, Button, Card} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';

export default class Login extends React.Component {
  state = {
    email: '',
    password: '',
    loading: false,
    emailErrorMsg: '',
    emailErrorColor: 'red',
    fieldPwdErrorMsg: '',
  };

  validate = text => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log('Email is Not Correct');
      this.setState({
        emailErrorMsg: 'Email form is Not Correct',
        emailErrorColor: 'red',
      });
      return false;
    } else {
      this.setState({
        emailErrorMsg: 'Email form is Correct',
        emailErrorColor: 'green',
      });
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

  /*-----驗證資料填寫------*/
  checkField(data) {
    if (!data.userName) {
      this.setState({
        emailErrorMsg: 'Please fill in your email',
      });
      return false;
    } else {
      this.setState({
        emailErrorMsg: '',
      });
    }
    if (!data.password) {
      this.setState({
        fieldPwdErrorMsg: 'Please fill in your password',
      });
      return false;
    } else {
      this.setState({
        fieldPwdErrorMsg: '',
      });
    }
    return true;
  }

  /*------撈API資料------*/
  async goLogin() {
    this.setState({
      loading: true,
    });
    let data = {
      userName: this.state.email,
      password: this.state.password,
    };

    if (!this.checkField(data)) {
      this.setState({
        loading: false,
      });
      return;
    }

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
        Alert.alert(
          'Login fail',
          '',
          [
            {
              text: 'Confirm',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      } else {
        (async function() {
          try {
            await AsyncStorage.setItem('userData', resJson);
            Actions.tabbar();
            // Actions.replace('tabbar');
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
      <LinearGradient
        colors={['#bd83ce', '#ff9068']}
        style={styles.container}
        start={{x: 1, y: 1}}
        end={{x: 1, y: 0}}>
        <Card
          title="Taiwan Find Activity"
          image={require('../assets/loginIcon4.png')}
          imageProps={{resizeMode: 'contain'}}
          containerStyle={{
            width: '95%',
            shadowColor: 'black',
            shadowOffset: {width: 5, height: 5},
            shadowOpacity: 0.2,
          }}>
          <Input
            placeholder="example@address.com"
            leftIcon={<Icon name="ios-mail" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            errorMessage={this.state.emailErrorMsg}
            errorStyle={{color: this.state.emailErrorColor}}
            onChangeText={value => {
              this.onChangeLoginEmail(value);
              this.validate(value);
            }}
            label="Your email address"
          />
          <View paddingVertical={10} />
          <Input
            placeholder="Password"
            leftIcon={<Icon name="ios-lock" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            errorMessage={this.state.fieldPwdErrorMsg}
            onChangeText={this.onChangeLoginPassword}
            label="Password"
            secureTextEntry={true}
          />
          <View paddingVertical={10} />
          <Button
            onPress={() => {
              this.goLogin();
            }}
            title="Login"
            titleStyle={{color: 'white'}}
            loading={this.state.loading}
            buttonStyle={{backgroundColor: '#ff9068'}}
          />
          <View paddingVertical={5} />
          <Text
            style={{alignSelf: 'center', color: '#CDD6DA'}}
            onPress={() => console.log('忘記密碼了ＱＱ')}>
            Forget Password ?
          </Text>
        </Card>

        <View paddingVertical={10} />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: '#e4e4e4', fontSize: 15, marginRight: 0}}>
            Don't have an account ？
          </Text>
          <Text
            onPress={() => {
              Actions.registered();
            }}
            style={{color: 'white', fontSize: 15}}>
            Sign up
          </Text>
        </View>
      </LinearGradient>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
