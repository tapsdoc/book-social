import { createAction, props } from '@ngrx/store';

export const increment = createAction(
	'[Counter Component] Increment',
	props<{ id: number }>()
);

export const decrement = createAction(
	'[Counter Component] Decrement',
	props<{ id: number }>()
);