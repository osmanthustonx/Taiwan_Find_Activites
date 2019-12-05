import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Router, Stack, Scene, Tabs} from 'react-native-router-flux';

/*------ICON------*/
import ActivityIcon from '../components/ActivityIcon';
import RestaurantIcon from '../components/RestaurantIcon';
import FavoriteIcon from '../components/FavoriteIcon';
import ProfileIcon from '../components/ProfileIcon';

/*------頁面------*/
import TabHome from '../screens/TabHome';
import About from '../screens/About';
import Activity from '../screens/Activity';
import ActivityInfo from '../screens/ActivityInfo';
import Restaurant from '../screens/Restaurant';
import Favorite from '../screens/Favorite';
import Profile from '../screens/Profile';

export default class Routes extends Component {
  render() {
    return (
      <Router>
        <Stack key="root" navigationBarStyle={{backgroundColor: 'skyblue'}}>
          {/* <Scene key="login" /> */}
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
              keyPrefix="tab1"
              navigationBarStyle={{backgroundColor: 'pink'}}>
              <Scene key="activity" component={Activity} title="最新活動" />
              <Scene
                key="activityInfo"
                component={ActivityInfo}
                title="活動名稱"
              />
            </Stack>
            <Stack
              key="tab2"
              tabBarLabel="附近美食"
              icon={RestaurantIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab2"
              navigationBarStyle={{backgroundColor: 'orange'}}>
              <Scene key="restaurant" component={Restaurant} title="附近美食" />
            </Stack>
            <Stack
              key="tab3"
              tabBarLabel="我的收藏"
              icon={FavoriteIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab3">
              <Scene key="favorite" component={Favorite} title="我的收藏" />
              <Scene
                key="activityInfo"
                component={ActivityInfo}
                title="活動名稱"
              />
            </Stack>
            <Stack
              key="profile"
              tabBarLabel="個人頁面"
              icon={ProfileIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab4"
              navigationBarStyle={{backgroundColor: 'green'}}>
              <Scene key="profile" component={Profile} title="個人頁面" />
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
