'use strict';

import Colors from '../constants/Colors';


var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({

  registrationInput: {
    marginBottom: 40,
    marginTop: 40,
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
  },

  registrationButtonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginBottom: 40
  },

  registrationCheckBoxes: {
    marginBottom: 20
  },

  buttonSubmit: {
    width: 150,
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.green,
    borderWidth: 2,
    borderRadius: 5,
  },

  buttonCancel: {
    width: 150,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 5,
  }

});
