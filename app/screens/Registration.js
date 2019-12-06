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

export default class Login extends React.Component {
  state = {
    email: '',
    value: 0,
    date: new Date(),
    mode: 'date',
    show: false,
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
  radio_props = [{label: '女', value: 0}, {label: '男', value: 1}];

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
  render() {
    return (
      <View style={styles.container}>
        <Input
          placeholder="姓名"
          leftIcon={<Icon name="ios-person" size={24} color="black" />}
          leftIconContainerStyle={{paddingRight: 10}}
          errorStyle={{color: 'red'}}
          errorMessage="ENTER A VALID ERROR HERE"
        />
        <View>
          <RadioForm
            radio_props={this.radio_props}
            initial={0}
            formHorizontal={true}
            labelHorizontal={false}
            onPress={value => {
              this.setState({value: value});
            }}
          />
        </View>
        <View style={{width: '100%'}}>
          <View>
            <Button onPress={this.datepicker} title="生日" type="outline" />
          </View>
          {this.state.show && (
            <DateTimePicker
              value={this.state.date}
              mode={this.state.mode}
              is24Hour={true}
              display="default"
              onChange={this.setDate}
            />
          )}
          <Button title={'生日確定'} onPress={this.unShow} type="clear" />
        </View>

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

        <Button
          title="送出"
          onPress={() => {
            Actions.pop();
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
