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
	public loginFormModel = {
		user: '',
		password: '',
		savePassword: false,
	};
	public error: Nullable<HttpErrorResponse>;
	currentBrowser: IBrowser;

	constructor(
		private serverService: ServerService,
		private sessionService: SessionService,
		private router: Router,
		browser: BrowserService
	) {

		// Se já está logado, redireciona para página principal
		if (this.sessionService.currentUserSnapshot) {
			this.router.navigate(['/']);
		}

		this.currentBrowser = browser.current;
	}

	login(form: { user: string, password: string, savePassword: boolean }) {
		this.error = null;

		const token = btoa(`${form.user}:${form.password}`);

		this.serverService.login(token).subscribe(
			(user: Jira.Author) => {
				const currentUser = {...user, token};

				this.loginFormModel = {
					user: '',
					password: '',
					savePassword: false,
				};

				this.sessionService.setCurrentUser(currentUser, form.savePassword);

				this.router.navigate(['/']);
			},
			(error) => this.error = error,
		);

		// this._getLogin((user: Jira.Author) => {
		// 	const currentUser = {...user, token};
		//
		// 	this.loginFormModel = {
		// 		user: '',
		// 		password: '',
		// 		savePassword: false,
		// 	};
		//
		// 	this.sessionService.setCurrentUser(currentUser, form.savePassword);
		// });

	}

	// TODO: Remover esse método
	/*
	 private _getLogin(f: (user: Jira.Author) => void): void {
	 f(new class implements Jira.Author {
	 avatarUrls: Jira.AvatarUrls;
	 self: string;
	 timeZone: string;
	 active: boolean = true;
	 displayName: string = 'mDisplayName';
	 emailAddress: string = 'mEmailAddress';
	 key: string = 'mKey';
	 name: string = 'mName';
	 token: string = 'mToken';
	 });
	 }
	 */

	clearDisclaimerAgreement() {
		this.sessionService.clearDisclaimerAgreement();
	}
}
