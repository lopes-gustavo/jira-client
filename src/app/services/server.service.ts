import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Jira } from '../models';
import { SearchFormModel } from '../pages/home/main/main.component';

@Injectable({
	providedIn: 'root'
})
export class ServerService {

	constructor(private httpClient: HttpClient) { }

	login(token: string, server: string) {
		return this.httpClient.get<Jira.Author>(`${server}/rest/api/2/myself`, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + token,
			}),
		});
	}

	getJiraData(token: string, server: string, project: string, name: string, dates: SearchFormModel) {
		return this.httpClient.get<Jira.SearchResponse>(`${server}/rest/api/2/search`, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': `Basic ${token}`,
			}),
			params: {
				jql: `worklogAuthor = ${name} AND project = ${project} AND ` +
					`(worklogDate >= ${moment(dates.initialDate).format('YYYY-MM-DD')} AND worklogDate <= ${moment(dates.finalDate).format('YYYY-MM-DD')})`,
				startAt: '0',
				maxResults: '1000',
				fields: [
					'id',
					'key',
					'status',
					'created',
					'summary',
					'type',
					'description',
					'workLogDate',
					'progress',
					'worklog',
				],
			}
		});
	}

	getTeamJiraData(token: string, server: string, project: string, dates: SearchFormModel) {
		return this.httpClient.get<Jira.SearchResponse>(`${server}/rest/api/2/search`, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + token,
			}),
			params: {
				jql: `project = ${project} AND ` +
					`(worklogDate >= ${moment(dates.initialDate).format('YYYY-MM-DD')} AND worklogDate <= ${moment(dates.finalDate).format('YYYY-MM-DD')})`,
				startAt: '0',
				maxResults: '1000',
				fields: [
					'worklog',
					'assignee',
				],
			}
		});
	}
}
