import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import clubhouse_products from './clubhouse_products.png';
import play_area from './play_area.jpg';
import ch1 from './learn_to_play.jpg';
import ch2 from './ch2.jpg';

const colors = {
    primary: '#2185d0',
    white: '#ffffff',
    gray: {
        light: '#99aab5',
        main: '#2c2f33',
        dark: '#23272a',
    },
};

const primaryRbg = `rgba(33, 133, 208)`;

const desktopMediaQuery = `@media only screen and (min-width: 769px)`;
const tabletMediaQuery = `@media only screen and (max-width: 768px)`;

const headerHeight = 52;
const borderRadius = 7;

const HeroImageContainer = styled('div')({
    width: '100%',
    height: 500,
});

const Container = styled('div')({
    marginTop: headerHeight,
});

interface ImageProps {
    src: string;
    rounded?: boolean;
}

const Image = styled.div<ImageProps>`
    background: url(${({ src }) => src});
    background-size: cover;
    height: 100%;
    width: 100%;
    border-radius: ${({ rounded }) => (rounded ? `${borderRadius}px` : '0px')};
`;

const LocationImageContainer = styled('div')({
    width: '100%',
    height: 350,
    borderRadius: borderRadius,
});

const ImageGradient = styled('div')({
    backgroundImage: `linear-gradient(
        to top,
        rgba(44, 47, 51, 0.9),
        rgba(44, 47, 51, 0.85),
        rgba(44, 47, 51, 0.70),
        rgba(255, 255, 255, 0)
    )`,
    height: '100%',
    width: '100%',
});

const ImageGradient2 = styled('div')({
    backgroundColor: 'rgba(44, 47, 51, 0.85)',
    height: '100%',
    width: '100%',
    borderRadius: borderRadius,
});

const HeroText = styled('h1')({
    color: colors.white,
    textAlign: 'center',
    [tabletMediaQuery]: {
        fontSize: 40,
    },
    [desktopMediaQuery]: {
        fontSize: 50,
    },
});

interface HeaderTextProps {
    inverted?: boolean;
}

const HeaderText = styled.h1<HeaderTextProps>`
    color: ${({ inverted }) => (inverted ? colors.white : colors.gray.main)};
`;

const SectionText = styled('h2')({
    color: colors.white,
    textAlign: 'center',
});

const SubheaderText = styled('div')({
    color: colors.white,
    fontSize: 18,
});

const HeaderContainer = styled('div')({
    display: 'flex',
    height: 'inherit',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
});

const ServicesContainer = styled('div')({
    display: 'grid',
    gridGap: 60,
    [tabletMediaQuery]: {
        gridTemplateRows: '1fr 1fr 1fr',
    },
    [desktopMediaQuery]: {
        gridTemplateColumns: '1fr 1fr 1fr',
    },
});

const LocationsContainer = styled('div')({
    display: 'grid',
    gridGap: 20,
    [tabletMediaQuery]: {
        gridTemplateRows: '1fr 1fr',
    },
    [desktopMediaQuery]: {
        gridTemplateColumns: '1fr 1fr',
    },
});

const LocationContainer = styled('div')({
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
});

const Content = styled('div')({
    padding: 20,
});

interface DescriptionProps {
    inverted?: boolean;
}

const Description = styled.div<DescriptionProps>`
    color: ${({ inverted }) => (inverted ? colors.white : colors.gray.main)};
    font-size: 18px;
`;

const TextWidth = styled('div')({
    [tabletMediaQuery]: {
        width: '100%',
    },
    [desktopMediaQuery]: {
        width: '50%',
    },
});

const IconContainer = styled('div')({
    padding: 40,
    backgroundColor: colors.gray.main,
    borderRadius: borderRadius,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});

const SectionDivider = styled('div')({
    width: '100%',
    padding: 40,
});

const Footer = styled('div')({
    bottom: 0,
    backgroundColor: colors.gray.dark,
    [tabletMediaQuery]: {
        padding: 20,
    },
    [desktopMediaQuery]: {
        paddingLeft: 40,
        paddingBottom: 20,
        paddingRight: 40,
        paddingTop: 40,
    },
});

interface FlexRowProps {
    justify?: 'center' | 'space-between';
}

const FlexRow = styled.div<FlexRowProps>`
    display: flex;
    justify-content: ${({ justify }) => justify || 'space-between'};
    align-items: center;
`;

