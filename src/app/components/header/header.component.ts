import { Component } from '@angular/core';
import { Jira } from '../../models/jira.model';
import { SessionService } from '../../services/session.service';
import { Nullable } from '../../types/nullable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

	public currentUser: Nullable<Jira.Author>;

	constructor(private sessionService: SessionService) {
		this.sessionService.currentUser.subscribe(currentUser => this.currentUser = currentUser);
	}

  public logout() {
		this.sessionService.clearCurrentUser();
	}
}
