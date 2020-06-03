import React from 'react';
import styled from 'styled-components';
import { Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import clubhouse_products from './clubhouse_products.png';
import ikoria_splash from './ikoria_splash.jpg';
import core_2021_draft_booster from './core_2021_draft_booster.png';
import core_2021_collector from './core_2021_collector.jpg';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const BaseContent = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 52px;
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 1200px;

    @media (max-width: 800px) {
        width: 100%;
        padding: 0px 10px 0px 10px;
    }
`;

const Image = styled.div`
    background: url(${clubhouse_products});
    background-size: cover;
    position: absolute;
    top: 0px;
    left: 0px;
    height: 500px;
    width: 100%;
    z-index: -50;
`;

const Image2 = styled.div`
    background: url(${clubhouse_products});
    background-size: cover;
    position: absolute;
    left: 0px;
    height: 400px;
    width: 100%;
    z-index: -50;
    opacity: 0.15;
`;

const ImageMask = styled.div`
    background-image: linear-gradient(to bottom, rgba(32, 106, 208, 1), rgba(32, 106, 208, 0.85), rgba(32, 106, 208, 0.66), rgba(255, 255, 255, 1));
    position: absolute;
    top: 0px;
    left: 0px;
    height: 500px;
    width: 100%;
    z-index: -49;
`;

const ImageMask2 = styled.div`
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(255, 255, 255, 1));
    position: absolute;
    left: 0px;
    height: 400px;
    width: 100%;
    z-index: -49;
`;

const Divider = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 500px;
`;

const Divider2 = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 400px;
`;

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const SpanStyle = styled.span`
    margin-right: 10px;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Slogan = styled.h1`
    font-size: 83px;
    color: white;

    @media (max-width: 800px) {
        font-size: 45px;
    }
`;

const Header = styled.p`
    font-size: 50px;
    margin-top: 0px;
    color: black;

    @media (max-width: 800px) {
        font-size: 27px;
    }
`;

const Subheader = styled.p`
    font-size: 23px;
    margin-top: 0px;
    color: ${(props) => props.color || 'black'};

    @media (max-width: 800px) {
        font-size: 15px;
    }
`;

const Button = styled.button`
    outline: none;
    width: 200px;
    height: 45px;
    background-color: rgb(33, 133, 208);
    border-radius: 20px 20px 20px 20px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
    margin-right: 20px;
    margin-top: 10px;
    font-size: 17px;
    color: white;
    border: 0px;
    
    :hover {
        background-color: rgb(35, 139, 219);
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.4);
    }
`;

const CardImage = styled.img`
    width: 100%;
`;

const CardContent = styled.div`
    padding: 2px 16px;
`;

const CardContainer = styled.div`
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    border-radius: 5px 5px 5px 5px;
    width: 380px;
    height: 700px;
    margin: 10px 10px 10px 10px;
    overflow: hidden; // This allows us to edit the borders on the card's border-flush images

    @media (max-width: 800px) {
        width: 320px;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, max-content));
    grid-gap: 10px;
    justify-content: center;

    @media (max-width: 800px) {
        grid-template-columns: repeat(auto-fit, minmax(320px, max-content));
    }
`;

const IconStyled = styled(Icon)`
    background-color: rgb(33, 133, 208);
    color: white;
`;

const FooterIcon = styled(Icon)`
    color: white;
`;

const BodyText = styled.p`
    font-size: 16px;
    color: ${props => props.color || 'black'};
    text-align: ${props => props.align === 'center' ? 'center' : 'left'};
`;

const Spacer = styled.div`
    width: 100%;
    height: ${props => props.height || 0}px;
`;

const FooterStyle = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    background-color: darkslategray;
    width: 100%;
    bottom: 0;
    padding: 0px 10px 0px 10px;
`;

const SocialMedia = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
`;

const Hide = styled.div`
    @media (max-width: 800px) {
        display: none;
    }
`;

const Card = ({ imageSrc, header, date, children }) => {
    return <CardContainer>
        <CardImage src={imageSrc} />
        <CardContent>
            <h3><b>{header}</b></h3>
            <p><em>{date}</em></p>
            <BodyText>{children}</BodyText>
        </CardContent>
    </CardContainer>
}

const ServiceCard = ({ icon = "users", header = "Header", content = "Content", align }) => {
    return <div>
        <FlexColumn>
            <IconStyled circular name={icon} size="huge" />
            <Subheader>{header}</Subheader>
            <BodyText color="gray" align={align}>
                {content}
            </BodyText>
        </FlexColumn>
    </div>
}

const InfoCard = ({ icon = "users", header = "Header", content = "Content", align }) => {
    return <div>
        <FlexColumn>
            <Icon name={icon} size="big" />
            <Subheader>{header}</Subheader>
            <BodyText color="gray" align={align}>
                {content}
            </BodyText>
        </FlexColumn>
    </div>
}

