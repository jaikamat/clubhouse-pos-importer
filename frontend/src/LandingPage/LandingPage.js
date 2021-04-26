import React from 'react';
import styled from 'styled-components';
import { Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Card from './Card';
import clubhouse_products from './clubhouse_products.png';
import core_2021_draft_booster from './core_2021_draft_booster.png';
import core_2021_collector from './core_2021_collector.jpg';
import double_masters from './double_masters.png';
import zen_meme from './zen_meme.jpg';
import kaldheim from './kaldheim.png';

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
    background-image: linear-gradient(
        to bottom,
        rgba(32, 106, 208, 1),
        rgba(32, 106, 208, 0.85),
        rgba(32, 106, 208, 0.66),
        rgba(255, 255, 255, 1)
    );
    position: absolute;
    top: 0px;
    left: 0px;
    height: 500px;
    width: 100%;
    z-index: -49;
`;

const ImageMask2 = styled.div`
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0),
        rgba(255, 255, 255, 1)
    );
    position: absolute;
    left: 0px;
    height: 400px;
    width: 100%;
    z-index: -49;
`;

const Divider = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 400px;
`;

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const FlexRowResponsive = styled(FlexRow)`
    justify-content: flex-start;

    @media (max-width: 800px) {
        justify-content: center;
        flex-wrap: wrap;
    }
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
        text-align: center;
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
        font-size: 18px;
        text-align: center;
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
    font-size: ${(props) => props.size || '16px'};
    color: ${(props) => props.color || 'black'};
    text-align: ${(props) => (props.align === 'center' ? 'center' : 'left')};
`;

