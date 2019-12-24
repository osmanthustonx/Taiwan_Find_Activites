import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import {Input, Button, Card} from 'react-native-elements';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

export default class Login extends React.Component {
  state = {
    value: null,
    show: false,
    name: '',
    email: '',
    birth: new Date(),
    gender: -1,
    password: '',
    loading: false,
    RadioBtnColor: '#ffe8d6',
    birthBtnBorder: 'white',
    displayBirthDay: 'Your Birth Day',
    emailErrorMsg: '',
    emailErrorColor: '#ffffff',
    fieldNameErrorMsg: '',
    fieldNameErrorColor: '#ffffff',
    fieldPwdErrorMsg: '',
    fieldPwdErrorColor: '#ffffff',
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

  /*------input資料處理------*/

  //name
  onChangeName = name => {
    this.setState({
      name,
    });
  };

  //gender
  radio_props = [{label: 'Female', value: 0}, {label: 'Male', value: 1}]; //列舉
  onPressGender = gender => {
    this.setState({
      gender,
    });
  };

  //birth
  datepicker = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  //一定要有這個event參數，不知為何
  onChangeBirth = (event, birth) => {
    birth = birth || this.state.birth;
    this.setState({
      birth,
      displayBirthDay: moment(birth).format('ll'),
    });
  };

  // email
  onChangeEmail = email => {
    this.setState({
      email,
    });
  };

  //password
  onChangePassword = password => {
    this.setState({
      password,
    });
  };

  /*------驗證信箱------*/
  async checkEmail() {
    let data = {
      Mail: this.state.email,
    };

    if (!data.Mail) {
      this.setState({
        emailErrorMsg: 'Please fill in email',
        emailErrorColor: 'red',
      });
      return;
    } else {
      this.setState({
        emailErrorMsg: '',
        emailErrorColor: 'white',
      });
    }

    let opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      let res = await fetch(
        'https://tfa.rocket-coding.com/member/IsReMail',
        opts,
      );
      let resJson = await res.json();
      if (!resJson) {
        this.setState({
          emailErrorMsg: 'This email has been used',
          emailErrorColor: 'red',
        });
      } else {
        this.setState({
          emailErrorMsg: 'You can use it !',
          emailErrorColor: 'green',
        });
      }
    } catch (error) {}
  }

  /*------資料欄位填寫驗證------*/
  checkField(data) {
    if (!data.Name) {
      this.setState({
        fieldNameErrorMsg: 'Please fill in name',
        fieldNameErrorColor: 'red',
      });
      console.log('沒有名字');
      return false;
    }
    this.setState({
      fieldNameErrorMsg: '',
      fieldNameErrorColor: 'white',
    });
    console.log('有名字');

    if (data.Gender === -1) {
      this.setState({
        RadioBtnColor: 'red',
      });
      console.log('沒有性別');
      return false;
    }
    this.setState({
      RadioBtnColor: '#ffe8d6',
    });
    console.log('有性別');

    if (data.Birth === moment(new Date()).format('ll')) {
      this.setState({
        birthBtnBorder: 'red',
      });
      console.log('沒有生日');
      return false;
    }
    this.setState({
      birthBtnBorder: 'white',
    });
    console.log('有生日');

    if (!data.Email) {
      this.setState({
        emailErrorMsg: 'Please fill in email',
        emailErrorColor: 'red',
      });
      console.log('沒有email');
      return false;
    }
    this.setState({
      emailErrorMsg: '',
      emailErrorColor: 'white',
    });
    console.log('有email');
    if (!data.Password) {
      this.setState({
        fieldPwdErrorMsg: 'Please fill in password',
        fieldPwdErrorColor: 'red',
      });
      console.log('沒有密碼');
      return false;
    }
    this.setState({
      fieldPwdErrorMsg: '',
      fieldPwdErrorColor: 'white',
    });
    console.log('有密碼');
    return true;
  }

  /*------送API資料------*/

  async goRegistration() {
    this.setState({
      loading: true,
    });
    let data = {
      Name: this.state.name,
      Email: this.state.email,
      Birth: moment(this.state.birth).format('ll'),
      Gender: this.state.gender,
      Password: this.state.password,
    };

    console.log(!this.checkField(data));

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
      let res = await fetch(
        'https://tfa.rocket-coding.com/Member/AddMember',
        opts,
      );
      let resJson = await res.text();
      if (resJson !== '成功') {
        this.setState({
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
        Actions.pop();
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
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}>
        <Card containerStyle={{width: '90%', overflow: 'hidden'}}>
          <Input
            placeholder="Name"
            leftIcon={<Icon name="ios-person" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            errorStyle={{color: this.state.fieldNameErrorColor}}
            errorMessage={this.state.fieldNameErrorMsg}
            onChangeText={this.onChangeName}
            label="Your Name"
          />
          <View paddingVertical={10} />
          <View style={{alignSelf: 'center'}}>
            <RadioForm
              radio_props={this.radio_props}
              initial={-1}
              formHorizontal={true}
              labelHorizontal={false}
              onPress={this.onPressGender}
              buttonColor={this.state.RadioBtnColor}
              selectedButtonColor={'#ff9068'}
              labelColor={'gray'}
              animation={false}
            />
          </View>
          <View paddingVertical={10} />
          <View style={{width: '100%'}}>
            <View>
              <Button
                onPress={this.datepicker}
                title={this.state.displayBirthDay}
                titleStyle={{color: 'white'}}
                buttonStyle={{
                  backgroundColor: '#ff9068',
                  borderColor: this.state.birthBtnBorder,
                  borderWidth: 2,
                }}
                type="outline"
                icon={
                  <Icon
                    name="ios-calendar"
                    size={25}
                    color="black"
                    style={{paddingTop: 4, paddingLeft: 10, color: '#35477d'}}
                  />
                }
                iconRight
              />
            </View>
            {this.state.show && (
              <DateTimePicker
                value={this.state.birth}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={this.onChangeBirth}
                locale="zh-tw"
              />
            )}
          </View>
          <View paddingVertical={10} />
          <Input
            placeholder="example@address.com"
            leftIcon={<Icon name="ios-mail" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            errorMessage={this.state.emailErrorMsg}
            errorStyle={{color: this.state.emailErrorColor}}
            onChangeText={value => {
              this.onChangeEmail(value);
              this.validate(value);
            }}
            onBlur={() => {
              this.checkEmail();
            }}
            label="Your email address"
          />
          <View paddingVertical={5} />
          <Input
            placeholder="Password"
            leftIcon={<Icon name="ios-lock" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            errorStyle={{color: this.state.fieldPwdErrorColor}}
            errorMessage={this.state.fieldPwdErrorMsg}
            onChangeText={this.onChangePassword}
            secureTextEntry={true}
            label="Password"
          />
          <View paddingVertical={10} />
          <Button
            title="Sign up"
            onPress={() => {
              this.goRegistration();
            }}
            buttonStyle={{backgroundColor: '#ff9068'}}
            loading={this.state.loading}
          />
        </Card>
        <View paddingVertical={10} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: '#e4e4e4', fontSize: 15, marginRight: 0}}>
            Already have an account ？
          </Text>
          <Text
            onPress={() => {
              Actions.pop();
            }}
            style={{color: 'white', fontSize: 15}}>
            Sign in
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
