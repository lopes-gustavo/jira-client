import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Jira } from '../models';
import { Nullable } from '../types';

@Injectable({
	providedIn: 'root'
})
export class SessionService {

	private currentUserSource = new BehaviorSubject<Nullable<Jira.Author>>(null);

	currentUser = this.currentUserSource.asObservable();
	get currentUserSnapshot() { return this.currentUserSource.getValue(); }

	constructor() {
		// Tenta buscar no local storage ou session storage.
		// Retorna o valor do local storage se existir, se não o valor do session storage.
		// Caso ambos sejam nulos, retorna nulo
		const localStorageCurrentUser = JSON.parse(localStorage.getItem('currentUser') as string);
		const sessionStorageCurrentUser = JSON.parse(sessionStorage.getItem('currentUser') as string);

		this.currentUserSource.next(localStorageCurrentUser || sessionStorageCurrentUser);
	}

	public setCurrentUser(user: Jira.Author, preserveSession: boolean): void {
		if (preserveSession) {
			localStorage.setItem('currentUser', JSON.stringify(user));
			sessionStorage.removeItem('currentUser');
		} else {
			sessionStorage.setItem('currentUser', JSON.stringify(user));
			localStorage.removeItem('currentUser');
		}

		this.currentUserSource.next(user);
	}

	public clearCurrentUser(): void {
		localStorage.removeItem('currentUser');
		sessionStorage.removeItem('currentUser');

		this.currentUserSource.next(null);
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
}
