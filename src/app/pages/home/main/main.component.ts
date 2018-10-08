import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Jira } from '../../../models';
import { ServerService, SessionService } from '../../../services';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
	private serverUrl: string;

	sortParams = {
		isDesc: false,
		column: 'timeSpentHours',
		direction: 1,
	};
	searchFormModel = {
		initialDate: moment().add(-2, `weeks`).format(`YYYY-MM-DD`),
		finalDate: moment().format(`YYYY-MM-DD`),
	};
	displayOverlay = true;
	jiraData = new JiraData();
	currentUser: Jira.Author;
	dateRange: moment.Moment[] = [];

	tableDataHoursPerTaskPerDay: { displayedColumns: string[], dataSource: MatTableDataSource<Worklog> } = {
		displayedColumns: ['key', 'status', 'summary', 'created', 'timeSpentHours'],
		dataSource: new MatTableDataSource([]),
	};
	tableDataHoursPerDay: { displayedColumns: string[], dataSource: MatTableDataSource<{date: string, hours: number}> } = {
		displayedColumns: ['date', 'hours'],
		dataSource: new MatTableDataSource([]),
	};
	tableDataTeamHoursPerDay: { displayedColumns: string[], dataSource: string[][] } = {
		displayedColumns: [],
		dataSource: [],
	};

	@ViewChild('tableDataHoursPerTaskPerDaySort') tableDataHoursPerTaskPerDaySort: MatSort;
	@ViewChild('tableDataHoursPerDaySort') tableDataHoursPerDaySort: MatSort;

	constructor(router: Router, private serverService: ServerService, private sessionService: SessionService) {
		const currentUser = this.sessionService.currentUser;
		if (currentUser) {
			this.currentUser = currentUser;
		} else {
			router.navigate(['/logout']);
		}

		const serverUrl = sessionService.getServerUrl();
		if (serverUrl) {
			this.serverUrl = serverUrl;
		} else {
			router.navigate(['/logout']);
		}
	}

	ngOnInit() {
		this.tableDataHoursPerTaskPerDay.dataSource.sort = this.tableDataHoursPerTaskPerDaySort;
		this.tableDataHoursPerDay.dataSource.sort = this.tableDataHoursPerDaySort;
	}

	sortColumnBy(property: string) {
		this.sortParams.isDesc = !this.sortParams.isDesc;
		this.sortParams.column = property;
		this.sortParams.direction = this.sortParams.isDesc ? 1 : -1;

		this.sortJiraIssuesByWorklog();
	}

	keys(value: any): { key: string, value: any }[] {
		const keys: { key: string, value: any }[] = [];
		Object.getOwnPropertyNames(value).forEach(key => keys.push({key: key, value: value[key]}));
		return keys;
	}

	getFaIconClassFor(column: string) {
		if (this.sortParams.column !== column) {
			return 'fa fa-sort';
		}
		if (this.sortParams.column === column && this.sortParams.isDesc) {
			return 'fa fa-sort-desc';
		}
		if (this.sortParams.column === column && !this.sortParams.isDesc) {
			return 'fa fa-sort-asc';
		} else {
			return '';
		}
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
				this.serverService.getJiraData(this.currentUser.token, this.serverUrl, this.currentUser.name, form.initialDate, form.finalDate),
				this.serverService.getTeamJiraData(this.currentUser.token, this.serverUrl, form.initialDate, form.finalDate),
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

	getWorklogHoursOnDay(worklogHours: { key: string, value: any }, day: moment.Moment) {
		return worklogHours.value[day.format('YYYY-MM-DD')] || 0;
	}

	isWeekend(date: string) {
		return [6, 7].includes(moment(date, 'DD MMM').isoWeekday());
	}

	private clearData() {
		this.jiraData.clear();
		this.dateRange = [];
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
			} else if (a[column] > b[column]) {
				// noinspection PointlessArithmeticExpressionJS
				return 1 * this.sortParams.direction;
			} else {
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

			issue.fields.worklog.worklogs
				.filter(worklog => worklog.author.key === this.currentUser.key)
				.forEach(worklog => {
				worklog.timeSpentHours = worklog.timeSpentSeconds / 60 / 60;

				this.createJiraWorklogByDaysObject(issue, worklog);
			});

		});

		this.tableDataHoursPerTaskPerDay.dataSource.data = this.jiraData.currentUserIssues;
		this.tableDataHoursPerDay.dataSource.data = this.keys(this.jiraData.currentUserWorklogByDay)
			.reduce((acc, cur) => [...acc, {date: cur.key, hours: cur.value}], []);

		this.sortJiraIssuesByWorklog();

	}

	private updateTeamJiraData(jiraData: Jira.SearchResponse) {
		if (jiraData.total > jiraData.maxResults) {
			alert(`Existem ${jiraData.total} issues no servidor, porém só conseguimos retornar ${jiraData.maxResults}.\n` +
				`Por favor, diminua o intervalo da busca ou requisite ao desenvolvedor que implemente busca com paginação.`);
		}

		this.tableDataTeamHoursPerDay.dataSource = [];
		jiraData.issues.forEach(issue => {
			if (!issue.fields.worklog.worklogs.length) {
				issue.fields.worklog.worklogs.push(new Jira.Issue.Worklogs());
			}

			issue.fields.worklog.worklogs.forEach(worklog => {
				worklog.timeSpentHours = worklog.timeSpentSeconds / 60 / 60;

				this.createTeamJiraWorklogByDaysObject(worklog);
			});

			this.sortJiraIssuesByWorklog();

		});

		this.tableDataTeamHoursPerDay.displayedColumns = [' ', ...this.dateRange.map(date => moment(date).format('DD MMM'))];

		for (const worklogHours of this.keys(this.jiraData.teamWorklogByDay)) {
			// const index = this.tableDataTeamHoursPerDay.dataSource.push([worklogHours.key]);
			const index = this.tableDataTeamHoursPerDay.dataSource.push([worklogHours.key]);
			// this.tableDataTeamHoursPerDay.dataSource[index - 1].push();

			for (const day of this.dateRange) {
				const hours = this.getWorklogHoursOnDay(worklogHours, day);
				this.tableDataTeamHoursPerDay.dataSource[index - 1].push(`${hours}`);
			}
		}

	}

	private createJiraWorklogByDaysObject(issue: Jira.Issue, worklog: Jira.Issue.IWorklogs) {
		let issueCreatedDate = '-';
		if (worklog.started) {
			issueCreatedDate = moment(worklog.started).format('YYYY-MM-DD');

			this.jiraData.currentUserWorklogByDay[issueCreatedDate]
				= (this.jiraData.currentUserWorklogByDay[issueCreatedDate] || 0) + worklog.timeSpentHours;
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

	private createTeamJiraWorklogByDaysObject(worklog: Jira.Issue.IWorklogs) {
		const assignee = worklog.author;

		if (worklog.started && assignee) {
			const issueCreatedDate = moment(worklog.started).format('YYYY-MM-DD');
			const assigneeName = assignee.displayName;

			const teamWorklogByAssignee = this.jiraData.teamWorklogByDay[assigneeName] || {};

			// Adiciona o worklog.timeSpentHours no jiraTeamWorklog. Seta o mesmo como 0 caso não exista
			teamWorklogByAssignee[issueCreatedDate] = (teamWorklogByAssignee[issueCreatedDate] || 0) + worklog.timeSpentHours;

			this.jiraData.teamWorklogByDay[assigneeName] = teamWorklogByAssignee;
		}

	}

	getBackgroundColor(hoursAsString: string, isWeekend: boolean) {
		const hours = Number(hoursAsString);

		if (!isWeekend) {
			if (hours === 8) { return 'green'; }
			else if (hours < 8) { return 'lightcoral'; }
			else { return 'yellow'; }
		} else {
			if (hours === 0) { return ''; }
			else { return 'yellow'; }
		}

	}

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
