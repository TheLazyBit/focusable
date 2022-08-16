import React, {ReactNode} from 'react';
import {
    FocusManager,
    withFocus,
    focusNextId,
    focusPreviousId, asFocusAction,
} from './feature/focus';

const H1 = withFocus((props: { isInFocus: boolean, children: ReactNode }) => <h1 className={props.isInFocus ? 'focus-content' : ''}>
    {props.children}
</h1>);
const H2 = withFocus((props: { isInFocus: boolean, children: ReactNode }) => <h2 className={props.isInFocus ? 'focus-content' : ''}>
    {props.children}
</h2>);

const BackButton = asFocusAction(({ focus }) => <button onClick={() => focus(focusPreviousId)}>Back</button> );
const NextButton = asFocusAction(({ focus }) => <button onClick={() => focus(focusNextId)}>Next</button> );

const App = () => { 
    return (
        <FocusManager>
            <H1 focusId={'me-content'}>
        Test
            </H1>
            <div>
                <H2 focusId={'some-other'}>
                    <div>other me</div>
                </H2>
                <H2 focusId={'some-other-2'}>
                    <div>other me2</div>
                </H2>
            </div>

            <BackButton />
            <NextButton />
        </FocusManager>
    );
};

export default App;