import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PixelRatio,
  Text,
  Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Input, Button, Card, Avatar} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
// import 'moment/locale/zh-tw';

export default class Activity extends React.Component {
  constructor(props) {
    super(props);

    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }
  state = {
    profile: '',
    avatarSource: null,
    newPwd: '',
  };

  /*------圖片上傳------*/
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

  /*-----onChange Input------*/
  onChangeName = newName => {
    this.setState({
      Name: newName,
    });
  };

  onChangePwd = newPwd => {
    this.setState({
      newPwd,
    });
  };

  /*------取得個人資料-------*/
  async getProfileData() {
    let profileData = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({
      profile: profileData,
      Name: profileData.Name,
      Avatar: profileData.Image,
    });
    if (this.state.profile.Gender === 1) {
      this.setState({
        gender: 'Male',
      });
    } else {
      this.setState({
        gender: 'Female',
      });
    }
    console.log(profileData);
  }
  componentDidMount() {
    this.getProfileData();
  }

  /*------更換名字及密碼------*/
  async changeProfile() {
    let data = {
      Id: this.state.profile.Id,
      NewPassword: this.state.newPwd,
      Name: this.state.Name,
      Gender: this.state.profile.Gender,
      Email: this.state.profile.Email,
      Password: this.state.profile.Password,
      Birth: this.state.profile.Birth,
      PasswordSalt: this.state.profile.PasswordSalt,
      Image: this.state.Avatar,
    };
    console.log(data);
    let opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    let res = await fetch(
      'https://tfa.rocket-coding.com/Member/EditMember',
      opts,
    );
    let resJson = await res.text();
    if (resJson === '修改成功') {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    }
    console.log(resJson);
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#bd83ce', '#ff9068']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          style={{
            width: '100%',
            height: '50%',
            borderBottomRightRadius: 100,
            borderBottomLeftRadius: 100,
            // justifyContent: 'space-around',
          }}
        />
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-around',
            position: 'absolute',
            top: 80,
            height: '35%',
          }}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            <View style={[styles.avatar, styles.avatarContainer]}>
              {this.state.avatarSource === null ? (
                <Avatar
                  size="xlarge"
                  rounded
                  source={{
                    uri: `https://tfa.rocket-coding.com/upfiles/images/${
                      this.state.profile.Image
                    }`,
                  }}
                  showEditButton
                  editButton={{size: 35}}
                />
              ) : (
                <Image style={styles.avatar} source={this.state.avatarSource} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={{color: 'white'}}>{this.state.gender}</Text>
          <Text style={{color: 'white'}}>
            {moment(this.state.profile.Birth).format('ll')}
          </Text>
        </View>
        <Card
          containerStyle={{
            width: '95%',
            shadowColor: 'black',
            shadowOpacity: 0.2,
            shadowRadius: 9,
            alignSelf: 'center',
            position: 'absolute',
            bottom: 30,
          }}>
          <Input
            placeholder="New name"
            leftIcon={<Icon name="ios-person" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            label="Your name"
            value={this.state.Name}
            onChangeText={this.onChangeName}
          />
          <View paddingVertical={10} />
          <Input
            placeholder="Password"
            leftIcon={<Icon name="ios-lock" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            label="Password"
            secureTextEntry={true}
            onChangeText={this.onChangePwd}
          />
          <View paddingVertical={10} />
          <Button
            onPress={async () => {
              await this.changeProfile();
            }}
            title="Change profile"
            titleStyle={{color: 'white'}}
            type="clear"
            loading={this.state.loading}
            buttonStyle={{backgroundColor: '#ff9068'}}
          />
        </Card>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },
});
