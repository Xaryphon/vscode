/*
   Copyright 2020 AryToNeX

   Licensed under the Apache License, Version 2.0 (the 'License');
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

	   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an 'AS IS' BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

//@ts-check
'use strict';

const electron = require('electron');
const glasstron = require('glasstron');
const cssloader = require('./cssloader');
const config = require('./cssloader_config');

/*
 * The BrowserWindow override class
 */
class BrowserWindow extends electron.BrowserWindow {
	// @ts-ignore
	constructor(options) {
		if (process.platform !== 'win32') {
			options.transparent = true;
		}
		options.backgroundColor = '#00000000';

		// We do not call super to get an actual BrowserWindow from electron and not mess with native casts (broke GTK modals)
		const window = new glasstron.BrowserWindow(options);

		if (config.valid) {
			Object.assign(window, config.winprops);
			if (config.blur)
				window.setBlur(true);
		}
		else {
			console.log(config.error_message);
		}

		cssloader.inject(window);
		return window;
	}
}

module.exports = BrowserWindow;
