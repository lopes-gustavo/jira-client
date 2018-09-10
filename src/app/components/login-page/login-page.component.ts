import { Component } from '@angular/core';
import { Jira } from '../../models/jira.model';
import { SessionService } from '../../services/session.service';
import { ServerService } from '../../services/server.service';

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
	public error: string;

	constructor(private serverService: ServerService, private sessionService: SessionService) { }

	public login(form: { user: string, password: string, savePassword: boolean }) {
		const token = btoa(`${form.user}:${form.password}`);

		this.serverService.login(token).subscribe((user: Jira.Author) => {
				const currentUser = {...user, token};

				this.loginFormModel = {
					user: '',
					password: '',
					savePassword: false,
				};

				this.sessionService.setCurrentUser(currentUser, form.savePassword);
			},
			(error) => {
				switch (error.status) {
					case 401:
						this.error = 'Usuário ou senha inválido';
						break;
					case 404:
						this.error = 'Servidor não encontrado. Verifique se está conectado à VPN';
						break;
					default:
						this.error = `Erro não conhecido.\n status:${error.status}`;
				}
			},
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

}
