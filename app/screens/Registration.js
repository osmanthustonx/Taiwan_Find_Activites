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
    loading: false,
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
  radio_props = [{label: 'Female', value: 0}, {label: 'Male', value: 1}]; //列舉
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

  async goRegistration() {
    this.setState({
      loading: true,
    });
    let data = {
      Name: this.state.name,
      Email: this.state.email,
      Birth: moment(this.state.date).format('ll'),
      Gender: this.state.gender,
      Password: this.state.password,
    };

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
        <Card
          containerStyle={{width: '90%', height: '67%', overflow: 'hidden'}}>
          <Input
            placeholder="Name"
            leftIcon={<Icon name="ios-person" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            // errorStyle={{color: 'red'}}
            // errorMessage="ENTER A VALID ERROR HERE"
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
              buttonColor={'#ffe8d6'}
              selectedButtonColor={'#ff9068'}
              labelColor={'gray'}
            />
          </View>
          <View paddingVertical={10} />
          <View style={{width: '100%'}}>
            <View>
              <Button
                onPress={this.datepicker}
                title="Your Birth Day"
                buttonStyle={{backgroundColor: '#ff9068'}}
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
                value={this.state.date}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={this.setDate}
              />
            )}
          </View>
          <View paddingVertical={10} />
          <Input
            placeholder="example@address.com"
            leftIcon={<Icon name="ios-mail" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            // errorStyle={{color: 'red'}}
            // errorMessage="ENTER A VALID ERROR HERE"
            onChangeText={this.onChangeEmail}
            label="Your email address"
          />
          <View paddingVertical={5} />
          <Input
            placeholder="Password"
            leftIcon={<Icon name="ios-lock" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            // errorStyle={{color: 'red'}}
            // errorMessage="ENTER A VALID ERROR HERE"
            onChangeText={this.onChangePassword}
            secureTextEntry={true}
            label="Password"
          />
          <View paddingVertical={10} />
          <Button
            title="Sign up"
            onPress={() => {
              this.goRegistration();
              // this.test();
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
