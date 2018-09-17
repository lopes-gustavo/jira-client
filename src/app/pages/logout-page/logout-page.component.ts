import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services';

@Component({
	selector: 'app-logout-page',
	templateUrl: './logout-page.component.html',
	styleUrls: ['./logout-page.component.scss']
})
export class LogoutPageComponent {

	constructor(private sessionService: SessionService, private router: Router) {
		this.logout();
	}

	private logout() {
		this.sessionService.clearCurrentUser();
		this.sessionService.clearDisclaimerAgreement();
		this.router.navigate(['/login']);
	}

}
