import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Jira } from '../../../models';
import { SessionService } from '../../../services';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

	public currentUser: Jira.Author;

	constructor(private sessionService: SessionService, private router: Router) {
		if (this.sessionService.currentUser) {
			this.currentUser = this.sessionService.currentUser;
		} else {
			this.logout();
		}
	}

	public logout() {
		this.router.navigate(['/logout']);
	}
}
