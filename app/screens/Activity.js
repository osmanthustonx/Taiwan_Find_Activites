import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
// import 'moment/locale/zh-tw';

export default class Activity extends React.Component {
  onPress = () => {
    Actions.activityInfo({user: '花的世界'});
  };
  state = {
    date: new Date(),
    show: false,
    selectDate: '按我選擇日期',
    nextD: 0,
    yestD: 0,
  };

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
      selectDate: JSON.stringify(moment(date).format('ll')),
    });
  };

  datepicker = () => {
    this.setState({
      show: !this.state.show,
    });
  };
  nex = () => {
    this.setState(prevState => ({
      yestD: 0,
      date: moment(new Date()).add((prevState.nextD += 1), 'd'),
    }));
  };

  yes = () => {
    this.setState(prevState => ({
      nextD: 0,
      date: moment(new Date()).subtract((prevState.yestD += 1), 'd'),
    }));
    console.log(this.state.yestD);
  };

  /*------地區下拉API------*/

  async fetchdata() {
    try {
      let res = await fetch('https://tfa.rocket-coding.com/index/showcity');
      let resJson = await res.json();
      this.setState({
        area: resJson,
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.fetchdata();
  }

  render() {
    return (
      <View>
        <View style={styles.f_direction_row}>
          <RNPickerSelect
            placeholder={{label: '選擇地區', value: null, color: '#9EA0A4'}}
            onValueChange={value => this.setState({exhibition: value})}
            items={[
              {label: '高雄展覽館', value: '高雄展覽館'},
              {label: '駁二', value: '駁二'},
              {label: '奇美美術館', value: '奇美美術館'},
            ]}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 14,
                right: 12,
              },
            }}
            Icon={() => {
              return <Icon name="md-arrow-down" size={24} color="gray" />;
            }}
          />
          <RNPickerSelect
            placeholder={{label: '選擇展覽館', value: null, color: '#9EA0A4'}}
            onValueChange={value => this.setState({exhibition: value})}
            items={[
              {label: '高雄展覽館', value: '高雄展覽館'},
              {label: '駁二', value: '駁二'},
              {label: '奇美美術館', value: '奇美美術館'},
            ]}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 14,
                right: 12,
              },
            }}
            Icon={() => {
              return <Icon name="md-arrow-down" size={24} color="gray" />;
            }}
          />
        </View>
        <View style={styles.f_direction_row}>
          <Button
            title="昨天"
            type="clear"
            onPress={() => {
              this.yes();
              console.log(this.state.date);
            }}
            style={{width: width * 0.2}}
          />
          <Button
            onPress={this.datepicker}
            title={this.state.selectDate}
            style={{width: width * 0.6}}
          />
          <Button
            title="明天"
            type="clear"
            onPress={() => {
              this.nex();
              console.log(this.state.date);
            }}
            style={{width: width * 0.2}}
          />
        </View>
        <View>
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
        <Text style={styles.welcome}>Welcome {this.props.title}</Text>
        <Button onPress={this.onPress} title="Go to About" />
        <Button
          onPress={() => {
            console.log(this.state.area);
          }}
          title="test"
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
  f_direction_row: {
    flexDirection: 'row',
  },
});

var width = Dimensions.get('window').width;
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    textAlign: 'center',
    fontSize: 20,
    width: width / 2,
    alignSelf: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
    color: 'orange',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
