'use strict';

import Colors from '../constants/Colors';


var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({

  registrationInput: {
    marginBottom: 40,
  },

  registrationHeader: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },

  registrationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textColor,
    marginLeft: 20,
  },

  registrationTextInput: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  }

});
