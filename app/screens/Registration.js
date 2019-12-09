import React from 'react';
import {View, StyleSheet, Text, TextInput, Platform} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import {Input, Button} from 'react-native-elements';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default class Login extends React.Component {
  state = {
    value: null,
    date: new Date(),
    show: false,
    // memberData: {
    //   name: '',
    //   email: '',
    //   birth: '',
    //   gender: 0,
    //   password: '',
    // },
    name: '',
    email: '',
    birth: new Date(),
    gender: 0,
    password: '',
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

  /*------input資料處理------*/

  //name
  onChangeName = name => {
    this.setState({
      name,
    });
    // console.log(this.state.name);
  };

  //gender
  radio_props = [{label: '女', value: 0}, {label: '男', value: 1}]; //列舉
  onPressGender = gender => {
    this.setState({
      gender,
    });
    // console.log(this.state.memberData);
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
    });
    // console.log(this.state.memberData);
  };
  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      // show: Platform.OS === 'ios' ? true : false,
      date,
    });
  };

  // email
  onChangeEmail = email => {
    this.setState({
      email,
    });
    // console.log(this.state.memberData);
  };

  //password
  onChangePassword = password => {
    this.setState({
      password,
    });
    // console.log(this.state.memberData);
  };

  /*------撈API資料------*/

  goRegist = () => {
    let data = JSON.stringify({
      Name: this.state.name,
      Email: this.state.email,
      Birth: moment(this.state.date).format('ll'),
      Gender: this.state.gender,
      Password: this.state.password,
    });

    let xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        if (this.responseText === '成功') {
          Actions.pop();
        } else {
          console.log(this.responseText);
        }
      }
    });

    xhr.open('POST', 'https://tfa.rocket-coding.com/Member/AddMember');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);
  };

  test = () => {
    let data = {
      Name: this.state.name,
      Email: this.state.email,
      Birth: moment(this.state.date).format('ll'),
      Gender: this.state.gender,
      Password: this.state.password,
    };
    console.log(data);
  };

  render() {
    return (
      <View style={styles.container}>
        {/* 姓名Input */}
        <Input
          placeholder="姓名"
          leftIcon={<Icon name="ios-person" size={24} color="black" />}
          leftIconContainerStyle={{paddingRight: 10}}
          // errorStyle={{color: 'red'}}
          // errorMessage="ENTER A VALID ERROR HERE"
          onChangeText={this.onChangeName}
        />

        {/* 性別Input */}
        <View>
          <RadioForm
            radio_props={this.radio_props}
            initial={0}
            formHorizontal={true}
            labelHorizontal={false}
            onPress={this.onPressGender}
          />
        </View>

        {/* 生日Input */}
        <View style={{width: '100%'}}>
          <View>
            <Button onPress={this.datepicker} title="生日" type="outline" />
          </View>
          {this.state.show && (
            <DateTimePicker
              value={this.state.date}
              mode={'date'}
              is24Hour={true}
              display="default"
              onChange={this.setDate}
            />
          )}
        </View>

        {/* 信箱Input */}
        <Input
          placeholder="請輸入電子信箱"
          leftIcon={<Icon name="ios-mail" size={24} color="black" />}
          leftIconContainerStyle={{paddingRight: 10}}
          // errorStyle={{color: 'red'}}
          // errorMessage="ENTER A VALID ERROR HERE"
          onChangeText={this.onChangeEmail}
        />

        {/* 密碼Input */}
        <Input
          placeholder="請輸入密碼"
          leftIcon={<Icon name="ios-lock" size={24} color="black" />}
          leftIconContainerStyle={{paddingRight: 10}}
          // errorStyle={{color: 'red'}}
          // errorMessage="ENTER A VALID ERROR HERE"
          onChangeText={this.onChangePassword}
          secureTextEntry={true}
        />

        <Button
          title="送出"
          onPress={() => {
            this.goRegist();
            // this.test();
          }}
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
