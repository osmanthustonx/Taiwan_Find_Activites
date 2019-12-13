import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Router, Stack, Scene, Tabs} from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';

/*------ICON------*/
import ActivityIcon from '../components/ActivityIcon';
import RestaurantIcon from '../components/RestaurantIcon';
import FavoriteIcon from '../components/FavoriteIcon';
import ProfileIcon from '../components/ProfileIcon';

/*------頁面------*/
import TabHome from '../screens/TabHome';
import About from '../screens/About';
import Login from '../screens/Login';
import Registration from '../screens/Registration';
import Activity from '../screens/Activity';
import ActivityInfo from '../screens/ActivityInfo';
import Restaurant from '../screens/Restaurant';
import Favorite from '../screens/Favorite';
import Profile from '../screens/Profile';

export default class Routes extends Component {
  state = {
    isLoginShow: true,
  };
  leftLogin() {
    this.setState({
      isLoginShow: false,
    });
    console.log('離開');
    console.log(this.state.isLoginShow);
  }

  render() {
    return (
      <Router>
        <Stack key="root">
          {this.state.isLoginShow && (
            <Stack hideNavBar={true}>
              <Scene
                key="login"
                component={Login}
                title="登入"
                onExit={() => {
                  this.leftLogin();
                }}
              />
              <Scene
                hideNavBar={false}
                key="registered"
                component={Registration}
                title="註冊"
              />
            </Stack>
          )}

          <Tabs
            hideNavBar={true}
            key="tabbar" // 在 Tabs 的 key(tabbar) 可以讓 login 完之後，可以透過 action.tabbar，讓你的應用切換到這個 tabbar 的場景當中
            tabBarStyle={styles.tabBarStyle}
            // activeBackgroundColor="#56C7FF"
            // inactiveBackgroundColor="#DFDEE5"
            tabBarPosition="bottom" // default 'bottom' on ios, 'top' on android
          >
            <Stack
              key="tab1"
              tabBarLabel="活動"
              icon={ActivityIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab1">
              <Scene
                key="activity"
                component={Activity}
                title="最新活動"
                titleStyle={{color: 'black'}}
                onEnter={() => {
                  this.leftLogin();
                }}
              />
              <Scene
                key="activityInfo"
                component={ActivityInfo}
                title="活動名稱"
                titleStyle={{color: 'black'}}
              />
            </Stack>
            <Stack
              key="tab2"
              tabBarLabel="附近美食"
              icon={RestaurantIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab2">
              <Scene
                key="restaurant"
                component={Restaurant}
                title="附近美食"
                titleStyle={{color: 'black'}}
              />
            </Stack>
            <Stack
              key="tab3"
              tabBarLabel="我的收藏"
              icon={FavoriteIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab3">
              <Scene
                key="favorite"
                component={Favorite}
                title="我的收藏"
                titleStyle={{color: 'black'}}
              />
              <Scene
                key="activityInfo"
                component={ActivityInfo}
                title="活動名稱"
                titleStyle={{color: 'black'}}
              />
            </Stack>
            <Stack
              key="profile"
              tabBarLabel="個人頁面"
              icon={ProfileIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab4">
              <Scene
                key="profile"
                component={Profile}
                title="個人頁面"
                titleStyle={{color: 'black'}}
              />
            </Stack>
          </Tabs>
        </Stack>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // tabBarStyle: {
  //   backgroundColor: '#EFEEF5',
  // },
  // tabBarSelectedItemStyle: {
  //   backgroundColor: '#DFDEE5',
  // },
  titleStyle: {
    color: 'white',
  },
});
