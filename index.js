/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {NativeModules} from 'react-native';

AppRegistry.registerComponent(appName, () => App);

function downloadCallback(success, dataString) {
	if (success) {
		console.log(dataString)
	} else {
		console.log("not success =(")
	}

}

var TorURLDownloaderX = NativeModules.TorURLDownloader;
console.log("@@@@@@@@@@@@@@@@@")
console.log("keys: " + Object.keys(TorURLDownloaderX))
console.log("!!!!!!!!!!!!!!!!!")
console.log("wtf is ? " + TorURLDownloaderX.connect)
console.log("and, waht is ? " + TorURLDownloaderX.download)
TorURLDownloaderX.connect()
TorURLDownloaderX.download('https://check.torproject.org', downloadCallback);

