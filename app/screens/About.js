import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';

import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import {Card} from 'react-native-elements';
import {Rating} from 'react-native-ratings';

const utcDateToString = (momentInUTC: moment): string => {
  let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  // console.warn(s);
  return s;
};

export default class About extends React.Component {
  ratingCompleted(rating) {
    console.log(`Rating is: ${rating}`);
  }
  render() {
    const nowUTC = moment.utc();
    return (
      <View style={styles.container}>
        <Card title="WITH FRACTIONS" containerStyle={styles.card}>
          <Rating
            showRating={true}
            fractions={1}
            ratingTextColor="teal"
            onStartRating={() => console.log('started rating')}
          />
        </Card>
        <Text style={styles.welcome}>About {this.props.user}</Text>
        <Text>
          date:{' '}
          {moment
            .utc(nowUTC)
            .local()
            .format('lll')}
        </Text>

        <Button
          onPress={() => {
            About.addToCalendar(this.props.user, nowUTC);
          }}
          title="Add to calendar"
        />

        <Button onPress={Actions.pop} title="Back" />
      </View>
    );
  }
  static addToCalendar = (title, startDateUTC) => {
    const eventConfig = {
      title,
      startDate: utcDateToString(startDateUTC),
      endDate: utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
      notes: 'dddddd!',
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
        // These are two different identifiers on iOS.
        // On Android, where they are both equal and represent the event id, also strings.
        // when { action: 'CANCELED' } is returned, the dialog was dismissed
        console.warn(JSON.stringify(eventInfo));
      })
      .catch(error => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };
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
});
