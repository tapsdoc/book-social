import { createReducer, on } from '@ngrx/store';
import { increment, decrement } from '../actions/counter.actions';
import { CartItem } from '../../model/cart-item';

export interface CartState {
	cartItems: CartItem[];
}

export const initialState: CartState = {
	cartItems: []
};

export const counterReducer = createReducer(
	initialState,
	on(increment, (state, { id }) => {
		return {
			...state,
			cartItems: state.cartItems.map(item => {
				if (item.product.id === id) {
					return {
						...item,
						quantity: item.quantity + 1,
						price: item.product.price * (item.quantity + 1)
					};
				}
				return item;
			})
		};
	}),
	on(decrement, (state, { id }) => {
		return {
			...state,
			cartItems: state.cartItems.map(item => {
				if (item.product.id === id && item.quantity > 1) {
					return {
						...item,
						quantity: item.quantity - 1,
						price: item.product.price * (item.quantity - 1)
					};
				}
				return item;
			})
		};
	})
);