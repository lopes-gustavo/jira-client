import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Jira } from '../../../models';
import { SessionService } from '../../../services';
import { Nullable } from '../../../types';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

	public currentUser: Nullable<Jira.Author>;

	constructor(private sessionService: SessionService, private router: Router) {
		this.sessionService.currentUser.subscribe(currentUser => this.currentUser = currentUser);
	}

	public logout() {
		this.router.navigate(['/logout']);
	}
}
