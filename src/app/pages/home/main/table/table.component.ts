import { Component, Input } from '@angular/core';
import clipboard from "clipboard-polyfill";

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent {
	@Input('title') title: string;
	@Input('condition') condition: boolean;

	copy(id: string) {
		// console.log(clipboard);

		// const el = document.getElementById(id) as Node;
		const str = document.getElementById(id).innerHTML;
		/*
		let range;
		let sel;

		if (document.createRange && window.getSelection) {
			range = document.createRange();
			sel = window.getSelection();
			sel.removeAllRanges();
			try {
				range.selectNodeContents(el);
				sel.addRange(range);
			} catch (e) {
				range.selectNode(el);
				sel.addRange(range);
			}
			document.execCommand("Copy");
			sel.removeAllRanges();
		}
*/

			function listener(e) {
				console.log(str);

				e.clipboardData.setData("text/html", str);
				// e.clipboardData.setData("text/plain", str);
				e.preventDefault();
			}
			document.addEventListener("copy", listener);
			document.execCommand("copy");
			document.removeEventListener("copy", listener);
	}
}
