import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatCardModule, MatCheckboxModule, MatIconModule, MatInputModule } from '@angular/material';

import { DisclaimerComponent } from './disclaimer.component';

describe('DisclaimerComponent', () => {
	const router = {navigate: jasmine.createSpy('navigate')};

	let component: DisclaimerComponent;
	let fixture: ComponentFixture<DisclaimerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DisclaimerComponent],
			providers: [{provide: Router, useValue: router}],
			imports: [
				MatCardModule,
				MatIconModule,
				MatInputModule,
				MatCheckboxModule,
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DisclaimerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
