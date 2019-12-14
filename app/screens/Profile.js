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

export default class Activity extends React.Component {
  constructor(props) {
    super(props);

    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }
  state = {
    profile: '',
    avatarSource: null,
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

  /*------取得個人資料-------*/
  async getProfileData() {
    let profileData = await AsyncStorage.getItem('userData');
    this.setState({
      profile: JSON.parse(profileData),
    });
    console.log(this.state.profile);
  }
  componentDidMount() {
    this.getProfileData();
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
        <TouchableOpacity
          onPress={this.selectPhotoTapped.bind(this)}
          style={{alignSelf: 'center', position: 'absolute', top: 100}}>
          <View style={[styles.avatar, styles.avatarContainer]}>
            {this.state.avatarSource === null ? (
              <Avatar
                size="xlarge"
                rounded
                source={{
                  uri:
                    '/Users/sunbu/Desktop/RocketFinalProject/Project/app/assets/girlAvatar.png',
                }}
                showEditButton
              />
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource} />
            )}
          </View>
        </TouchableOpacity>
        <Card
          containerStyle={{
            width: '95%',
            shadowColor: 'black',
            shadowOffset: {width: 5, height: 5},
            shadowOpacity: 0.2,
            alignSelf: 'center',
            position: 'absolute',
            bottom: 30,
          }}>
          <Input
            placeholder="example@address.com"
            leftIcon={<Icon name="ios-mail" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            errorMessage={this.state.emailErrorMsg}
            onChangeText={this.onChangeLoginEmail}
            label="Your email address"
          />
          <View paddingVertical={10} />
          <Input
            placeholder="Password"
            leftIcon={<Icon name="ios-lock" size={24} color="#35477d" />}
            leftIconContainerStyle={{paddingRight: 10}}
            errorMessage={this.state.fieldPwdErrorMsg}
            onChangeText={this.onChangeLoginPassword}
            label="Password"
            secureTextEntry={true}
          />
          <View paddingVertical={10} />
          <Button
            onPress={() => {
              this.goLogin();
            }}
            title="Login"
            titleStyle={{color: 'white'}}
            type="clear"
            loading={this.state.loading}
            buttonStyle={{backgroundColor: '#ff9068'}}
          />
          <View paddingVertical={5} />
          <Text
            style={{alignSelf: 'center', color: '#CDD6DA'}}
            onPress={() => console.log('忘記密碼了ＱＱ')}>
            Forget Password ?
          </Text>
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
