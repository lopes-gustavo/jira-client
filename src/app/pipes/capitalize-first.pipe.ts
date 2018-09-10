import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'capitalizeFirst'
})
export class CapitalizeFirstPipe implements PipeTransform {

	transform(text: string): string {
		if (!text) return '';

		return text.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.substring(1))
			.join(' ');
	}

}
