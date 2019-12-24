import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
  Image,
  PixelRatio,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Home extends React.Component {
  /** For Drawer Sample
  componentDidMount() {
    Actions.drawerOpen();
  }
  */
  constructor(props) {
    super(props);

    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  state = {
    date: new Date(),
    mode: 'date',
    show: false,
    exhibition: '',
    avatarSource: null,
  };

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  // setDate = (event, date) => {
  //   date = date || this.state.date;

  //   this.setState({
  //     show: Platform.OS === 'ios' ? true : false,
  //     date,
  //   });
  // };

  // show = mode => {
  //   this.setState({
  //     show: true,
  //     mode,
  //   });
  // };

  // unShow = mode => {
  //   this.setState({
  //     show: false,
  //     mode,
  //   });
  // };

  // datepicker = () => {
  //   this.show('date');
  // };

  // timepicker = () => {
  //   this.show('time');
  // };

  // onPress = () => {
  //   Actions[this.props.keyPrefix + '_about']({
  //     user: 'dmoon',
  //   });
  // };

  render() {
    const {show, date, mode} = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View
            style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            {this.state.avatarSource === null ? (
              <Text>Select a Photo</Text>
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource} />
            )}
          </View>
        </TouchableOpacity>
        {/* <Text style={styles.welcome}>Welcome {this.props.title}</Text>
        <Button onPress={this.onPress} title="Go to About" />
        <Button title="Back" onPress={Actions.pop} />

        <View style={{width: '100%'}}>
          <View>
            <Button onPress={this.datepicker} title="Show date picker!" />
          </View>
          <View>
            <Button onPress={this.timepicker} title="Show time picker!" />
          </View>
          {show && (
            <DateTimePicker
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={this.setDate}
            />
          )}
          <Button title={'確定'} onPress={this.unShow} />
        </View>
        <View paddingVertical={20} />
        <Text>{this.state.exhibition}</Text>
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
              top: 10,
              right: 12,
            },
          }}
          Icon={() => {
            return <Icon name="md-arrow-down" size={24} color="gray" />;
          }}
        /> */}
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
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
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
