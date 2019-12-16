import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Input, Button, Card} from 'react-native-elements';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import {Popup, showLocation} from 'react-native-map-link';
import AsyncStorage from '@react-native-community/async-storage';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import LinearGradient from 'react-native-linear-gradient';

const utcDateToString = (momentInUTC: moment): string => {
  let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  // console.warn(s);
  return s;
};

export default class Favorite extends React.Component {
  state = {
    myFavorites: [],
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

  /*------取得以收藏API------*/
  async getFavorite() {
    let memberId = JSON.parse(await AsyncStorage.getItem('userData')).Id;
    let res = await fetch(
      `https://tfa.rocket-coding.com/index/ShowFavorite?MId=${memberId}`,
    );
    let resJson = await res.json();
    this.setState({
      myFavorites: resJson,
    });
    console.log(resJson);
  }
  componentDidMount() {
    this.getFavorite();
  }

  /*------取消我的最愛------*/
  async removeFavorite(eId) {
    let memberId = JSON.parse(await AsyncStorage.getItem('userData')).Id;
    console.log(eId, memberId);
    let opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    let res = await fetch(
      `https://tfa.rocket-coding.com/index/Cancelfavorite?MId=${memberId}&EId=${eId}`,
      opts,
    );
    console.log(res);
    let resJson = await res.text();
    console.log(resJson);
  }

  /*------FlatList------*/

  _renderItem = ({item}) => {
    const nowUTC = moment.utc();
    return (
      <Card>
        <TouchableOpacity onPress={this.onPress}>
          <View
            style={{
              alignItems: 'center',
              borderColor: 'gray',
              borderWidth: 1,
            }}>
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
        <View style={styles.info}>
          <Text>{item.name}</Text>
          <View paddingVertical={4} />
          <Text>{item.place}</Text>
          <View paddingVertical={5} />
          <Text>
            {moment(item.StartDate).format('ll') +
              '~' +
              moment(item.EndDate).format('ll')}
          </Text>
          <View paddingVertical={5} />
          <View
            style={{
              width: width / 2,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Text
              onPress={async () => {
                await this.removeFavorite(item.id);
                await this.getFavorite();
              }}>
              <Icon name="ios-heart" size={20} />
            </Text>
            <Text
              onPress={() =>
                showLocation({
                  latitude: item.lat,
                  longitude: item.lng,
                  title: item.name,
                })
              }>
              <Icon name="ios-navigate" size={20} />
            </Text>
            <Text
              onPress={() => {
                Favorite.addToCalendar(item.name, item.place, nowUTC);
              }}
              title="Add to calendar">
              <Icon name="ios-calendar" size={20} />
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  _keyExtractor = (item, index) => item.id.toString();

  render() {
    return (
      <LinearGradient
        colors={['#bd83ce', '#ff9068']}
        style={styles.container}
        start={{x: 1, y: 1}}
        end={{x: 0, y: 0}}>
        <FlatList
          keyExtractor={this._keyExtractor}
          data={this.state.myFavorites}
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
  image: {
    width: '100%',
    height: 300,
  },
  info: {
    paddingTop: 10,
    alignItems: 'center',
  },
});
