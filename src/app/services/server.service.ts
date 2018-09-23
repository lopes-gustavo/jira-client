import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ServerService {

	constructor(private httpClient: HttpClient) { }

	login(token: string, server: string) {
		return this.httpClient.get(`${server}/rest/api/2/myself`, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + token,
			}),
		});
	}

	getJiraData(token: string, server: string, name: string, initialDate: string, finalDate: string) {
		return this.httpClient.get(`${server}/rest/api/2/search`, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': `Basic ${token}`,
			}),
			params: {
				jql: `worklogAuthor = ${name} AND project = SSAZBR AND ` +
					`(created > ${moment(initialDate).format('YYYY-MM-DD')} AND created < ${moment(finalDate).format('YYYY-MM-DD')})`,
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
				// fields: '*all',
			}
		});
	}

	getTeamJiraData(token: string, server: string, initialDate: string, finalDate: string) {
		return this.httpClient.get(`${server}/rest/api/2/search`, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + token,
			}),
			params: {
				// tslint:disable-next-line:max-line-length
				jql: `project = SSAZBR AND ` +
					`(created > ${moment(initialDate).format('YYYY-MM-DD')} AND created < ${moment(finalDate).format('YYYY-MM-DD')})`,
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
