import { FC } from 'react';
import styled from 'styled-components';
import { version } from '../../package.json';

const VersionNumber = styled('div')({
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    color: 'rgba(255,255,255,0.4)',
});

const AppVersion: FC = () => {
    return <VersionNumber>v{version}</VersionNumber>;
};

export default AppVersion;
