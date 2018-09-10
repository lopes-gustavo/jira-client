export namespace Jira {

	export namespace Issue {

		export interface IssueType {
			self: string;
			id: string;
			description: string;
			iconUrl: string;
			name: string;
			subtask: boolean;
			avatarId: number;
		}

		export interface Worklog {
			startAt: number;
			maxResults: number;
			total: number;
			worklogs: Worklogs[];
		}

		export interface IWorklogs {
			self: string;
			author: Author;
			updateAuthor: Author;
			comment: string;
			created: Date;
			updated: Date;
			started: Date;
			timeSpent: string;
			timeSpentSeconds: number;
			timeSpentHours: number;
			id: string;
			issueId: string;
		}

		export class Worklogs implements IWorklogs {
			timeSpentSeconds = 0;
			timeSpentHours = 0;
			author: Jira.Author;
			comment: string;
			created: Date;
			id: string;
			issueId: string;
			self: string;
			started: Date;
			timeSpent: string;
			updateAuthor: Jira.Author;
			updated: Date;
		}

		export interface Progress {
			progress: number;
			total: number;
			percent: number;
		}

		export interface Status {
			self: string;
			description: string;
			iconUrl: string;
			name: string;
			id: string;
			statusCategory: {
				self: string;
				id: number;
				key: string;
				colorName: string;
				name: string;
			};
		}

	}

	export interface SearchResponse {
		expand: string;
		startAt: number;
		maxResults: number;
		total: number;
		issues: Issue[];
	}

	export interface Issue {
		expand: string;
		id: string;
		self: string;
		key: string;
		fields: {
			summary: string;
			description: string;
			created: Date;
			issuetype: Jira.Issue.IssueType;
			worklog: Jira.Issue.Worklog;
			assignee: Author;
			progress: Jira.Issue.Progress;
			status: Jira.Issue.Status;
		};
	}

	export interface Author {
		self: string;
		name: string;
		key: string;
		emailAddress: string;
		avatarUrls: AvatarUrls;
		displayName: string;
		active: boolean;
		timeZone: string;
		token: string;
	}

	export interface AvatarUrls {
		'48x48': string;
		'24x24': string;
		'16x16': string;
		'32x32': string;
	}
}