const Spacer = styled.div`
    width: 100%;
    height: ${(props) => props.height || 0}px;
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

const ServiceCard = ({
    icon = 'users',
    header = 'Header',
    content = 'Content',
    align,
}) => {
    return (
        <FlexColumn>
            <IconStyled circular name={icon} size="huge" />
            <Subheader>{header}</Subheader>
            <BodyText color="gray" align={align}>
                {content}
            </BodyText>
        </FlexColumn>
    );
};

const InfoCard = ({
    icon = 'users',
    header = 'Header',
    content = 'Content',
    align,
}) => {
    return (
        <FlexColumn>
            <Icon name={icon} size="big" />
            <Subheader>{header}</Subheader>
            <BodyText color="gray" align={align}>
                {content}
            </BodyText>
        </FlexColumn>
    );
};

export default function LandingPage() {
    return (
        <Wrapper>
            <BaseContent>
                <ContentContainer>
                    <SocialMedia>
                        <div>
                            <a
                                href="https://discord.gg/Wpej7dQ"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FooterIcon link name="discord" size="big" />
                            </a>
                            <a
                                href="https://www.facebook.com/RGTClubhouse/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FooterIcon link name="facebook" size="big" />
                            </a>
                        </div>
                    </SocialMedia>
                    <Spacer height="30" />
                    <Divider>
                        <Slogan>
                            The Clubhouse is open{' '}
                            <span role="img" aria-label="confetti">
                                🎉
                            </span>
                        </Slogan>
                        <Subheader color="white">
                            We are open all week for your CCG needs!{' '}
                            <em>
                                (Play space use and events are cancelled until
                                further notice due to WPN's in-store play
                                suspension)
                            </em>
                        </Subheader>
                        <FlexRowResponsive>
                            <Link to="/public-inventory">
                                <Button>
                                    <b>Browse cards</b>
                                </Button>
                            </Link>
                        </FlexRowResponsive>
                        <ImageMask />
                        <Image />
                    </Divider>

                    <FlexRow>
                        <Header>Latest News</Header>
                    </FlexRow>
                    <Spacer height="30" />
                    <Grid>
                        <Card
                            imageSrc={kaldheim}
                            header="New product preorders!"
                            date="01/03/2021"
                        >
                            <p>
                                Hello everyone, we officially have Kaldheim
                                preorders up! We have 5 products on the lineup
                                starting with Draft Boxes at $100, Set Boxes at
                                $110, Collector Boxes at $219, Bundles at $39,
                                and the Commander Decks at $19. Hope to see you
                                all soon!
                            </p>
                            <p>
                                Note: We are limiting each product to 1 per
                                person.
                            </p>
                        </Card>
                        <Card
                            imageSrc={zen_meme}
                            header="New product preorders!"
                            date="09/05/2020"
                        >
                            <p>
                                Hey everyone! We are excited to announce that we
                                have begun our Zendikar Rising preorders! Come
                                on down starting today and lock in your products
                                of choice. We have the following available:
                            </p>
                            <ul>
                                <li>Regular Booster Box - $100</li>
                                <li>Collector Booster Box - $209</li>
                                <li>Set Booster Box - $110</li>
                                <li>Bundle - $39</li>
                            </ul>

                            <p>
                                Hope you're all as excited for the return to the
                                legendary Zendikar as we are!
                            </p>
                        </Card>
                        <Card
                            imageSrc={double_masters}
                            header="New product preorders!"
                            date="06/08/2020"
                        >
                            <p>
                                <em>
                                    Note: Preorders for Double Masters are now
                                    closed.
                                </em>
                            </p>
                            <p>
                                The time has come! We have had loads of
                                questions about all the upcoming products, and
                                we are excited to start taking PRE ORDERS on a
                                range of upcoming items:
                            </p>
                            <ul>
                                <li>Jump Start $90 per box, Limit 2</li>
                                <li>Double Masters $249 per box, Limit 2</li>
                                <li>
                                    Double Masters VIP $369 per box, No Limit
                                </li>
                                <li>Double Master VIP $95 per pack, Limit 1</li>
                            </ul>
                        </Card>
                        <Card
                            imageSrc={core_2021_collector}
                            header="Collector Booster preorders!"
                            date="06/02/2020"
                        >
                            <p>
                                To compound the excitement, We JUST got numbers
                                on Collector Boosters for Core 2021! We are now
                                taking pre-orders for those as well! $229 per,
                                limit 1 box per customer.
                            </p>
                        </Card>
                        <Card
                            imageSrc={core_2021_draft_booster}
                            header="Core 2021 preorders!"
                            date="06/02/2020"
                        >
                            <p>
                                It's already time. Core 2021 is upon us. We are
                                now taking Booster Box pre-orders! $100 per box,
                                2 boxes per person limit. Pre-release sign ups
                                will begin on June 19th!
                            </p>
                            <p>
                                Note: Preorders for draft booster boxes have now
                                ended. We currently have them for sale at $110
                                each. Collector Booster preorders will end on
                                June 3rd.
                            </p>
                        </Card>
                    </Grid>

                    <Spacer height="30" />

                    <Divider>
                        <Spacer height="30" />
                        <FlexRow>
                            <Header>Our Services</Header>
                        </FlexRow>
                        <FlexRow>
                            {/* <Subheader>
                                We're here for all your CCG needs!
                            </Subheader> */}
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
                    </Divider>
                    <Spacer height="30" />
                    <Grid>
                        <InfoCard
                            icon="clock"
                            header="Hours"
                            content="Mon - Fri 12pm to 7pm, Sat - Sun 11am to 7pm"
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
                <SpanStyle>
                    <Link to="/login" id="login-btn">
                        <Label as="a" color="black">
                            Staff login
                        </Label>
                    </Link>
                </SpanStyle>
                <SpanStyle>
                    <BodyText size="12px" color="white">
                        © 2020 The Clubhouse
                    </BodyText>
                </SpanStyle>
                <SpanStyle>
                    <BodyText size="12px" color="gray">
                        Powered by Scryfall
                    </BodyText>
                </SpanStyle>
            </FooterStyle>
        </Wrapper>
    );
}
