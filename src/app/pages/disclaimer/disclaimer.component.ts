import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services';
import { BrowserService, IBrowser } from '../../services';

@Component({
	selector: 'app-disclaimer',
	templateUrl: './disclaimer.component.html',
	styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent {
	currentBrowser: IBrowser;

	constructor(
		private router: Router,
		private sessionService: SessionService,
		browser: BrowserService,
	) {

		if (this.sessionService.isDisclaimerAgreed()) {
			this.router.navigate(['/']);
		}

		this.currentBrowser = browser.current;

	}

	onAgreeButtonClick() {
		this.sessionService.saveDisclaimerAgreement();
		this.router.navigate(['/']);
	}
}
