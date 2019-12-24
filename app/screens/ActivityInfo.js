import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  FlatList,
  TextInput,
  Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Input,
  Button,
  Card,
  Text,
  ButtonGroup,
  Overlay,
  Avatar,
} from 'react-native-elements';
import moment from 'moment';
import 'moment/locale/zh-tw';
import Icon from 'react-native-vector-icons/Ionicons';
import {Popup, showLocation} from 'react-native-map-link';
import {Rating, AirbnbRating} from 'react-native-ratings';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

const utcDateToString = (momentInUTC: moment): string => {
  let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  // console.warn(s);
  return s;
};

export default class ActivityInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: -1,
      infoData: {},
      restaurantData: [],
      commentData: [],
      averageRateData: 0,
      myComment: {},
      editData: {},
      showComment: false,
      showAddCommentBtn: true,
      Score: 0,
      comment: '',
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

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

  /*-----取得個人資料------*/
  async getProfileData() {
    this.setState({
      profile: JSON.parse(await AsyncStorage.getItem('userData')),
    });
  }

  /*------取得單頁API------*/
  async getInfo() {
    let MId = JSON.parse(await AsyncStorage.getItem('userData')).Id;
    let data = {
      MId,
      EId: this.props.EId,
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
        'https://tfa.rocket-coding.com/index/SingleActivity',
        opts,
      );
      let resJson = await res.json();
      this.setState({
        infoData: resJson,
      });
      // console.log(resJson);
    } catch (error) {
      console.log(error);
    }
  }

  /*------取得餐廳API------*/
  async getRestaurantData() {
    let data = {
      lng: this.state.infoData.lng,
      lat: this.state.infoData.lat,
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
        'https://tfa.rocket-coding.com/FoodData/PlaceNearFood',
        opts,
      );
      let resJson = await res.json();
      this.setState({
        restaurantData: resJson,
      });
    } catch (error) {
      console.log(error);
    }
  }

  /*------取得該活動計算平均分數API------*/
  async getAverageRate() {
    try {
      let res = await fetch(
        `https://tfa.rocket-coding.com/message/ScoreAVG?EId=${this.props.EId}`,
      );
      let resJson = await res.text();
      this.setState({
        averageRateData: resJson,
      });
    } catch (error) {
      console.log(error);
    }
  }

  /*------取得該活動的所有評論(其他人的)API------*/
  async getOtherCommentData() {
    let MId = JSON.parse(await AsyncStorage.getItem('userData')).Id;
    try {
      let res = await fetch(
        `https://tfa.rocket-coding.com/message/ShowMessage?EId=${
          this.props.EId
        }&memberId=${MId}`,
      );
      let resJson = await res.json();
      this.setState({
        commentData: resJson,
      });
      // console.log(resJson);
    } catch (error) {
      console.log(error);
    }
  }

  /*------顯示該活動是否有被該登入會員評論過API------*/
  async getIsICommentBefore() {
    let MId = JSON.parse(await AsyncStorage.getItem('userData')).Id;
    try {
      let res = await fetch(
        `https://tfa.rocket-coding.com/message/IsMessage?MId=${MId}&EId=${
          this.props.EId
        }`,
      );
      let resJson = await res.text();
      console.log(resJson);

      if (resJson !== '沒有留言過') {
        this.setState({
          myComment: JSON.parse(resJson),
          Score: JSON.parse(resJson).score,
          showAddCommentBtn: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*------取得編輯評論前先取得評論API------*/
  async beforeEditGetComment() {
    let MId = JSON.parse(await AsyncStorage.getItem('userData')).Id;
    try {
      let res = await fetch(
        `https://tfa.rocket-coding.com/message/EditMessage?EId=${
          this.props.EId
        }&MId=${MId}`,
      );
      let resJson = await res.text();
      console.log(resJson);
      if (resJson !== '沒有這筆資料') {
        this.setState({
          editData: JSON.parse(resJson),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*------取得以收藏API------*/
  async getFavorite() {
    let memberId = JSON.parse(await AsyncStorage.getItem('userData')).Id;
    let res = await fetch(
      `https://tfa.rocket-coding.com/index/ShowFavorite?MId=${memberId}`,
    );
    let resJson = await res.json();
    this.setState({
      myFavorites: resJson,
      refreshing: false,
    });
  }

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

  UNSAFE_componentWillMount() {
    this.getProfileData();
  }

  async componentDidMount() {
    await this.getIsICommentBefore();
    await this.getInfo();
    await this.getAverageRate();
    await this.getOtherCommentData();
    await this.getRestaurantData();
    await this.beforeEditGetComment();
    this.getFavorite();
  }

  /*------評論及美食------*/
  updateIndex(selectedIndex) {
    this.setState({selectedIndex});
  }

  //新增評論
  ratingCompleted(rating) {
    console.log(`Rating is: ${rating}`);
    this.setState({
      Score: rating,
    });
  }
  async addComment() {
    let MId = JSON.parse(await AsyncStorage.getItem('userData')).Id;
    let data = {
      MId,
      EId: this.props.EId,
      Main: this.state.comment,
      Score: this.state.Score,
    };
    let opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    let res = await fetch(
      'https://tfa.rocket-coding.com/Message/AddMessage',
      opts,
    );
    let resJson = await res.text();
    this.setState({
      showComment: false,
      showAddCommentBtn: false,
    });
    console.log(resJson);
  }

  commentsHeader = () => {
    return (
      <View>
        {this.state.showAddCommentBtn ? (
          <Card
            wrapperStyle={{
              paddingTop: 10,
              alignItems: 'center',
            }}
            containerStyle={{
              shadowColor: 'black',
              shadowOffset: {width: 7, height: 7},
              shadowOpacity: 0.2,
              borderRadius: 10,
              marginBottom: 10,
            }}>
            <Avatar
              rounded
              size="small"
              source={{
                uri: `https://tfa.rocket-coding.com/upfiles/images/${
                  this.state.profile.Image
                }`,
              }}
            />
            <View paddingVertical={5} />
            <Text style={{fontSize: 20}}>{'評分及評論'}</Text>
            <View paddingVertical={5} />
            <AirbnbRating
              showRating={false}
              defaultRating={this.state.Score}
              onFinishRating={item => {
                this.ratingCompleted(item);
                this.setState({
                  showComment: true,
                });
              }}
            />
          </Card>
        ) : (
          <Card
            containerStyle={{
              shadowColor: 'black',
              shadowOffset: {width: 7, height: 7},
              shadowOpacity: 0.2,
              borderRadius: 10,
              marginBottom: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  {'你的評論'}
                </Text>
                <View paddingVertical={5} />
                <Text>{this.state.myComment.Main}</Text>
              </View>
              <Button
                icon={<Icon name="ios-create" size={30} color="#E5BE94" />}
                buttonStyle={{width: 45}}
                type="clear"
                onPress={() => {
                  this.setState({
                    showComment: true,
                  });
                }}
              />
            </View>
          </Card>
        )}
      </View>
    );
  };
  //評論顯示
  _keyCommentExtractor = (item, index) => String(item.Id);
  _renderItem = ({item}) => {
    return (
      <Card
        containerStyle={{
          shadowColor: 'black',
          shadowOffset: {width: 7, height: 7},
          shadowOpacity: 0.2,
          borderRadius: 10,
          marginBottom: 10,
        }}>
        <Avatar
          rounded
          size="small"
          source={{
            uri: `https://tfa.rocket-coding.com/upfiles/images/${
              item.MemberImage
            }`,
          }}
        />
        <Text>{item.MemberName + '：' + item.Main}</Text>
      </Card>
    );
  };

  //美食顯示
  _keyRestaurantExtractor = (item, index) => String(item.Id);
  _renderRestaurantItem = ({item}) => {
    return (
      <Card
        containerStyle={{
          shadowColor: 'black',
          shadowOffset: {width: 7, height: 7},
          shadowOpacity: 0.2,
          borderRadius: 10,
          marginBottom: 10,
          height: 180,
        }}>
        <View style={{width: 100, position: 'absolute'}}>
          <Image
            source={{
              uri: `https://tfa.rocket-coding.com/upfiles/restaurant/${
                item.Photo
              }`,
            }}
            style={styles.restaurantImage}
          />
        </View>

        <View
          style={{
            width: '65%',
            alignSelf: 'flex-end',
            alignItems: 'flex-start',
            justifyContent: 'center',
            display: 'flex',
          }}>
          <Text h1 h1Style={{fontSize: 20}}>
            {item.Name}
          </Text>
          <Text>{item.Place}</Text>
          <Text numberOfLines={2}>{item.optime}</Text>
          <Text>{item.tel}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '70%',
            }}>
            <Text>{'距離展覽約：' + item.DisView + ' '}</Text>
            <Text
              onPress={() =>
                showLocation({
                  latitude: item.lat,
                  longitude: item.lng,
                  title: item.Name,
                })
              }>
              <Icon name="ios-navigate" size={25} style={{color: '#35477d'}} />
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  render() {
    const switchBtn = ['Comment', 'Restaurant'];
    const {selectedIndex} = this.state;
    const nowUTC = moment.utc();
    return (
      <ScrollView style={{backgroundColor: '#ff9068'}}>
        <Card
          containerStyle={{
            marginTop: 20,
            shadowColor: 'black',
            shadowOffset: {width: 7, height: 7},
            shadowOpacity: 0.2,
            borderRadius: 10,
          }}>
          <View
            style={{
              borderColor: '#ff9068',
              backgroundColor: '#ff9068',
              borderWidth: 1,
              width: '50%',
              marginBottom: 10,
              padding: 5,
              borderRadius: 10,
            }}>
            <Text style={styles.welcome}>{this.state.infoData.Place}</Text>
          </View>
          <Image
            source={{
              uri: `https://tfa.rocket-coding.com/upfiles/activitiestImage/${
                this.state.infoData.Image
              }`,
            }}
            style={styles.activityImage}
          />
          <View paddingVertical={5} />
          <View style={{paddingLeft: 10}}>
            <Text>
              {moment(this.state.infoData.StartDate).format('ll') +
                '~' +
                moment(this.state.infoData.EndDate).format('ll')}
            </Text>
            <View paddingVertical={2} />
            <Text style={{fontSize: 20, lineHeight: 25}}>
              {this.state.infoData.Name}
            </Text>
            <View paddingVertical={2} />
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 10,
                }}>
                <Icon
                  name={'ios-star'}
                  size={20}
                  style={{paddingLeft: 5, paddingRight: 5, color: '#F0C330'}}
                />
                <Text>{this.state.averageRateData}</Text>
                <Text>{`(${this.state.infoData.MessageCount})`}</Text>
              </View>
            </View>
            <View paddingVertical={2} />

            <View paddingVertical={10} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <Text
                onPress={async () => {
                  await this.addFavorite(this.props.EId);
                  await this.getInfo();
                }}>
                <Icon
                  name={`ios-heart${this.state.infoData.IsFavorite}`}
                  size={30}
                  style={{color: '#ff9068'}}
                />
              </Text>

              <View>
                <Icon
                  name={'ios-home'}
                  size={30}
                  style={{color: '#89BDE6'}}
                  onPress={() => {
                    Linking.openURL(this.state.infoData.website);
                  }}
                />
              </View>
              <Text
                onPress={() => {
                  ActivityInfo.addToCalendar(
                    this.state.infoData.Name,
                    this.state.infoData.Place,
                    nowUTC,
                  );
                }}
                title="Add to calendar">
                <Icon
                  name="ios-calendar"
                  size={30}
                  style={{color: '#7FCAB6'}}
                />
              </Text>
              <Text
                onPress={() =>
                  showLocation({
                    latitude: this.state.infoData.lat,
                    longitude: this.state.infoData.lng,
                    title: this.state.infoData.Name,
                  })
                }>
                <Icon
                  name="ios-navigate"
                  size={30}
                  style={{color: '#35477d'}}
                />
              </Text>
            </View>
          </View>

          {/* <Button
            onPress={async () => {
              // await this.getInfo();
              // await this.getRestaurantData();
              // this.getAverageRate();
              // this.getOtherCommentData();
              // this.getIsICommentBefore();
              // this.beforeEditGetComment();
              // this.addComment();
              console.log(this.state.profile);
            }}
            title="資料測試按鈕"
          /> */}
          <View style={{marginTop: 5}}>
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
              buttons={switchBtn}
              containerStyle={{height: 30, borderWidth: 0}}
              selectedButtonStyle={{backgroundColor: '#bd83ce'}}
            />
          </View>
        </Card>

        <SafeAreaView>
          {this.state.selectedIndex ? (
            <FlatList
              keyExtractor={this._keyRestaurantExtractor}
              data={this.state.restaurantData}
              renderItem={this._renderRestaurantItem}
              onEndReachedThreshold={0.2}
            />
          ) : (
            <FlatList
              keyExtractor={this._keyCommentExtractor}
              data={this.state.commentData}
              ListHeaderComponent={this.commentsHeader}
              renderItem={this._renderItem}
              onEndReachedThreshold={0.2}
              extraData={this.state.showAddCommentBtn}
            />
          )}
        </SafeAreaView>
        <Overlay
          isVisible={this.state.showComment}
          windowBackgroundColor="rgba(0, 0, 0, .4)"
          overlayBackgroundColor="white"
          borderRadius={10}
          width="85%"
          height="60%"
          children={Input}
          onBackdropPress={() => {
            this.setState({
              showComment: !this.state.showComment,
            });
          }}>
          <View style={{alignItems: 'center'}}>
            <AirbnbRating
              showRating={true}
              defaultRating={this.state.Score}
              onFinishRating={item => {
                this.ratingCompleted(item);
              }}
            />
            <View paddingVertical={10} />
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                placeholder="Type something"
                placeholderTextColor="grey"
                multiline={true}
                value={this.state.myComment.Main}
                onChangeText={value => {
                  this.setState({comment: value});
                }}
              />
            </View>
            <View paddingVertical={10} />
            <Button
              onPress={async () => {
                await this.addComment();
              }}
              title="Confirm"
              titleStyle={{color: 'white'}}
              loading={this.state.loading}
              buttonStyle={{backgroundColor: '#ff9068', width: '100%'}}
            />
          </View>
        </Overlay>
      </ScrollView>
    );
  }
}
var width = Dimensions.get('window').width;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: 'white',
    fontWeight: 'bold',
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: {width: -1, height: 1},
    // textShadowRadius: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  activityImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  restaurantImage: {
    width: '100%',
    height: 100,
  },
  textAreaContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    width: '100%',
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
  },
});
