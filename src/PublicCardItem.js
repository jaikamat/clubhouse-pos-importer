import React from 'react';
import { Image, Label } from 'semantic-ui-react';
import MarketPrice from './MarketPrice';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: inline-block;
    margin: 10px 10px 10px 10px;
`;

const InventoryWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 10px 10px 10px 10px;
    box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.25);
`;

const InventoryRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 5px;
`;

const ImageWrapper = styled.div`
    width: 300px;
    height: 418.3px;
    box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.25);
    background: repeating-linear-gradient(45deg, #bfbfbf, #bfbfbf 10px, #b0b0b0 10px, #b0b0b0 20px);
    border-radius: 15px;
`;

export default function PublicCardItem({ card }) {
    const { id, cardImage } = card;
    const [foilQty, nonfoilQty] = card.qohParsed;

    const displayFoil = (
        <InventoryRow>
            <Label color='blue' image>Foil<Label.Detail>{foilQty}</Label.Detail></Label>
            <MarketPrice id={id} publicView={true} finish="FOIL" />
        </InventoryRow>
    );

    const displayNonfoil = (
        <InventoryRow>
            <Label color='blue' image>Nonfoil<Label.Detail>{nonfoilQty}</Label.Detail></Label>
            <MarketPrice id={id} publicView={true} />
        </InventoryRow>
    );

    return <React.Fragment>
        <Wrapper>
            <ImageWrapper>
                <Image src={cardImage} size="medium" style={{ borderRadius: '15px' }} />
            </ImageWrapper>
            <InventoryWrapper>
                {foilQty > 0 ? displayFoil : null}
                {nonfoilQty > 0 ? displayNonfoil : null}
            </InventoryWrapper>
        </Wrapper>
    </React.Fragment>
}