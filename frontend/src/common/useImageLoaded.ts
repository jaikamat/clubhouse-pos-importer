import { useEffect, useRef, useState } from 'react';

/**
 * This custom hook exposes a ref that we attach to an `img` tag, in order to
 * examine its `complete` attribute so we know that an image is loaded.
 *
 * We use `loaded` to maintain the view
 */
const useImageLoaded = () => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const ref = useRef<HTMLImageElement | null>(null);

    const onLoad = () => {
        setLoaded(true);
    };

    useEffect(() => {
        if (ref.current && ref.current.complete) {
            onLoad();
        }
    });

    return [ref, loaded, onLoad] as const;
};

export default useImageLoaded;
