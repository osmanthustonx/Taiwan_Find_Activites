import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/zh-tw';
import AsyncStorage from '@react-native-community/async-storage';
import {Popup, showLocation} from 'react-native-map-link';

const options = {
  latitude: 38.8976763,
  longitude: -77.0387185,
  title: 'The White House',
  dialogTitle: 'This is the dialog Title',
  dialogMessage: 'This is the amazing dialog Message',
  cancelText: 'This is the cancel button text',
};

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
    refreshing: false,
    area: [],
    buildingDataSource: [],
    selectAreaBuilding: [],
    fairData: [],
    place: '',
    city: '',
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

  async getSelectData() {
    try {
      let res = await fetch('https://tfa.rocket-coding.com/index/showcity');
      let resJson = await res.json();
      this.setState({
        area: resJson,
      });
    } catch (error) {
      console.log(error);
    }
    try {
      let res = await fetch('https://tfa.rocket-coding.com/index/showplace');
      let resJson = await res.json();
      this.setState({
        buildingDataSource: resJson,
      });
    } catch (error) {
      console.log(error);
    }
  }

  filteData = data => {
    let aimData = this.state.buildingDataSource.filter(item => {
      return data === item.city;
    });
    this.setState({
      selectAreaBuilding: aimData,
    });
  };

  /*------展覽內容API------*/

  async getFairData(place = '', city = '', date = this.state.date) {
    let data = {
      place,
      city,
      date,
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
        'https://tfa.rocket-coding.com/index/showdata',
        opts,
      );
      let resJson = await res.json();
      this.setState({
        fairData: resJson,
        refreshing: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getSelectData();
    this.getFairData();
  }

  /*------FlastList------*/
  _renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <View style={{alignItems: 'center'}}>
            <Image source={{uri: item.Image}} style={styles.image} />
            <Text style={styles.label}>Press Me</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.info}>
          <Text>{item.Name}</Text>
          <Text>{item.Place}</Text>
          <Text
            onPress={() => {
              this.addFavorit(item.Id);
              item.Name = '測試'; // 要新增欄位
              console.log(item);
            }}>
            <Icon name="ios-heart-empty" size={20} />
          </Text>
          <Text
            onPress={() =>
              showLocation({
                latitude: item.Latitude,
                longitude: item.Longitude,
                title: item.Name,
              })
            }>
            <Icon name="ios-navigate" size={20} />
          </Text>
        </View>
      </View>
    );
  };

  _keyExtractor = (item, index) => String(item.Id);

  _onRefresh = async () => {
    console.log('onRefresh');
    this.setState({refreshing: true});
    await this.getFairData(this.state.place, this.state.city);
  };

  /*------我的最愛API------*/
  async addFavorit(EId) {
    let userData = JSON.parse(await AsyncStorage.getItem('userData'));
    // var data = JSON.stringify({
    //   MId: userData.Id,
    //   EId,
    // });
    // let opts = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: data,
    // };
    // try {
    //   let res = await fetch(
    //     'https://tfa.rocket-coding.com/Index/AddFavorite',
    //     opts,
    //   );
    //   let resJson = await JSON.parse(res);
    //   // console.log(resJson);
    // } catch (error) {
    //   console.log(error);
    // }
    /*--------------------------------*/
    var data = JSON.stringify({
      MId: userData.Id,
      EId,
    });
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    xhr.open('POST', 'https://tfa.rocket-coding.com/Index/AddFavorite');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);
  }

  render() {
    return (
      <View>
        <View style={styles.f_direction_row}>
          <RNPickerSelect
            placeholder={{label: '選擇地區', value: null, color: '#9EA0A4'}}
            onValueChange={value => {
              this.filteData(value);
              this.setState({city: value});
            }}
            items={this.state.area}
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
            onValueChange={value => this.setState({place: value})}
            items={
              this.state.selectAreaBuilding.length !== 0
                ? this.state.selectAreaBuilding
                : this.state.buildingDataSource
            }
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
        <View>
          <Button
            onPress={() => {
              this.getFairData(this.state.place, this.state.city);
            }}
            title="Go to About"
          />
        </View>
        <FlatList
          keyExtractor={this._keyExtractor}
          data={this.state.fairData}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.2}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
        />
        {/* <Button onPress={this.onPress} title="Go to About" /> */}
        {/* <Button
          onPress={() => {
            this.getFairData(this.state.place, this.state.city);
            console.log(this.state.fairData);
          }}
          title="Go to About"
        /> */}
      </View>
    );
  }
}

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
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

  listItem: {
    height: height - 200,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginBottom: 10,
  },
  image: {
    // position: 'absolute',
    width: '100%',
    height: 300,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: 3,
  },
  info: {backgroundColor: '#cccccc', width: width, height: 300},
});

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
