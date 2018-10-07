import { CapitalizeFirstPipe } from './capitalize-first.pipe';

describe('CapitalizeFirstPipe', () => {
	it('create an instance', () => {
		const pipe = new CapitalizeFirstPipe();
		expect(pipe).toBeTruthy();
	});

	it('should capitalize first letter of a phrase', () => {
		const pipe = new CapitalizeFirstPipe();

		const notPipedText = 'sOME tExt';
		const pipedText = pipe.transform(notPipedText);
		expect(pipedText).toBe('Some Text');
	});
});
