import React, {ReactNode, useEffect, useState} from 'react';
import {
    FocusManager,
    focusableComponent,
    focusNextId,
    focusPreviousId,
    focusAction,
    FocusActionProps, WithFocusProps,
} from './feature/focus';

const BackButton = focusAction(({focus, hasPrevious}) => (
    <button
        onClick={() => focus(focusPreviousId)}
        disabled={!hasPrevious}
    >
        Back
    </button>
));

const NextButton = focusAction(({focus, hasNext}) => (
    <button
        onClick={() => focus(focusNextId)}
        disabled={!hasNext}
    >
        Next
    </button>
));

const StartTour = focusAction(({focus}) => (
    <button onClick={() => focus(() => 0)}>Start</button>
));

const EndTour = focusAction(({focus}) => (
    <button onClick={() => focus(() => null)}>End</button>
));

const Highlight = focusableComponent((props: WithFocusProps<{ children: ReactNode }>) => {
    return <div>
        <div>
            {props.children}
        </div>
        {
            props.isInFocus &&
            <div>
                <BackButton/>
                <NextButton/>
            </div>
        }
    </div>;
});


type AnimateTourProps = FocusActionProps<{ active: boolean }>
const AnimateTour = focusAction((props: AnimateTourProps) => {
    useEffect(
        () => {
            if (props.active) {
                const interval = setInterval(() => props.focus(focusNextId), 200);
                return () => clearInterval(interval);
            }
        }, [props.active]);
    return null;
});

const App = () => {
    const [runAnimation, setRunAnimation] = useState(false);
    return (
        <div style={{background: 'gray'}}>
            <FocusManager>
                <Highlight focusId={'first'}>
                    <div>other me 1</div>
                </Highlight>
                <Highlight focusId={'second'}>
                    <div>other me 2</div>
                </Highlight>
                <Highlight focusId={'third'}>
                    <div>other me 3</div>
                </Highlight>
                <Highlight focusId={'fourth'}>
                    <div>other me 4</div>
                </Highlight>
                <Highlight focusId={'fifth'}>
                    <div>other me 5</div>
                </Highlight>
                <button onClick={() => setRunAnimation((previous) => !previous)}>
                    {runAnimation ? 'Stop animation' : 'Start animation'}
                </button>
                <StartTour/>
                <EndTour/>
                <AnimateTour active={runAnimation}/>
            </FocusManager>
        </div>
    );
};

export default App;