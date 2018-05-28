import axios from "axios";
import CONSTANTS from '../constants';

Fulfilled = ( type, response ) => {
  return {
    type,
    response: response
  }
}
Rejected = ( type, error ) => {
  return {
    type,
    response: error
  }
}

export const Api = (event, action) => {
  console.log( event );
  console.log( action );

  const headers = {
    'ACCESS-TOKEN': '', //event.auth.accessToken,
    'TOKEN-TYPE': 'Bearer',
    'CLIENT': '', //event.auth.client,
    'UID': '', //event.auth.uid,
  }
  return ( 
    
    axios({
      method: event.method,
      responseType: 'json',
      baseURL: CONSTANTS.BASE_URL,
      url: event.url,
      headers: headers,
      data: event.payload,
    })
    //.then(function (response) {
      //console.log(response);
      //dispatch( Fulfilled(API_CREATE_USER_FULFILLED, response) );
    //})
    //.catch(function (error) {
      //console.log(error);
      //dispatch( Rejected(API_CREATE_USER_REJECTED, error) );
    //})
  
  ) 
};

