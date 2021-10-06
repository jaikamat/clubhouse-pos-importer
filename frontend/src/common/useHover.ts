import { useState } from 'react';

const useHover = () => {
    const [hovered, setHovered] = useState<boolean>(false);

    const onMouseOver = () => setHovered(true);
    const onMouseOut = () => setHovered(false);

    return [hovered, onMouseOver, onMouseOut] as const;
};

export default useHover;
