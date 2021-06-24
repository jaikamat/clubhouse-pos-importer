import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
    set: string;
    rarity?: string;
}

const StyledIcon = styled('i')({
    fontSize: '20px',
});

const SetIcon: FC<Props> = ({ set, rarity }) => {
    const rarityClass = rarity ? `ss-${rarity}` : '';
    return <StyledIcon className={`ss ss-fw ss-${set} ${rarityClass}`} />;
};

export default SetIcon;
