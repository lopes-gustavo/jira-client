import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserService, IBrowser, ServerService, SessionService } from '../../services';
import { Jira } from '../../models';
import { Nullable } from '../../types';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
	public loginFormModel = new LoginFormModel();
	public error: Nullable<HttpErrorResponse>;
	currentBrowser: IBrowser;

	constructor(
		private serverService: ServerService,
		private sessionService: SessionService,
		private router: Router,
		browser: BrowserService
	) {

		// Se já está logado, redireciona para página principal
		if (this.sessionService.currentUser) {
			this.router.navigate(['/']);
		}

		this.currentBrowser = browser.current;
	}

	login(form: LoginFormModel) {
		this.error = null;

		const token = btoa(`${form.user}:${form.password}`);

		this.serverService.login(token, form.server).subscribe(
			(user: Jira.Author) => {
				const currentUser = {...user, token};

				this.loginFormModel.clear();

				this.sessionService.setCurrentUser(currentUser, form.savePassword);

				this.sessionService.saveServerUrl(form.server);

				this.router.navigate(['/']);
			},
			(error) => this.error = error,
		);

	}

	clearDisclaimerAgreement() {
		this.sessionService.clearDisclaimerAgreement();
	}
}

class LoginFormModel {
	user: string;
	password: string;
	server: string;
	savePassword: boolean;

	public clear() {
		this.user = '';
		this.password = '';
		this.server = '';
		this.savePassword = false;
	}
}
