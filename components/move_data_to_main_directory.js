import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

import CONSTANTS from '../constants';

export default moveDataToMainDirectory = () => {
  console.log('moveDataToMainDirectory');

  return new Promise((resolve, reject) => {
    const baseDir = FileSystem.documentDirectory;
    console.log(baseDir);
    if (baseDir.includes('pzupan')) {
      console.log('found pzupan');
    }

    const url = baseDir + CONSTANTS.SIGNATURE_DIRECTORY + '/' + 'signature.png';
    console.log('url: ', url);

    FileSystem.getInfoAsync( url )
      .then( result => {
        if (result.exists) {
          console.log('result.uri: ', result.uri)

          //const asset = await MediaLibrary.createAssetAsync(uri);
          
          MediaLibrary.createAlbumAsync({title: 'Expo', uri: result.uri})
            .then(() => {
              console.log('Album created!');
            })
            .catch(error => {
              console.log('MediaLibrary Error: ', error);
            });
        } else {
          console.log('File not found: ', url);
        }
      })
      .catch(error => {
        console.log('FileSystem Error: ', error);
      })

    //const subDir = baseDir.slice(0, baseDir.indexOf('Data/') + 4);
    //console.log('subDir: ', subDir);

    //FileSystem.getInfoAsync(subDir).then(result => {
      //console.log('getInfo: ', result);
    //});

    FileSystem.readDirectoryAsync(baseDir).then(result => {

      if (CONSTANTS.REMOVE_BABYBOOK_DIRECTORY) {
        console.log('Remove Directory: ' + CONSTANTS.BABYBOOK_DIRECTORY);
        FileSystem.deleteAsync(baseDir + CONSTANTS.BABYBOOK_DIRECTORY, {idempotent: true})
      }
      if (!result.includes(CONSTANTS.BABYBOOK_DIRECTORY) || CONSTANTS.REMOVE_BABYBOOK_DIRECTORY ) {
        console.log('Create Directory: ' + CONSTANTS.BABYBOOK_DIRECTORY);
        FileSystem.makeDirectoryAsync(baseDir + CONSTANTS.BABYBOOK_DIRECTORY);
      }

    });
    resolve(true);
  }); // return Promise ;
};