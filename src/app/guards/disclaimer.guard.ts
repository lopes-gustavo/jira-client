import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../services';

@Injectable({
	providedIn: 'root'
})
export class DisclaimerGuard implements CanActivate {
	constructor(private router: Router, private sessionService: SessionService) {
	}

	canActivate(): boolean {
		const isDisclaimerOk = this.sessionService.isDisclaimerAgreed();

		if (!isDisclaimerOk) {
			this.router.navigate(['/disclaimer']);
			return false;
		}

		return true;
	}
}
