import { useState, useEffect } from 'react';

/**
 * The browser emits a "beforeunload" event right before the user closes a tab or refreshes
 * to indicate freeing resources. We interrupt this process and render a confirmation dialog.
 */
const onInterrupt = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
};

const initBeforeUnload = (showPrompt: boolean) => {
    if (showPrompt) {
        window.addEventListener('beforeunload', onInterrupt);
    } else {
        window.removeEventListener('beforeunload', onInterrupt);
    }
};

/**
 * Custom hook that tracks whether or not we add the listener event,
 * based on an initial value.
 */
const useInterruptExit = (initial: boolean) => {
    const [showPrompt, setShowPrompt] = useState<boolean>(initial);

    initBeforeUnload(showPrompt);

    useEffect(() => {
        initBeforeUnload(showPrompt);

        // Remember to remove the listener on unmount!
        return () => {
            window.removeEventListener('beforeunload', onInterrupt);
        };
    }, [showPrompt]);

    return [showPrompt, setShowPrompt] as const;
};

export default useInterruptExit;
