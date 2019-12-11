import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Actions} from 'react-native-router-flux';
import RNPickerSelect from 'react-native-picker-select';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Activity extends React.Component {
  onPress = () => {
    Actions.activityInfo({user: '花的世界'});
  };

  state = {
    area: [],
    buildingDataSource: [],
    selectAreaBuilding: [],
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

  componentDidMount() {
    this.fetchdata();
  }

  filteData = data => {
    let aimData = this.state.buildingDataSource.filter(item => {
      return data === item.city;
    });
    this.setState({
      selectAreaBuilding: aimData,
    });
  };
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
            onValueChange={value => this.setState({exhibition: value})}
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
