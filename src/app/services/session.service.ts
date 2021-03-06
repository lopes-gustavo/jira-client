import { Injectable } from '@angular/core';
import { Jira } from '../models';
import { Nullable } from '../types';

const STORAGE_SERVER_URL = 'serverUrl';
const STORAGE_CURRENT_USER = 'currentUser';
const STORAGE_DISCLAIMER = 'disclaimer';
const STORAGE_PROJECT = 'project';

@Injectable({
	providedIn: 'root'
})
export class SessionService {

	private _currentUser: Nullable<Jira.Author> = null;

	constructor() {
		// Tenta buscar no local storage ou session storage.
		// Retorna o valor do local storage se existir, se não o valor do session storage.
		// Caso ambos sejam nulos, retorna nulo
		const localStorageCurrentUser = JSON.parse(localStorage.getItem(STORAGE_CURRENT_USER) as string);
		const sessionStorageCurrentUser = JSON.parse(sessionStorage.getItem(STORAGE_CURRENT_USER) as string);

		this._currentUser = localStorageCurrentUser || sessionStorageCurrentUser;
	}

	public get currentUser(): Nullable<Jira.Author> {
		return this._currentUser;
	}

	public get serverUrl() {
		const serverUrl = sessionStorage.getItem(STORAGE_SERVER_URL);
		if (!serverUrl) {
			return '';
		}

		return serverUrl;
	}

	public get project() {
		const project = sessionStorage.getItem(STORAGE_PROJECT);
		if (!project) {
			return '';
		}

		return project;
	}

	public setCurrentUser(user: Jira.Author, preserveSession: boolean): void {
		if (preserveSession) {
			localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(user));
			sessionStorage.removeItem(STORAGE_CURRENT_USER);
		} else {
			sessionStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(user));
			localStorage.removeItem(STORAGE_CURRENT_USER);
		}

		this._currentUser = user;
	}

	public clearCurrentUser(): void {
		localStorage.removeItem(STORAGE_CURRENT_USER);
		sessionStorage.removeItem(STORAGE_CURRENT_USER);

		this._currentUser = null;
	}

	public isDisclaimerAgreed(): boolean {
		return sessionStorage.getItem(STORAGE_DISCLAIMER) === 'true';
	}

	public saveDisclaimerAgreement() {
		sessionStorage.setItem(STORAGE_DISCLAIMER, 'true');
	}

	public clearDisclaimerAgreement() {
		sessionStorage.removeItem(STORAGE_DISCLAIMER);
	}

	public saveServerUrl(serverUrl: string) {
		sessionStorage.setItem(STORAGE_SERVER_URL, serverUrl);
	}

	public clearServerUrl() {
		sessionStorage.removeItem(STORAGE_SERVER_URL);
	}

	public saveProjectName(projectName: string) {
		sessionStorage.setItem(STORAGE_PROJECT, projectName);
	}
}
