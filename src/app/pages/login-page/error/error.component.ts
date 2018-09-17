import { Component, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionService } from '../../../services';

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html',
	styleUrls: ['./error.component.css']
})
export class ErrorComponent {
	isGenericError = false;
	displayError: string;

	constructor(private sessionService: SessionService) {
	}

	@Input('error')
	set error(error: HttpErrorResponse) {

		this.isGenericError = false;

		if (error.message === 'Http failure response for (unknown url): 0 Unknown Error') {
			this.isGenericError = true;
			this.displayError = '';
		}

		switch (error.status) {
			case 401:
				this.displayError = 'Usuário ou senha inválido';
				break;
			default:
				this.displayError = `Erro não conhecido.\n status:${error.status}`;
				break;
		}

	}

	clearDisclaimerAgreement() {
		this.sessionService.clearDisclaimerAgreement();
	}
}
