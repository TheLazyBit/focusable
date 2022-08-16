import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';

export type FocusIndexType = number | null
export type FocusUpdateRule = (idx: FocusIndexType, allKeys: string[]) => FocusIndexType

type FocusManagerChildContextType = {
    currentlyFocused: string | null,
    registerFocusable: (id: string) => () => void,
    focus: (updateRule: FocusUpdateRule) => void,
}
const FocusManagerChildContext = createContext<FocusManagerChildContextType>(
    undefined as unknown as FocusManagerChildContextType
);

export function FocusManager(props: PropsWithChildren) {
    const {children} = props;
    const [focusKeys] = useState<string[]>([]); // mutable to prevent endless render loop
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setTouch] = useState(0); // just used as a rerender trigger since focusKeys is mutable
    const [currentlyFocusedID, setCurrentlyFocusedID] = useState<FocusIndexType>(null);
    const currentlyFocused = currentlyFocusedID !== null
        ? focusKeys[currentlyFocusedID]
        : null;

    const registerFocusable = useCallback((id: string) => {
        if (focusKeys.includes(id)) throw new Error('You can\'t register the same key multiple times as a focusable!');
        focusKeys.push(id);
        setTouch((prev) => prev + 1 % 1000);

        return () => {
            // There doesn't seem to be a direct way of mutably removing an element from an array
            // therefore we create a temporary filtered array
            // clear the original and fill it again with the temporary values
            const tmp = focusKeys.filter((pid) => pid !== id);
            while (focusKeys.length > 0) {
                focusKeys.pop();
            }
            tmp.forEach((elem) => focusKeys.push(elem));

            setTouch((prev) => prev + 1 % 1000);
        };
    }, [focusKeys]);

    const focus = useCallback((rule: FocusUpdateRule) => {
        setCurrentlyFocusedID((idx) => {
            const newIdx = rule(idx, [...focusKeys]);
            if (newIdx === null) return null;
            if (newIdx >= 0 && newIdx < focusKeys.length) {
                return newIdx;
            }
            return null;
        });
    }, [focusKeys]);


    const state: FocusManagerChildContextType = useMemo(() => {
        return ({currentlyFocused, registerFocusable, focus});
    }, [currentlyFocused, focus, registerFocusable]);

    return <FocusManagerChildContext.Provider value={state}>
        {children}
    </FocusManagerChildContext.Provider>;
}

export type FocusActionProps = { focus: (updateRule: FocusUpdateRule) => void }

export function asFocusAction<T extends FocusActionProps>(
    WrappedComponent: React.ComponentType<T>
) {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    function FocusAction(props: Omit<T, keyof FocusActionProps>) {
        const {focus} = useContext(FocusManagerChildContext);
        return <WrappedComponent {...props as T} focus={focus}/>;
    }

    FocusAction.displayName = `asFocusAction(${displayName})`;

    return FocusAction;
}

export type WithFocusProps = { isInFocus: boolean }
type WithFocusHoCProps = { focusId: string }

export function withFocus<T extends WithFocusProps>(
    WrappedComponent: React.ComponentType<T>,
) {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    function ComponentWithFocus(props: Omit<T & WithFocusHoCProps, keyof WithFocusProps>) {
        const {focusId} = props;
        const {currentlyFocused, registerFocusable} = useContext(FocusManagerChildContext);

        useEffect(() => {
            return registerFocusable(focusId);
        }, [focusId, registerFocusable]);

        return <WrappedComponent {...(props as T)} isInFocus={currentlyFocused === focusId}/>;
    }

    ComponentWithFocus.displayName = `withFocus(${displayName})`;

    return ComponentWithFocus;
}