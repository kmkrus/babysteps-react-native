import { Analytics, Event } from 'expo-analytics';
import Constants from 'expo-constants';
import CONSTANTS from '../constants';

export const AnalyticsPageHit = page => {
  // disable analytics for dev
  if (__DEV__) {
    console.log(`**** Analytics ${page} ****`);
    //return null;
  }
  //et analytics = new Analytics('UA-55206086-1');
  // for testing on dev
  //if (__DEV__) {
  //const analytics = new Analytics('UA-55206086-1', null, { debug: true });
  const analyticsID = Constants.manifest.extra.analyticsID;
  const analytics = new Analytics(analyticsID);
 // }
  analytics.hit(new PageHit(page))
    //.then(() => console.log("Analytics (success)"))
    .catch(e => console.log("**** Analytics (error) ", JSON.stringify(e.message)) );
};

export const AnalyticsEvent = (category, action, label=null, value=null) => {
  // disable analytics for dev
  if (__DEV__) {
    //return null;
  }

  const analyticsID = Constants.manifest.extra.analyticsID;
  const analytics = new Analytics(analyticsID);

  analytics.event(new Event(category, action, label, value))
    .then(() => {
      if (__DEV__) {
        console.log(`**** Analytics (success) - Category: ${category}, Action: ${action}, Label: ${label}, Value: ${value} - ****`);
      }
    })
    .catch(e => {
      console.log(`**** Analytics (error) - Category: ${category}, Action: ${action}, Label: ${label}, Value: ${value} - `, JSON.stringify(e.message));
    });
};
