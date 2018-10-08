import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Jira } from '../models';

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

	getJiraData(token: string, server: string, name: string, initialDate: string, finalDate: string) {
		return this.httpClient.get<Jira.SearchResponse>(`${server}/rest/api/2/search`, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': `Basic ${token}`,
			}),
			params: {
				jql: `worklogAuthor = ${name} AND project = SSAZBR AND ` +
					`(worklogDate >= ${moment(initialDate).format('YYYY-MM-DD')} AND worklogDate <= ${moment(finalDate).format('YYYY-MM-DD')})`,
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

	getTeamJiraData(token: string, server: string, initialDate: string, finalDate: string) {
		return this.httpClient.get<Jira.SearchResponse>(`${server}/rest/api/2/search`, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + token,
			}),
			params: {
				jql: `project = SSAZBR AND ` +
					`(worklogDate >= ${moment(initialDate).format('YYYY-MM-DD')} AND worklogDate <= ${moment(finalDate).format('YYYY-MM-DD')})`,
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
