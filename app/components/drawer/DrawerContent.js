import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Button, Text, View, ViewPropTypes } from 'react-native';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'red',
  },
});

class DrawerContent extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  }

  static contextTypes = {
    drawer: PropTypes.object,
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Title: {this.props.title}</Text>
        <Button onPress={Actions.pop} title="Back" />
        <Button onPress={Actions.tab1} title="Tab1" />
        <Button onPress={Actions.tab2} title="Tab2" />
        <Button onPress={Actions.tab3} title="Tab3" />
      </View >
    );
  }
}

export default DrawerContent;
