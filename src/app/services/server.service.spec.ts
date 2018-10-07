import { inject, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { ServerService } from './server.service';
import { author, searchResponse } from '../_helper/mocks/jira';

describe('ServerService', () => {
	const httpClient = {get: jasmine.createSpy('get')};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ServerService,
				{provide: HttpClient, useValue: httpClient}
			]
		});
	});

	it('should be created', inject([ServerService], (service: ServerService) => {
		expect(service).toBeTruthy();
	}));

	it('#login should return a Jira.Author', inject([ServerService], (service: ServerService) => {
		httpClient.get.and.returnValue(of(author));

		service.login('token', 'server').subscribe(
			(value => expect(value).toEqual(author)),
			(error => fail(error))
		);
	}));

	it('#getJiraData should return a Jira.SearchResponse', inject([ServerService], (service: ServerService) => {
		httpClient.get.and.returnValue(of(searchResponse));

		service.getJiraData('token', 'server', 'name', '2018-10-08', '2018-10-10').subscribe(
			(value => expect(value).toEqual(searchResponse)),
			(error => fail(error))
		);
	}));

	it('#getTeamJiraData should return a Jira.SearchResponse', inject([ServerService], (service: ServerService) => {
		httpClient.get.and.returnValue(of(searchResponse));

		service.getTeamJiraData('token', 'server', '2018-10-08', '2018-10-10').subscribe(
			(value => expect(value).toEqual(searchResponse)),
			(error => fail(error))
		);
	}));

});
