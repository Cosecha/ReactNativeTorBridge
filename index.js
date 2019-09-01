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
		console.log("this is probably an error message: " + dataString)
	}

}
/*
var TorURLDownloaderX = NativeModules.TorURLDownloader.getInstance();
console.log("@@@@@@@@@@@@@@@@@")
console.log("TYPE: " + typeof(NativeModules.TorURLDownloader))
console.log("keys: " + Object.keys(NativeModules.TorURLDownloader))
console.log("!!!!!!!!!!!!!!!!!")
console.log("wtf is ? " + TorURLDownloaderX.connect)
console.log("and, waht is ? " + TorURLDownloaderX.download)
TorURLDownloaderX.connect() // unnecessary, just testing
TorURLDownloaderX.download('https://check.torproject.org', downloadCallback);
*/
var TorURLDownloaderX = NativeModules.ShittyTorURLDownloader
console.log("@@@@@@@@@@@@@@@@@")
console.log("TYPE: " + typeof(NativeModules.ShittyTorURLDownloader))
console.log("keys: " + Object.keys(NativeModules.ShittyTorURLDownloader))
console.log("!!!!!!!!!!!!!!!!!")
console.log("and, waht is ? " + TorURLDownloaderX.download)
TorURLDownloaderX.download('https://check.torproject.org', downloadCallback);
