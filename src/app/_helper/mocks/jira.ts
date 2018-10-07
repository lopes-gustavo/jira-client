import { Jira } from '../../models';

export const avatarUrls: Jira.AvatarUrls = {
	'16x16': 'm16',
	'24x24': 'm24',
	'32x32': 'm32',
	'48x48': 'm48',
};

export const author: Jira.Author = {
	avatarUrls: avatarUrls,
	self: 'mSelf',
	timeZone: 'mTimeZone',
	active: true,
	displayName: 'mDisplayName',
	emailAddress: 'mEmailAddress',
	key: 'mKey',
	name: 'mName',
	token: 'mToken',
};

export const issueType: Jira.Issue.IssueType = {
	avatarId: 1,
	description: 'mDescription',
	iconUrl: '',
	id: 'mId',
	name: 'mName',
	self: '',
	subtask: true,
};

export const progress: Jira.Issue.Progress = {
	percent: 100,
	progress: 100,
	total: 100,
};

export const worklogs: Jira.Issue.Worklogs = {
	author: author,
	comment: 'mComment',
	created: new Date(),
	id: 'mId',
	issueId: 'mIssueId',
	self: 'mSelf',
	started: new Date(),
	timeSpent: 'mTimeSpent',
	timeSpentHours: 10,
	timeSpentSeconds: 10 * 60 * 60,
	updateAuthor: author,
	updated: new Date(),
};

export const worklog: Jira.Issue.Worklog = {
	maxResults: 10,
	startAt: 0,
	total: 10,
	worklogs: [worklogs],
};

export const status: Jira.Issue.Status = {
	description: 'mDescription',
	iconUrl: 'mIconUrl',
	id: 'mId',
	name: 'mName',
	self: 'mSelf',
	statusCategory: {
		colorName: 'mColorName',
		id: 0,
		key: 'mKey',
		name: 'mName',
		self: 'mSelf',
	},
};

export const issue: Jira.Issue = {
	expand: 'mExpand',
	id: 'mId',
	key: 'mKey',
	self: 'mSelf',
	fields: {
		summary: '',
		description: '',
		created: new Date(),
		issuetype: issueType,
		assignee: author,
		progress: progress,
		status: status,
		worklog: worklog,
	},
};

export const searchResponse: Jira.SearchResponse = {
	expand: 'mExpand',
	issues: [issue],
	maxResults: 10,
	startAt: 0,
	total: 10,
};
