import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Router, Stack, Scene, Tabs} from 'react-native-router-flux';
import TabIcon from '../components/TabIcon';
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
    backgroundColor: '#eee',
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#ddd',
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
          <Tabs
            hideNavBar
            key="tabbar"
            showLabel={false}
            tabBarStyle={styles.tabBarStyle}
            activeBackgroundColor="rgba(0,100,250,.2)"
            inactiveBackgroundColor="#DDD"
            tabBarPosition="bottom" // default 'bottom' on ios, 'top' on android
          >
            <Stack
              key="tab1"
              title="Tab #1"
              tabBarLabel="TAB #1"
              icon={TabIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab1">
              <Scene key="tab1_home" component={TabHome} />
              <Scene key="tab1_about" component={About} title="tab1_about" />
            </Stack>
            <Stack
              key="tab2"
              title="Tab #2"
              tabBarLabel="TAB #2"
              icon={TabIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab2">
              <Scene key="tab2_home" component={TabHome} />
              <Scene key="tab2_about" component={About} title="tab2_about" />
            </Stack>
            <Stack
              key="tab3"
              title="Tab #3"
              tabBarLabel="TAB #3"
              icon={TabIcon}
              titleStyle={styles.titleStyle}
              keyPrefix="tab3">
              <Scene key="tab3_home" component={TabHome} />
              <Scene key="tab3_about" component={About} title="tab3_about" />
            </Stack>
          </Tabs>
        </Stack>
      </Router>
    );
  }
}
