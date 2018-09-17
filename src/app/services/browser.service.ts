import { Injectable } from '@angular/core';
import { KeyValue } from '../types';

@Injectable({
	providedIn: 'root'
})
export class BrowserService {

	constructor() {
	}

	public get current(): IBrowser {
		// @ts-ignore
		const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

		// Firefox 1.0+
		// @ts-ignore
		const isFirefox = typeof InstallTrigger !== 'undefined';

		// Safari 3.0+ "[object HTMLElementConstructor]"
		// @ts-ignore
		const isSafari = /constructor/i.test(window.HTMLElement) || ((p) => {
			return p.toString() === '[object SafariRemoteNotification]';
			// @ts-ignore
		})(!window['safari'] || safari.pushNotification);

		// Internet Explorer 6-11
		// @ts-ignore
		// noinspection PointlessBooleanExpressionJS
		const isIE = /*@cc_on!@*/false || !!document.documentMode;

		// Edge 20+
		// @ts-ignore
		const isEdge = !isIE && !!window.StyleMedia;

		// Chrome 1+
		// @ts-ignore
		const isChrome = !!window.chrome && !!window.chrome.webstore;

		// Blink engine detection
		// @ts-ignore
		const isBlink = (isChrome || isOpera) && !!window.CSS;

		if (isOpera) {
			return Browsers.Opera;
		}
		if (isFirefox) {
			return Browsers.Firefox;
		}
		if (isSafari) {
			return Browsers.Safari;
		}
		if (isIE) {
			return Browsers.IE;
		}
		if (isEdge) {
			return Browsers.Edge;
		}
		if (isChrome) {
			return Browsers.Chrome;
		}
		if (isBlink) {
			return Browsers.Blink;
		}
		return {name: ''};
	}
}

const Browsers: KeyValue<IBrowser> = {
	Opera: {name: 'Opera'},
	Firefox: {
		name: 'Firefox',
		extensionUrl: 'https://addons.mozilla.org/en-US/firefox/addon/cross-domain-cors/',
		extensionPattern: 'jira.produbanbr.corp',
	},
	Safari: {name: 'Safari'},
	IE: {name: 'IE'},
	Edge: {name: 'Edge'},
	Chrome: {
		name: 'Chrome',
		extensionUrl: 'https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi',
		extensionPattern: 'http://jira.produbanbr.corp/*',
	},
	Blink: {name: 'Blink'},
};

export interface IBrowser {
	name: string;
	extensionUrl?: string;
	extensionPattern?: string;
}
