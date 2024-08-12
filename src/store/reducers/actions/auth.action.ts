import { createAction, props } from '@ngrx/store';

export const setIsAuth = createAction(
  '[Auth] setIsAuth',
  props<{ payload: boolean }>()
);
export const setLoading = createAction(
  '[Auth] setLoading',
  props<{ payload: boolean }>()
);
export const setWelcomeEnteredData = createAction(
  '[Auth] setWelcomeEnteredData',
  props<{ payload: { email: string; phone: string } }>()
);
export const setUser = createAction(
  '[Auth] setUser',
  props<{ payload: { fullname: string } }>()
);
