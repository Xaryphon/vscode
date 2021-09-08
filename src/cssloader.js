/*
 *  Copyright (c) 2021 Xaryphon
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

//@ts-check
'use strict';

const config = require('./cssloader_config');

function _executeInRenderer(webContents, method, ...params) {
	if (method.name.length !== 0)
		method = method.toString().replace(method.name, "function").replace("function function", "function");
	else method = method.toString();
	return webContents.executeJavaScript(`(${method})(...${JSON.stringify(params)});`);
}

function _loadCss(win, config) {
	if (!config.valid) {
		console.log(config.error_message);
		return;
	}
	if (typeof win._customcss === "undefined") {
		win._customcss = document.createElement("link");
		win._customcss.id = "custom-css";
		win._customcss.rel = "stylesheet";
		win._customcss.href = config.csspath;
		document.head.appendChild(win._customcss);
		console.log("[CSSLoader] Loaded", config.csspath);
	}
}

function _injectCss(win) {
	_executeInRenderer(win.webContents, _loadCss, win, config);
}

module.exports.inject = function (win) {
	//const cssPath = path.join(app.getPath('userData'), 'extensions', 'cssloader.css');
	//const cssPath = path.resolve("/home/xaryphon/.vscode-oss-dev/extensions/cssloader.css");
	win.webContents.on("dom-ready", () => { _injectCss(win); });
}
