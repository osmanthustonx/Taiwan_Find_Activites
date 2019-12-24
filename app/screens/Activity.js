import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import {Input, Button, Card, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/zh-tw';
import AsyncStorage from '@react-native-community/async-storage';
import {Popup, showLocation} from 'react-native-map-link';
import LinearGradient from 'react-native-linear-gradient';
import {Chevron} from 'react-native-shapes';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

const utcDateToString = (momentInUTC: moment): string => {
  let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  // console.warn(s);
  return s;
};

export default class Activity extends React.Component {
  goActivityInfo = EId => {
    Actions.activityInfo({EId});
  };
  state = {
    date: moment(new Date()),
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
    haveLike: '-empty',
  };

  static addToCalendar = (title, location, startDateUTC) => {
    const eventConfig = {
      title,
      location,
      startDate: utcDateToString(startDateUTC),
      endDate: utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
        // These are two different identifiers on iOS.
        // On Android, where they are both equal and represent the event id, also strings.
        // when { action: 'CANCELED' } is returned, the dialog was dismissed
        console.warn(JSON.stringify(eventInfo));
      })
      .catch(error => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };

  setDate = (event, date) => {
    date = date || this.state.date;
    this.setState({
      date,
      selectDate: moment(date).format('ll'),
    });
    this.getFairData(this.state.city, this.state.place, date);
  };

  datepicker = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  nex = async () => {
    this.setState(
      prevState => ({
        yestD: 0,
        date: moment(new Date()).add((prevState.nextD += 7), 'd'),
      }),
      console.log(this.state.nextD, this.state.date),
    );
    this.getFairData(this.state.place, this.state.city, this.state.date);
  };

  yes = async () => {
    this.setState(
      prevState => ({
        nextD: 0,
        date: moment(new Date()).subtract((prevState.yestD += 7), 'd'),
      }),
      console.log(this.state.yestD, this.state.date),
    );
    this.getFairData(this.state.place, this.state.city, this.state.date);
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

  filetData = data => {
    let aimData = this.state.buildingDataSource.filter(item => {
      return data === item.city;
    });
    this.setState({
      selectAreaBuilding: aimData,
    });
  };

  /*------展覽內容API------*/

  async getFairData(place = '', city = '', date = this.state.date) {
    let userId = JSON.parse(await AsyncStorage.getItem('userData')).Id;
    let data = {
      place: this.state.place,
      city: this.state.city,
      date,
      MemberID: userId,
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
      let fairDataJson = await res.json();
      this.setState({
        fairData: fairDataJson,
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

  /*------FlatList------*/
  _renderItem = ({item}) => {
    const nowUTC = moment.utc();
    return (
      <Card
        containerStyle={{
          width: '92%',
          shadowColor: 'black',
          shadowOffset: {width: 7, height: 7},
          shadowOpacity: 0.2,
          borderRadius: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.goActivityInfo(item.Id);
          }}>
          <View>
            <Image
              source={{
                uri: `https://tfa.rocket-coding.com/upfiles/activitiestImage/${
                  item.Image
                }`,
              }}
              style={styles.image}
            />
          </View>
        </TouchableOpacity>
        <View paddingVertical={7} />
        <View style={styles.info}>
          <Text h1 h1Style={{fontSize: 20}}>
            {item.Name}
          </Text>
          <View paddingVertical={4} />
          <Text>
            {moment(item.StartDate).format('ll') +
              '~' +
              moment(item.EndDate).format('ll')}
          </Text>
          <View paddingVertical={4} />
          <Text>{item.Place}</Text>
          <View paddingVertical={9} />
          <View
            style={{
              width: width / 2,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Text
              onPress={async () => {
                await this.addFavorite(item.Id);
                await this.getFairData();
              }}>
              <Icon
                name={`ios-heart${item.IsFavorite}`}
                size={30}
                style={{color: '#ff9068'}}
              />
            </Text>
            <Text
              onPress={() =>
                showLocation({
                  latitude: item.Latitude,
                  longitude: item.Longitude,
                  title: item.Name,
                })
              }>
              <Icon name="ios-navigate" size={30} style={{color: '#35477d'}} />
            </Text>
            <Text
              onPress={() => {
                Activity.addToCalendar(item.name, item.place, nowUTC);
              }}
              title="Add to calendar">
              <Icon name="ios-calendar" size={30} style={{color: '#7FCAB6'}} />
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  _keyExtractor = (item, index) => String(item.Id);

  _onRefresh = async () => {
    console.log('onRefresh');
    this.setState({refreshing: true});
    await this.getFairData(this.state.place, this.state.city);
  };

  /*------我的最愛API------*/
  async addFavorite(EId) {
    let userData = JSON.parse(await AsyncStorage.getItem('userData'));
    var data = JSON.stringify({
      MId: userData.Id,
      EId,
    });
    let opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    };
    try {
      let res = await fetch(
        'https://tfa.rocket-coding.com/Index/AddFavorite',
        opts,
      );
      let resJson = await res.text();
      console.log(resJson);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <LinearGradient
        colors={['#bd83ce', '#ff9068']}
        start={{x: 1, y: 1}}
        end={{x: 0, y: 0}}>
        <View style={[styles.f_direction_row, styles.selectInput]}>
          <RNPickerSelect
            placeholder={{label: '選擇地區', value: null, color: '#9EA0A4'}}
            onValueChange={value => {
              this.filetData(value);
              this.setState({city: value});
              this.getFairData(
                this.state.city,
                this.state.place,
                this.state.date,
              );
            }}
            items={this.state.area}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 13,
                right: 20,
              },
              placeholder: {
                color: 'white',
              },
            }}
            Icon={() => {
              return <Chevron size={1.5} color="white" />;
            }}
          />
          <RNPickerSelect
            placeholder={{label: '選擇展覽館', value: null, color: '#9EA0A4'}}
            onValueChange={value => {
              this.setState({place: value});
              this.getFairData(
                this.state.city,
                this.state.place,
                this.state.date,
              );
            }}
            items={
              this.state.selectAreaBuilding.length !== 0
                ? this.state.selectAreaBuilding
                : this.state.buildingDataSource
            }
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 13,
                right: 20,
              },
              placeholder: {
                color: 'white',
              },
            }}
            Icon={() => {
              return <Chevron size={1.5} color="white" />;
            }}
          />
        </View>
        <View style={[styles.f_direction_row, {paddingBottom: 5}]}>
          <Button
            title="上週"
            type="clear"
            onPress={() => {
              this.yes();
            }}
            style={{width: width * 0.2}}
            titleStyle={{color: 'white'}}
          />
          <Button
            onPress={this.datepicker}
            title={this.state.selectDate}
            type="outline"
            style={{width: width * 0.6}}
            buttonStyle={{borderColor: 'white'}}
            titleStyle={{color: 'white'}}
          />
          <Button
            title="下週"
            type="clear"
            onPress={() => {
              this.nex();
            }}
            style={{width: width * 0.2}}
            titleStyle={{color: 'white'}}
          />
        </View>

        {this.state.show && (
          <DateTimePicker
            value={this.state.date}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={this.setDate}
            locale="zh-tw"
          />
        )}

        <FlatList
          keyExtractor={this._keyExtractor}
          data={this.state.fairData}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.2}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
        />
      </LinearGradient>
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
  selectInput: {
    paddingTop: 40,
    paddingBottom: 15,
    width: '100%',
    justifyContent: 'space-around',
  },
  listItem: {
    height: height - 200,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: 3,
  },
  info: {
    paddingTop: 10,
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    textAlign: 'center',
    fontSize: 20,
    width: width / 2.3,
    alignSelf: 'stretch',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 2,
    color: 'white',
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
