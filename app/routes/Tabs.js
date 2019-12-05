import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Router, Stack, Scene, Tabs} from 'react-native-router-flux';
import ActivityIcon from '../components/ActivityIcon';
import RestaurantIcon from '../components/RestaurantIcon';
import FavoriteIcon from '../components/FavoriteIcon';
import ProfileIcon from '../components/ProfileIcon';
import TabHome from '../screens/TabHome';
import About from '../screens/About';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    backgroundColor: '#EFEEF5',
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#DFDEE5',
  },
  titleStyle: {
    color: 'white',
  },
});

export default class Routes extends Component {
  render() {
    return (
      <Router>
        <Stack key="root" navigationBarStyle={{backgroundColor: 'skyblue'}}>
          {/* <Scene key="login" /> */}
          <Tabs
            hideNavBar={true}
            key="tabbar"
            showLabel={false}
            tabBarStyle={styles.tabBarStyle}
            // activeBackgroundColor="#56C7FF"
            inactiveBackgroundColor="#DDD"
            tabBarPosition="bottom" // default 'bottom' on ios, 'top' on android
          >
            <Stack
              key="tab1"
              // title="Tab #1"
              tabBarLabel="TAB #1"
              icon={ActivityIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab1"
              navigationBarStyle={{backgroundColor: 'pink'}}>
              <Scene key="tab1_home" component={TabHome} />
              <Scene key="tab1_about" component={About} title="tab1_about" />
            </Stack>
            <Stack
              key="tab2"
              // title="Tab #2"
              tabBarLabel="TAB #2"
              icon={RestaurantIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab2"
              navigationBarStyle={{backgroundColor: 'orange'}}>
              <Scene key="tab2_home" component={TabHome} />
              <Scene key="tab2_about" component={About} title="tab2_about" />
            </Stack>
            <Stack
              key="tab3"
              // title="Tab #3"
              tabBarLabel="TAB #3"
              icon={FavoriteIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab3">
              <Scene key="tab3_home" component={TabHome} />
              <Scene key="tab3_about" component={About} title="tab3_about" />
            </Stack>
            <Stack
              key="profile"
              // title="個人頁"
              tabBarLabel="個人頁"
              icon={ProfileIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab4"
              navigationBarStyle={{backgroundColor: 'green'}}>
              <Scene key="tab3_home" component={TabHome} />
              <Scene key="tab3_about" component={About} title="tab3_about" />
            </Stack>
          </Tabs>
        </Stack>
      </Router>
    );
  }
}
