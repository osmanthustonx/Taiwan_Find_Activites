import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import {Input, Button, Card, Text} from 'react-native-elements';

export default class ActivityInfo extends React.Component {
  state = {
    infoData: {},
    restaurantData: [],
  };

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
      console.log(resJson);
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
      console.log(resJson);
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
      console.log(resJson);
    } catch (error) {
      console.log(error);
    }
  }

  /*------取得該活動的所有評論(其他人的)API------*/
  async getOtherCommentData() {
    try {
      let res = await fetch(
        `https://tfa.rocket-coding.com/message/ShowMessage?EId=${
          this.props.EId
        }`,
      );
      let resJson = await res.json();
      console.log(resJson);
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
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    await this.getInfo();
    await this.getRestaurantData();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>About {this.props.EId}</Text>

        <Button
          onPress={async () => {
            // await this.getInfo();
            // await this.getRestaurantData();
            // this.getAverageRate();
            // this.getOtherCommentData();
            // this.getIsICommentBefore();
            // this.beforeEditGetComment();
          }}
          title="Back"
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
    backgroundColor: 'white',
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
