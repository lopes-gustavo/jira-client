import { Injectable } from '@angular/core';
import { Jira } from '../models';
import { Nullable } from '../types';

@Injectable({
	providedIn: 'root'
})
export class SessionService {

	currentUser: Nullable<Jira.Author>;

	constructor() {
		// Tenta buscar no local storage ou session storage.
		// Retorna o valor do local storage se existir, se não o valor do session storage.
		// Caso ambos sejam nulos, retorna nulo
		const localStorageCurrentUser = JSON.parse(localStorage.getItem('currentUser') as string);
		const sessionStorageCurrentUser = JSON.parse(sessionStorage.getItem('currentUser') as string);

		this.currentUser = localStorageCurrentUser || sessionStorageCurrentUser;
	}

	public setCurrentUser(user: Jira.Author, preserveSession: boolean): void {
		if (preserveSession) {
			localStorage.setItem('currentUser', JSON.stringify(user));
			sessionStorage.removeItem('currentUser');
		} else {
			sessionStorage.setItem('currentUser', JSON.stringify(user));
			localStorage.removeItem('currentUser');
		}

		this.currentUser = user;
	}

	public clearCurrentUser(): void {
		localStorage.removeItem('currentUser');
		sessionStorage.removeItem('currentUser');

		this.currentUser = null;
	}

	public isDisclaimerAgreed(): boolean {
		return sessionStorage.getItem('disclaimer') === 'true';
	}

	public saveDisclaimerAgreement() {
		sessionStorage.setItem('disclaimer', 'true');
	}

	public clearDisclaimerAgreement() {
		sessionStorage.removeItem('disclaimer');
	}

	public saveServerUrl(serverUrl: string) {
		sessionStorage.setItem('serverUrl', serverUrl);
	}

	public getServerUrl() {
		const serverUrl = sessionStorage.getItem('serverUrl');
		if (!serverUrl) {
			throw new Error('serverUrl not defined');
		}

		return serverUrl;
	}

	public clearServerUrl() {
		sessionStorage.removeItem('serverUrl');
	}

}
