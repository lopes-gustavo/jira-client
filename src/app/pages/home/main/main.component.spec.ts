import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSortModule, MatTableModule, MatToolbarModule } from '@angular/material';

describe('MainComponent', () => {
	const router = {navigate: jasmine.createSpy('navigate')};

	let component: MainComponent;
	let fixture: ComponentFixture<MainComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MainComponent],
			imports: [
				FormsModule,
				HttpClientModule,
				BrowserAnimationsModule,
				MatFormFieldModule,
				MatInputModule,
				MatCheckboxModule,
				MatToolbarModule,
				MatTableModule,
				MatSortModule,
			],
			providers: [
				{provide: Router, useValue: router}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MainComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