const Home: FC = () => {
    return (
        <Container>
            <HeroImageContainer>
                <Image src={play_area}>
                    <ImageGradient>
                        <HeaderContainer>
                            <HeroText>The Clubhouse is open 🎉</HeroText>
                            <TextWidth>
                                <SubheaderText>
                                    We are open all week for your CCG needs!
                                    (Play space use and events are cancelled
                                    until further notice due to WPN's in-store
                                    play suspension)
                                </SubheaderText>
                            </TextWidth>
                            <br />
                            <Link to="/public-inventory">
                                <Button size="huge" primary>
                                    Browse cards
                                </Button>
                            </Link>
                        </HeaderContainer>
                    </ImageGradient>
                </Image>
            </HeroImageContainer>
            <SectionDivider />
            <Content>
                <HeaderText>Your local game store.</HeaderText>
                <TextWidth>
                    <Description>
                        Play space use and events are cancelled until further
                        notice due to WPN's in-store play suspension. Play space
                        use and events are cancelled until further notice due to
                        WPN's in-store play suspension
                    </Description>
                </TextWidth>
            </Content>
            <Content>
                <ServicesContainer>
                    <div>
                        <IconContainer>
                            <Icon name="box" size="huge" inverted />
                            <SectionText>Large product selection</SectionText>
                        </IconContainer>
                        <br />
                        <Description>
                            We stock an extensive selection of singles and CCG
                            supplies just for you! When the deckbuilding itch
                            strikes, turn to us
                        </Description>
                    </div>
                    <div>
                        <IconContainer>
                            <Icon name="users" size="huge" inverted />
                            <SectionText>Inclusive community</SectionText>
                        </IconContainer>
                        <br />
                        <Description>
                            We pride ourselves on our friendly atmosphere. Young
                            or seasoned, beginner or advanced, we welcome all
                            players!
                        </Description>
                    </div>
                    <div>
                        <IconContainer>
                            <Icon name="dollar sign" size="huge" inverted />
                            <SectionText>Cash or credit trade-ins</SectionText>
                        </IconContainer>
                        <br />
                        <Description>
                            Whether a whole collection or a single card, come on
                            by and have one of our expert managers appraise it
                            using competitive market rates
                        </Description>
                    </div>
                </ServicesContainer>
            </Content>
            <SectionDivider />
            <Content>
                <HeaderText>Two convenient locations</HeaderText>
                <LocationsContainer>
                    <LocationImageContainer>
                        <Image src={ch1} rounded>
                            <ImageGradient2>
                                <LocationContainer>
                                    <HeaderText inverted>Beaverton</HeaderText>
                                    <SectionDivider />
                                    <div>
                                        <Description inverted>
                                            <Icon
                                                name="map marker alternate"
                                                size="large"
                                                inverted
                                            />
                                            13895 SW Farmington Rd, Beaverton,
                                            OR 97005
                                        </Description>
                                        <br />
                                        <Description inverted>
                                            <Icon
                                                name="clock"
                                                size="large"
                                                inverted
                                            />
                                            Mon - Fri 12pm to 7pm, Sat - Sun
                                            11am to 7pm
                                        </Description>
                                        <br />
                                        <Description inverted>
                                            <Icon
                                                name="phone"
                                                size="large"
                                                inverted
                                            />
                                            (503) 268-1449
                                        </Description>
                                    </div>
                                </LocationContainer>
                            </ImageGradient2>
                        </Image>
                    </LocationImageContainer>
                    <LocationImageContainer>
                        <Image src={ch2} rounded>
                            <ImageGradient2>
                                <LocationContainer>
                                    <HeaderText inverted>Hillsboro</HeaderText>
                                    <SectionDivider />
                                    <div>
                                        <Description inverted>
                                            <Icon
                                                name="map marker alternate"
                                                size="large"
                                                inverted
                                            />
                                            1300 SW Oak St Suite B, Hillsboro,
                                            OR 97123
                                        </Description>
                                        <br />
                                        <Description inverted>
                                            <Icon
                                                name="clock"
                                                size="large"
                                                inverted
                                            />
                                            Mon - Fri 12pm to 7pm, Sat - Sun
                                            11am to 7pm
                                        </Description>
                                        <br />
                                        <Description inverted>
                                            <Icon
                                                name="phone"
                                                size="large"
                                                inverted
                                            />
                                            (971) 249-3096
                                        </Description>
                                    </div>
                                </LocationContainer>
                            </ImageGradient2>
                        </Image>
                    </LocationImageContainer>
                </LocationsContainer>
            </Content>
            <SectionDivider />
            <LocationImageContainer>
                <Image src={clubhouse_products}>
                    <ImageGradient>
                        <HeaderContainer>
                            <HeroText>We look forward to seeing you</HeroText>
                            <TextWidth>
                                <SubheaderText>
                                    Follow us on Facebook or become a member of
                                    our Discord community for up-to-date
                                    announcements on store events, product
                                    releases, preorders, and so much more!
                                </SubheaderText>
                            </TextWidth>
                        </HeaderContainer>
                    </ImageGradient>
                </Image>
            </LocationImageContainer>
            <Footer>
                <FlexRow>
                    <Description inverted>© 2021 The Clubhouse</Description>
                    <div>
                        <a
                            href="https://discord.gg/Wpej7dQ"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icon link name="discord" size="huge" inverted />
                        </a>
                        <a
                            href="https://www.facebook.com/RGTClubhouse/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icon link name="facebook" size="huge" inverted />
                        </a>
                    </div>
                </FlexRow>
                <FlexRow justify="center">
                    <Link to="/login">
                        <Button size="tiny" color="black">
                            Staff login
                        </Button>
                    </Link>
                </FlexRow>
            </Footer>
        </Container>
    );
};

export default Home;
