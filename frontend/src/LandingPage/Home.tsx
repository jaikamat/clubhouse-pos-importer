import { Box, Button, withStyles } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import FacebookIcon from '@material-ui/icons/Facebook';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import PeopleIcon from '@material-ui/icons/People';
import PhoneIcon from '@material-ui/icons/Phone';
import RoomIcon from '@material-ui/icons/Room';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ch2 from './ch2.jpg';
import clubhouse_products from './clubhouse_products.png';
import DiscordIcon from './DiscordIcon';
import learn_to_play from './learn_to_play.jpg';
import ch1 from './tables.jpg';

const colors = {
    primary: '#2185d0',
    white: '#ffffff',
    gray: {
        light: '#99aab5',
        main: '#2c2f33',
        dark: '#23272a',
    },
};

const primaryRgb = '13, 49, 69,';
const bodyBackground = '#f8f5ef';

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

const CenterIcon = withStyles({
    root: {
        verticalAlign: 'middle',
        display: 'inline',
    },
})(Box);

const HeroIcon = withStyles({
    root: {
        '& > *': {
            fontSize: 80,
            color: '#ffffff',
        },
        display: 'inline',
    },
})(Box);

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
        rgba(${primaryRgb} 0.9),
        rgba(${primaryRgb} 0.85),
        rgba(${primaryRgb} 0.70),
        rgba(${primaryRgb} 0.60),
        rgba(255, 255, 255, 0)
    )`,
    height: '100%',
    width: '100%',
});

const ImageGradient2 = styled('div')({
    backgroundColor: `rgba(${primaryRgb} 0.85)`,
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
        <Container style={{ backgroundColor: bodyBackground }}>
            <HeroImageContainer>
                <Image src={learn_to_play}>
                    <ImageGradient>
                        <HeaderContainer>
                            <HeroText>The Clubhouse is open 🎉</HeroText>
                            <TextWidth>
                                <SubheaderText>
                                    <SectionText>
                                        We are open all week for your tabletop
                                        gaming needs!
                                    </SectionText>
                                </SubheaderText>
                            </TextWidth>
                            <br />
                            <Link to="/public-inventory">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
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
                        We take pride in our friendly community of players, and
                        always ensure that our customers are well served.
                    </Description>
                </TextWidth>
            </Content>
            <Content>
                <ServicesContainer>
                    <div>
                        <IconContainer>
                            <HeroIcon>
                                <LocalOfferIcon />
                            </HeroIcon>
                            <SectionText>Large product selection</SectionText>
                        </IconContainer>
                        <br />
                        <Description>
                            We stock an extensive selection of singles and CCG
                            supplies just for you! When the deck-building itch
                            strikes, turn to us
                        </Description>
                    </div>
                    <div>
                        <IconContainer>
                            <HeroIcon>
                                <PeopleIcon />
                            </HeroIcon>
                            <SectionText>Inclusive community</SectionText>
                        </IconContainer>
                        <br />
                        <Description>
                            Young or seasoned, beginner or advanced, we welcome
                            all players!
                        </Description>
                    </div>
                    <div>
                        <IconContainer>
                            <HeroIcon>
                                <AttachMoneyIcon />
                            </HeroIcon>
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
                                            <CenterIcon>
                                                <RoomIcon fontSize="large" />
                                            </CenterIcon>
                                            13895 SW Farmington Rd, Beaverton,
                                            OR 97005
                                        </Description>
                                        <br />
                                        <Description inverted>
                                            <CenterIcon>
                                                <WatchLaterIcon fontSize="large" />
                                            </CenterIcon>
                                            11am - 9pm Daily
                                        </Description>
                                        <br />
                                        <Description inverted>
                                            <CenterIcon>
                                                <PhoneIcon fontSize="large" />
                                            </CenterIcon>
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
                                            <CenterIcon>
                                                <RoomIcon fontSize="large" />
                                            </CenterIcon>
                                            1300 SW Oak St Suite B, Hillsboro,
                                            OR 97123
                                        </Description>
                                        <br />
                                        <Description inverted>
                                            <CenterIcon>
                                                <WatchLaterIcon fontSize="large" />
                                            </CenterIcon>
                                            10am - 7pm Daily
                                        </Description>
                                        <br />
                                        <Description inverted>
                                            <CenterIcon>
                                                <PhoneIcon fontSize="large" />
                                            </CenterIcon>
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
                                    releases, pre-orders, and so much more!
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
                            href="https://discord.gg/2mT47yycB4"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <HeroIcon>
                                <DiscordIcon />
                            </HeroIcon>
                        </a>
                        <a
                            href="https://www.facebook.com/RGTClubhouse/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <HeroIcon>
                                <FacebookIcon />
                            </HeroIcon>
                        </a>
                    </div>
                </FlexRow>
                <FlexRow justify="center">
                    <Link to="/login">
                        <Button color="primary">Staff login</Button>
                    </Link>
                </FlexRow>
            </Footer>
        </Container>
    );
};

export default Home;