export default function LandingPage() {
    return <Wrapper>
        <BaseContent>
            <ContentContainer>
                <SocialMedia>
                    <div>
                        <a href="https://discord.gg/Wpej7dQ" target="_blank" rel="noopener noreferrer">
                            <FooterIcon link name="discord" size="big" />
                        </a>
                        <a href="https://www.facebook.com/RGTClubhouse/" target="_blank" rel="noopener noreferrer">
                            <FooterIcon link name="facebook" size="big" />
                        </a>
                    </div>
                </SocialMedia>
                <Spacer height="30" />
                <Divider>
                    <Slogan>The Clubhouse is open <span role="img" aria-label="confetti">🎉</span></Slogan>
                    <Subheader color="white">It's official! We are now open 7 days a week, from 2pm to 9pm. Play space is limited to 16 mask-wearing players.</Subheader>
                    <div>
                        {/* <Link to="/calendar">
                            <Button><b>Events calendar</b></Button>
                        </Link> */}
                        <Link to="/public-inventory">
                            <Button><b>Browse cards</b></Button>
                        </Link>
                    </div>
                    <ImageMask />
                    <Image />
                </Divider>

                <FlexRow>
                    <Header>Latest News</Header>
                </FlexRow>
                <Spacer height="30" />
                <Grid>
                    <Card imageSrc={core_2021_collector}
                        header="Collector Booster preorders!"
                        date="06/02/2020">
                        <p>
                            To compound the excitement, We JUST got numbers on Collector Boosters for Core 2021! We are now taking pre-orders for those as well! $229 per, limit 1 box per customer.
                        </p>
                    </Card>
                    <Card imageSrc={core_2021_draft_booster}
                        header="Core 2021 preorders!"
                        date="06/02/2020">
                        <p>
                            It's already time. Core 2021 is upon us. We are now taking Booster Box pre-orders! $100 per box, 2 boxes per person limit. Pre-release sign ups will begin on June 19th!
                        </p>
                    </Card>
                    <Card imageSrc={ikoria_splash}
                        header="Big announcement!"
                        date="05/31/2020">
                        <p>
                            The Clubhouse play space re-opens TOMORROW! We are open 7 days a week from 2pm to 9 pm! There will be a 16 person capacity enforced on seating. MASKS are REQUIRED for play or any customer service.
                        </p>
                        <p>
                            This means EVENTS are returning in a limited capacity. Tuesday and Saturday are FREE PLAY Commander! A pack of Ikoria will be given to the first pod that starts play on each free play day. Wednesday we will have an Ikoria booster draft for $15! First paper Ikoria draft! Then on Friday evening we will be holding a MYSTERY BOOSTER DRAFT for $35! Pack and a half of prize support per participant will be added to the prizes as well as free pizza, and giveaways during our Mystery Booster event!
                        </p>
                    </Card>
                </Grid>

                <Spacer height="30" />

                <Divider2>
                    <Spacer height="30" />
                    <FlexRow>
                        <Header>Our Services</Header>
                    </FlexRow>
                    <FlexRow>
                        <Subheader>We're here for all your CCG needs!</Subheader>
                    </FlexRow>
                    <Spacer height="30" />
                    <Grid>
                        <ServiceCard
                            icon="box"
                            header="Large product selection"
                            content="We stock an extensive selection of singles and CCG supplies just for you! When the deckbuilding itch strikes, turn to us"
                            align="center"
                        />
                        <ServiceCard
                            header="Inclusive community"
                            content="We pride ourselves on our friendly atmosphere. Young or seasoned, beginner or advanced, we welcome all players!"
                            align="center"
                        />
                        <ServiceCard
                            icon="dollar sign"
                            header="Cash or credit trade-ins"
                            content="Whether a whole collection or a single card, come on by and have one of our expert managers appraise it using competitive market rates"
                            align="center"
                        />
                    </Grid>
                    <ImageMask2 />
                    <Image2 />
                </Divider2>
                <Spacer height="30" />
                <Grid>
                    <InfoCard
                        icon="clock"
                        header="Hours"
                        content="2PM to 9PM daily"
                        align="center"
                    />
                    <InfoCard
                        icon="location arrow"
                        header="Location"
                        content="13895 SW Farmington Rd, Beaverton, OR 97005"
                        align="center"
                    />
                    <InfoCard
                        icon="phone"
                        header="Contact"
                        content="(503) 268-1449"
                    />
                </Grid>
                <Spacer height="30" />
            </ContentContainer>
        </BaseContent>
        <FooterStyle>
            <FlexRow>
                <SpanStyle>
                    <Link to="/login" id="login-btn">
                        <Label as='a' color="black">Staff login</Label>
                    </Link>
                </SpanStyle>
                <SpanStyle><BodyText color="white">© 2020 The Clubhouse, LLC</BodyText></SpanStyle>
            </FlexRow>
            <Hide>
                <a href="https://discord.gg/Wpej7dQ" target="_blank" rel="noopener noreferrer">
                    <FooterIcon link name="discord" size="big"></FooterIcon>
                </a>
                <a href="https://www.facebook.com/RGTClubhouse/" target="_blank" rel="noopener noreferrer">
                    <FooterIcon link name="facebook" size="big"></FooterIcon>
                </a>
            </Hide>
        </FooterStyle>
    </Wrapper>
}