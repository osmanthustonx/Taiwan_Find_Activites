import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const propTypes = {
  focused: PropTypes.bool,
  title: PropTypes.string,
};

const ProfileIcon = props => {
  return (
    <Text style={{color: props.focused ? '#ff9068' : 'black'}}>
      <Icon name="ios-person" size={30} />
      {props.title}
    </Text>
  );
};

ProfileIcon.propTypes = propTypes;

export default ProfileIcon;
