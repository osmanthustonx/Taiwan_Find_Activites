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

const listData = [
  {
    title: 'Apple',
    url:
      'https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-0.3.5&s=8afa11b380d228808390a0e64c395941&auto=format&fit=crop&w=2557&q=80',
  },
  {
    title: 'Banana',
    url:
      'https://images.unsplash.com/photo-1483086431886-3590a88317fe?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bc3b9de92dde18a3b7a76da414f0975e&auto=format&fit=crop&w=934&q=80',
  },
  {
    title: 'Cherry',
    url:
      'https://images.unsplash.com/photo-1504387103978-e4ee71416c38?ixlib=rb-0.3.5&s=e03bf50e379a0b963cfe29233c31c03d&auto=format&fit=crop&w=934&q=80',
  },
  {
    title: 'Grape',
    url:
      'https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?ixlib=rb-0.3.5&s=32915bf266ac28dc51612baa805d06c0&auto=format&fit=crop&w=2551&q=80',
  },
  {
    title: 'Orange',
    url:
      'https://images.unsplash.com/photo-1491466424936-e304919aada7?ixlib=rb-0.3.5&s=f03c295f3183e3a209480e2d0b8129a9&auto=format&fit=crop&w=2549&q=80',
  },
];

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
    listData: listData,
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
        </View>
      </View>
    );
  };

  _keyExtractor = (item, index) => String(item.Id);

  // _onEndReached = () => {
  //   console.log('onEndReached');
  //   this.setState(prevState => ({
  //     listData: [
  //       ...prevState.listData,
  //       {
  //         title: 'New Item',
  //         url:
  //           'https://images.unsplash.com/photo-1495277493816-4c359911b7f1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cea505d70dc1770c4dd470ff9715ac36&auto=format&fit=crop&w=2246&q=80',
  //       },
  //     ],
  //   }));
  // };

  _onRefresh = () => {
    console.log('onRefresh');
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 2000);
  };

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
              console.log(this.state.date);
            }}
            title="Go to About"
          />
        </View>
        <FlatList
          keyExtractor={this._keyExtractor}
          data={this.state.fairData}
          renderItem={this._renderItem}
          // onEndReached={this._onEndReached}
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
