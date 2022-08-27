import React, {
    ComponentType,
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';

/**
 * Either the current index of the focused key from "allKeys" or null if nothing is in focus.
 */
export type FocusIndexType = number | null
export type FocusUpdateRule = (idx: FocusIndexType, allKeys: string[]) => FocusIndexType

type FocusManagerChildContextType = {
    currentlyFocused: string | null,
    registerFocusable: (id: string) => () => void,
    focus: (updateRule: FocusUpdateRule) => void,
    hasNext: boolean,
    hasPrevious: boolean,
}
const FocusManagerChildContext = createContext<FocusManagerChildContextType>(
    undefined as unknown as FocusManagerChildContextType
);

/**
 * Provides a context for the Focus components.
 * Focus components register themselves with a focusId,
 * this id must be unique for that manager instance.
 */
export function FocusManager(props: PropsWithChildren) {
    const {children} = props;
    const [focusKeys, setFocusKeys] = useState<string[]>([]);
    const [currentlyFocusedID, setCurrentlyFocusedID] = useState<FocusIndexType>(null);

    const currentlyFocused = currentlyFocusedID !== null
        ? focusKeys[currentlyFocusedID]
        : null;
    const hasNext = (currentlyFocusedID ?? -1) < focusKeys.length - 1;
    const hasPrevious = (currentlyFocusedID ?? 0) > 0;

    const registerFocusable = useCallback((id: string) => {
        setFocusKeys((prev) => {
            if (prev.includes(id)) throw new Error('focusId has to be unique!');
            return [...prev, id];
        });

        return () => {
            setFocusKeys((prev) => prev.filter((pid) => pid !== id));
        };
    }, []);

    const focus = (rule: FocusUpdateRule) => {
        setCurrentlyFocusedID((idx) => {
            const newIdx = rule(idx, [...focusKeys]);
            if (newIdx === null) return null;
            if (newIdx >= 0 && newIdx < focusKeys.length) {
                return newIdx;
            }
            return null;
        });
    };


    const state: FocusManagerChildContextType = useMemo(() => {
        return ({
            currentlyFocused,
            registerFocusable,
            focus,
            hasNext,
            hasPrevious,
        });
    }, [currentlyFocused, focus, registerFocusable, hasNext, hasPrevious]);

    return <FocusManagerChildContext.Provider value={state}>
        {children}
    </FocusManagerChildContext.Provider>;
}

export type FocusActionProps<T> = T & {
    focus: (updateRule: FocusUpdateRule) => void,
    hasNext: boolean,
    hasPrevious: boolean,
}
export function focusAction<T>(
    WrappedComponent: React.ComponentType<FocusActionProps<T>>
): ComponentType<T> {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    function FocusAction(props: T) {
        const {focus, hasPrevious, hasNext} = useContext(FocusManagerChildContext);
        return <WrappedComponent {...props} focus={focus} hasNext={hasNext} hasPrevious={hasPrevious}/>;
    }

    FocusAction.displayName = `asFocusAction(${displayName})`;

    return FocusAction;
}

export type WithFocusProps<T> = T & { isInFocus: boolean }
type FocusableParams<T> = T & { focusId: string }
export function focusableComponent<T>(
    WrappedComponent: React.ComponentType<WithFocusProps<T>>,
): ComponentType<FocusableParams<T>> {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    function ComponentWithFocus(props: FocusableParams<T>) {
        const {focusId} = props;
        const {currentlyFocused, registerFocusable} = useContext(FocusManagerChildContext);
        const localProps = {...props} as T & Partial<FocusableParams<T>>;
        delete localProps['focusId'];

        useEffect(() => {
            return registerFocusable(focusId);
        }, [focusId, registerFocusable]);

        return <WrappedComponent {...localProps} isInFocus={currentlyFocused === focusId}/>;
    }

    ComponentWithFocus.displayName = `asFocusable(${displayName})`;

    return ComponentWithFocus;
}