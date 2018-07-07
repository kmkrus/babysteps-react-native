import CONSTANTS from '../constants';

export default checkCustomDirectories = () => {
  console.log('checkCustomDirectories');

  return new Promise( (resolve, reject) => {

    const baseDir = Expo.FileSystem.documentDirectory
    
    Expo.FileSystem.readDirectoryAsync(baseDir)
    .then( (result) => {
      
      if (CONSTANTS.REMOVE_BABYBOOK_DIRECTORY) {
        Expo.FileSystem.deleteAsync(baseDir + CONSTANTS.BABYBOOK_DIRECTORY, {idempotent: true})
      }
      if (!result.includes(CONSTANTS.BABYBOOK_DIRECTORY) || CONSTANTS.REMOVE_BABYBOOK_DIRECTORY ) {
        console.log('Create Directory: ' + CONSTANTS.BABYBOOK_DIRECTORY)
        Expo.FileSystem.makeDirectoryAsync(baseDir + CONSTANTS.BABYBOOK_DIRECTORY)
      }
 
      if (CONSTANTS.REMOVE_SIGNATURE_DIRECTORY) {
        Expo.FileSystem.deleteAsync(baseDir + CONSTANTS.SIGNATURE_DIRECTORY, {idempotent: true})
      }
      if (!result.includes(CONSTANTS.SIGNATURE_DIRECTORY) || CONSTANTS.REMOVE_SIGNATURE_DIRECTORY ) {
        console.log('Create Directory: ' + CONSTANTS.SIGNATURE_DIRECTORY)
        Expo.FileSystem.makeDirectoryAsync(baseDir + CONSTANTS.SIGNATURE_DIRECTORY)
      }

    })
    resolve(true)
  }) // return Promise ;

};