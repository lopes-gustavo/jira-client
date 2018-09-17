import { Component } from '@angular/core';
import { SessionService } from '../../services';
import { Router } from '@angular/router';
import { BrowserService, IBrowser } from '../../services/browser.service';

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
