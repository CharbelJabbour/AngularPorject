import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import * as userActions from '../actions/user.actions';
import { UserService } from '../../services/user.service';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.loadUsers),
      mergeMap((action) =>
        this.userService.getUsers(action.page).pipe(
          map((users) => userActions.loadUsersSuccess({ users })),
          catchError((error) => of(userActions.loadUsersFailure({ error })))
        )
      )
    )
  );
}
