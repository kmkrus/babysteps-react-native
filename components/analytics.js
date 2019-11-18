import { Analytics, Event } from 'expo-analytics';
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
  const analytics = new Analytics(CONSTANTS.ANALYTICS_ID);
 // }
  analytics.hit(new PageHit(page))
    //.then(() => console.log("Analytics Success"))
    .catch(e => console.log("**** Analytics Error: ", JSON.stringify(e.message)) );
};

export const AnalyticsAPIEvent = (category, action, label=null, value=null) => {
  // disable analytics for dev
  if (__DEV__) {
    //return null;
  }

  const analytics = new Analytics(CONSTANTS.ANALYTICS_ID);
  analytics.addCustomDimension(0, 'API');
  analytics.event(new Event(category, action, label, value))
    .then(() => {
      if (__DEV__) {
        console.log(`**** Analytics Success ${category} ${action} ****`);
      }
    })
    .catch(e => {
      console.log("**** Analytics Error: ${category} ${action} - ", JSON.stringify(e.message));
    });
};
