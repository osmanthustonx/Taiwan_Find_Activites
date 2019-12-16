import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import RNPickerSelect from 'react-native-picker-select';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Popup, showLocation} from 'react-native-map-link';
import Geolocation from '@react-native-community/geolocation';

export default class Activity extends React.Component {
  onPress = () => {
    Actions.activityInfo({user: '花的世界'});
  };

  state = {
    area: [],
    buildingDataSource: [],
    selectAreaBuilding: [],
    restaurantData: [],
    exhibitionLat: '',
    exhibitionLng: '',
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

  /*------餐廳內容API------*/

  async getRestaurantData(lat, lng) {
    let data = {
      lng: lng.toString(),
      lat: lat.toString(),
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
        refreshing: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  getExhibitionData(exhibition) {
    let data = this.state.buildingDataSource.find(item => {
      return exhibition === item.label;
    });
    this.setState({
      exhibitionLat: data.lat,
      exhibitionLng: data.lng,
    });
    this.getRestaurantData(data.lat, data.lng);
  }

  locateCurrentPosition() {
    Geolocation.getCurrentPosition(
      position => {
        this.getRestaurantData(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
    );
  }

  UNSAFE_componentWillMount() {}

  componentDidMount() {
    this.getSelectData();
    this.locateCurrentPosition();
  }

  /*------Flatlist------*/

  _renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={{
                uri: `https://tfa.rocket-coding.com/upfiles/restaurant/${
                  item.Photo
                }`,
              }}
              style={styles.image}
            />
            <Text style={styles.label}>Press Me</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.info}>
          <Text>{item.Name}</Text>
          <Text>{item.Place}</Text>
          <Text>{item.optime}</Text>
          <Text>{item.tel}</Text>
          <Text>{item.DisView}</Text>
          <Text
            onPress={() =>
              showLocation({
                latitude: item.lat,
                longitude: item.lng,
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

  render() {
    return (
      <View>
        <View style={styles.f_direction_row}>
          <RNPickerSelect
            placeholder={{label: '選擇地區', value: null, color: '#9EA0A4'}}
            onValueChange={value => {
              this.filteData(value);
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
            onValueChange={value => {
              this.getExhibitionData(value);
            }}
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
        <FlatList
          keyExtractor={this._keyExtractor}
          data={this.state.restaurantData}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.2}
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
  image: {
    // position: 'absolute',
    width: '100%',
    height: 300,
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
