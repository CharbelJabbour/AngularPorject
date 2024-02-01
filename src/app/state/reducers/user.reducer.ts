import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as fromUser from '../actions/user.actions';
import { User } from 'src/app/models/user.model';

export interface UserState {
    users: User[];
    loading: boolean;
    error: any;
}

export const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

// Selectors
export const getUserState = createFeatureSelector<UserState>('users');

export const getUsers = createSelector(getUserState, (state: UserState) => state.users);
export const getLoading = createSelector(getUserState, (state: UserState) => state.loading);
export const getError = createSelector(getUserState, (state: UserState) => state.error);

export const userReducer = createReducer(
    initialState,
    on(fromUser.loadUsers, (state) => {
        console.log('Fetching users...');
        return { ...state, loading: true };
    }),
    on(fromUser.loadUsersSuccess, (state, { users }) => {
        console.log('Users fetched successfully:', users);
        return { ...state, users, loading: false };
    }),
    on(fromUser.loadUsersFailure, (state, { error }) => {
        console.error('Error fetching users:', error);
        return { ...state, error, loading: false };
    }),
);

