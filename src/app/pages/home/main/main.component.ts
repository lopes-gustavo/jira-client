import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { Component } from '@angular/core';
import { Nullable } from '../../../types';
import { Jira } from '../../../models';
import { ServerService, SessionService } from '../../../services';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent {
	sortParams = {
		isDesc: false,
		column: 'timeSpentHours',
		direction: 1 | -1,
	};

	jiraData = new JiraData();

	searchFormModel = {
		initialDate: moment().add(-2, `weeks`).format(`YYYY-MM-DD`),
		finalDate: moment().format(`YYYY-MM-DD`),
	};

	currentUser: Nullable<Jira.Author> = null;

	dateRange: moment.Moment[] = [];

	displayOverlay: boolean = true;

	constructor(private serverService: ServerService, private sessionService: SessionService) {
		this.sessionService.currentUser.subscribe(currentUser => {
			this.currentUser = currentUser;

			if (!currentUser) {
				this.clearData();
				this.clearSearchFormData();
			}
		});
	}

	sortColumnBy(property: string) {
		this.sortParams.isDesc = !this.sortParams.isDesc;
		this.sortParams.column = property;
		this.sortParams.direction = this.sortParams.isDesc ? 1 : -1;

		this.sortJiraIssuesByWorklog();
	};

	keys(value: any): { key: string, value: any }[] {
		const keys: { key: string, value: any }[] = [];
		Object.getOwnPropertyNames(value).forEach(key => keys.push({key: key, value: value[key]}));
		return keys;
	}

	getFaIconClassFor(column: string) {
		if (this.sortParams.column !== column) return 'fa fa-sort';
		if (this.sortParams.column === column && this.sortParams.isDesc) return 'fa fa-sort-desc';
		if (this.sortParams.column === column && !this.sortParams.isDesc) return 'fa fa-sort-asc';
		else return '';
	}

	generateReports(form: { initialDate: string; finalDate: string }): boolean {

		// TODO: Criar um component para `alert`
		if (!form.initialDate) {
			alert('Por favor, preencha a data inicial');
			return false;
		}
		if (!form.finalDate) {
			alert('Por favor, preencha a data final');
			return false;
		}
		if (form.initialDate > form.finalDate) {
			alert('A data inicial não pode ser maior que a data final');
			return false;
		}

		this.clearData();

		this.initializeDateRangeArray(form);

		if (this.currentUser) {

			forkJoin(
				this.serverService.getJiraData(this.currentUser.token, this.currentUser.name, form.initialDate, form.finalDate),
				this.serverService.getTeamJiraData(this.currentUser.token, form.initialDate, form.finalDate),
			).subscribe(([jiraData, jiraTeamData]: [Jira.SearchResponse, Jira.SearchResponse]) => {
				this.updateJiraData(jiraData);
				this.updateTeamJiraData(jiraTeamData);

				this.displayOverlay = false;
			});

			// this._getJiraData(this.updateJiraData.bind(this));
			// this._getTeamJiraData(this.updateTeamJiraData.bind(this));
		}

		return true;
	}

	getWorklogHoursOnDay(worklogHours: { key: string, value: any }, day: string) {
		return worklogHours.value[moment(day).format('YYYY-MM-DD')] | 0;
	}

	isWeekend(date: string) {
		return [6, 7].includes(moment(date).isoWeekday());
	}

	private clearData() {
		this.jiraData.clear();
		this.dateRange = [];
	}

	private clearSearchFormData() {
		this.searchFormModel = {
			initialDate: moment().add(-2, `weeks`).format(`YYYY-MM-DD`),
			finalDate: moment().format(`YYYY-MM-DD`),
		};
	}

	private initializeDateRangeArray({initialDate, finalDate}: { initialDate: string, finalDate: string }) {
		const initialDateMoment = moment(initialDate);
		const finalDateMoment = moment(finalDate);
		do {
			this.dateRange.push(moment(initialDateMoment));
		} while (initialDateMoment.add(1, 'day') <= finalDateMoment);
	}

	private sortJiraIssuesByWorklog() {
		this.jiraData.currentUserIssues.sort((a, b) => {
			const column = this.sortParams.column as keyof Worklog;

			if (a[column] < b[column]) {
				return -1 * this.sortParams.direction;
			}
			else if (a[column] > b[column]) {
				// noinspection PointlessArithmeticExpressionJS
				return 1 * this.sortParams.direction;
			}
			else {
				return 0;
			}
		});
	}

	private updateJiraData(jiraData: Jira.SearchResponse) {
		if (jiraData.total > jiraData.maxResults) {
			alert(`Existem ${jiraData.total} issues no servidor, porém só conseguimos retornar ${jiraData.maxResults}.\n` +
				`Por favor, diminua o intervalo da busca ou requisite ao desenvolvedor que implemente busca com paginação.`);
		}

		jiraData.issues.forEach(issue => {
			if (!issue.fields.worklog.worklogs.length) {
				issue.fields.worklog.worklogs.push(new Jira.Issue.Worklogs());
			}

			issue.fields.worklog.worklogs.forEach(worklog => {
				worklog.timeSpentHours = worklog.timeSpentSeconds / 60 / 60;

				this.createJiraWorklogByDaysObject(issue, worklog);
			});

		});

		this.sortJiraIssuesByWorklog();

	}

	private updateTeamJiraData(jiraData: Jira.SearchResponse) {
		if (jiraData.total > jiraData.maxResults) {
			alert(`Existem ${jiraData.total} issues no servidor, porém só conseguimos retornar ${jiraData.maxResults}.\n` +
				`Por favor, diminua o intervalo da busca ou requisite ao desenvolvedor que implemente busca com paginação.`);
		}

		jiraData.issues.forEach(issue => {
			if (!issue.fields.worklog.worklogs.length) {
				issue.fields.worklog.worklogs.push(new Jira.Issue.Worklogs());
			}

			issue.fields.worklog.worklogs.forEach(worklog => {
				worklog.timeSpentHours = worklog.timeSpentSeconds / 60 / 60;

				this.createTeamJiraWorklogByDaysObject(issue, worklog);
			});

			this.sortJiraIssuesByWorklog();

		});
	}

	private createJiraWorklogByDaysObject(issue: Jira.Issue, worklog: Jira.Issue.IWorklogs) {
		let issueCreatedDate = '-';
		if (worklog.started) {
			issueCreatedDate = moment(worklog.started).format('YYYY-MM-DD');
			this.jiraData.currentUserWorklogByDay[issueCreatedDate] = (this.jiraData.currentUserWorklogByDay[issueCreatedDate] | 0) + worklog.timeSpentHours;
		}

		this.jiraData.currentUserIssues.push({
			key: issue.key,
			status: issue.fields.status.name,
			summary: issue.fields.summary,
			description: issue.fields.description,
			created: issueCreatedDate,
			timeSpentHours: worklog.timeSpentHours,
		});
	}

	private createTeamJiraWorklogByDaysObject(issue: Jira.Issue, worklog: Jira.Issue.IWorklogs) {
		const assignee = issue.fields.assignee;

		if (worklog.started && assignee) {
			const issueCreatedDate = moment(worklog.started).format('YYYY-MM-DD');
			const assigneeName = assignee.displayName;

			const teamWorklogByAssignee = this.jiraData.teamWorklogByDay[assigneeName] || {};

			// Adiciona o worklog.timeSpentHours no jiraTeamWorklog. Seta o mesmo como 0 caso não exista
			teamWorklogByAssignee[issueCreatedDate] = (teamWorklogByAssignee[issueCreatedDate] | 0) + worklog.timeSpentHours;

			this.jiraData.teamWorklogByDay[assigneeName] = teamWorklogByAssignee;
		}

	}

	// TODO: Remover esse método
	/*
	 private _getJiraData(updateJiraData: (jiraData: Jira.SearchResponse) => void) {
	 updateJiraData(new class implements Jira.SearchResponse {
	 expand = '';
	 issues = [
	 new class implements Jira.Issue {
	 expand: string = '';
	 fields = {
	 summary: '',
	 description: '',
	 created: new Date(),
	 issuetype: new class implements Jira.Issue.IssueType {
	 avatarId: number = 1;
	 description: string = 'mDescription';
	 iconUrl: string = '';
	 id: string = 'mId';
	 name: string = 'mName';
	 self: string = '';
	 subtask: boolean = true;
	 },
	 worklog: new class implements Jira.Issue.Worklog {
	 maxResults: number = 10;
	 startAt: number = 0;
	 total: number = 5;
	 worklogs: Jira.Issue.Worklogs[] = [
	 new class implements Jira.Issue.IWorklogs {
	 author = new class implements Jira.Author {
	 avatarUrls: Jira.AvatarUrls;
	 self: string;
	 timeZone: string;
	 active: boolean = true;
	 displayName: string = 'mDisplayName';
	 emailAddress: string = 'mEmailAddress';
	 key: string = 'mKey';
	 name: string = 'mName';
	 token: string = 'mToken';
	 };
	 comment: string = 'mComment';
	 created = new Date();
	 id: string = 'mId';
	 issueId: string = 'mIssueId';
	 self: string = '';
	 started: Date = new Date();
	 timeSpent: string = '';
	 timeSpentHours: number;
	 timeSpentSeconds: number = 60 * 60 * 8;
	 updateAuthor = new class implements Jira.Author {
	 avatarUrls: Jira.AvatarUrls;
	 self: string;
	 timeZone: string;
	 active: boolean = true;
	 displayName: string = 'mDisplayName';
	 emailAddress: string = 'mEmailAddress';
	 key: string = 'mKey';
	 name: string = 'mName';
	 token: string = 'mToken';
	 };
	 updated = new Date();
	 },
	 ];
	 },
	 assignee: new class implements Jira.Author {
	 avatarUrls: Jira.AvatarUrls;
	 self: string;
	 timeZone: string;
	 active: boolean = true;
	 displayName: string = 'mDisplayName';
	 emailAddress: string = 'mEmailAddress';
	 key: string = 'mKey';
	 name: string = 'mName';
	 token: string = 'mToken';
	 },
	 progress: new class implements Jira.Issue.Progress {
	 percent: number = 100;
	 progress: number = 100;
	 total: number = 100;
	 },
	 status: new class implements Jira.Issue.Status {
	 description: string = 'mDescription';
	 iconUrl: string = '';
	 id: string = 'mId';
	 name: string = 'mName';
	 self: string = '';
	 statusCategory = {
	 self: '',
	 id: 1,
	 key: '',
	 colorName: '',
	 name: '',
	 };
	 }
	 };
	 id: string = '';
	 key: string = '';
	 self: string = '';
	 }
	 ];
	 maxResults = 10;
	 startAt = 0;
	 total = 5;
	 });
	 }

	 private _getTeamJiraData(updateTeamJiraData: (jiraData: Jira.SearchResponse) => void) {
	 updateTeamJiraData(new class implements Jira.SearchResponse {
	 expand = '';
	 issues = [
	 new class implements Jira.Issue {
	 expand: string = '';
	 fields = {
	 summary: '',
	 description: '',
	 created: new Date(),
	 issuetype: new class implements Jira.Issue.IssueType {
	 avatarId: number = 1;
	 description: string = 'mDescription';
	 iconUrl: string = '';
	 id: string = 'mId';
	 name: string = 'mName';
	 self: string = '';
	 subtask: boolean = true;
	 },
	 worklog: new class implements Jira.Issue.Worklog {
	 maxResults: number = 10;
	 startAt: number = 0;
	 total: number = 5;
	 worklogs: Jira.Issue.Worklogs[] = [
	 new class implements Jira.Issue.IWorklogs {
	 author = new class implements Jira.Author {
	 avatarUrls: Jira.AvatarUrls;
	 self: string;
	 timeZone: string;
	 active: boolean = true;
	 displayName: string = 'mDisplayName';
	 emailAddress: string = 'mEmailAddress';
	 key: string = 'mKey';
	 name: string = 'mName';
	 token: string = 'mToken';
	 };
	 comment: string = 'mComment';
	 created = new Date();
	 id: string = 'mId';
	 issueId: string = 'mIssueId';
	 self: string = '';
	 started: Date = new Date();
	 timeSpent: string = '';
	 timeSpentHours: number;
	 timeSpentSeconds: number = 60 * 60 * 8;
	 updateAuthor = new class implements Jira.Author {
	 avatarUrls: Jira.AvatarUrls;
	 self: string;
	 timeZone: string;
	 active: boolean = true;
	 displayName: string = 'mDisplayName';
	 emailAddress: string = 'mEmailAddress';
	 key: string = 'mKey';
	 name: string = 'mName';
	 token: string = 'mToken';
	 };
	 updated = new Date();
	 },
	 ];
	 },
	 assignee: new class implements Jira.Author {
	 avatarUrls: Jira.AvatarUrls;
	 self: string;
	 timeZone: string;
	 active: boolean = true;
	 displayName: string = 'mDisplayName';
	 emailAddress: string = 'mEmailAddress';
	 key: string = 'mKey';
	 name: string = 'mName';
	 token: string = 'mToken';
	 },
	 progress: new class implements Jira.Issue.Progress {
	 percent: number = 100;
	 progress: number = 100;
	 total: number = 100;
	 },
	 status: new class implements Jira.Issue.Status {
	 description: string = 'mDescription';
	 iconUrl: string = '';
	 id: string = 'mId';
	 name: string = 'mName';
	 self: string = '';
	 statusCategory = {
	 self: '',
	 id: 1,
	 key: '',
	 colorName: '',
	 name: '',
	 };
	 }
	 };
	 id: string = '';
	 key: string = '';
	 self: string = '';
	 }
	 ];
	 maxResults = 10;
	 startAt = 0;
	 total = 5;
	 });
	 }
	 */

}

interface Worklog {
	key: string;
	status: string;
	summary: string;
	description: string;
	created: string;
	timeSpentHours: number;
}

class JiraData {
	public currentUserWorklogByDay: { [date: string]: number } = {};
	public currentUserIssues: Worklog[] = [];
	public teamWorklogByDay: { [name: string]: { [value: string]: number } } = {};

	public clear(): void {
		this.currentUserWorklogByDay = {};
		this.currentUserIssues = [];
		this.teamWorklogByDay = {};
	}
}
