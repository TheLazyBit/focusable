import {FocusUpdateRule} from './focus';

export const focusNextId: FocusUpdateRule = (idx) => idx !== null
    ? idx + 1
    : 0;
export const focusPreviousId: FocusUpdateRule = (idx, context) => idx !== null
    ? idx - 1
    : context.length - 1;