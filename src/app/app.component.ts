import { Component } from '@angular/core';
import { Nullable } from './types/nullable';
import { Jira } from './models/jira.model';
import { SessionService } from './services/session.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	public currentUser: Nullable<Jira.Author> = null;

	constructor(private sessionService: SessionService) {
		this.sessionService.currentUser.subscribe(currentUser => this.currentUser = currentUser);
	}

}
