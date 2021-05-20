import React, { FC } from 'react';
import { Image as SurImage, Label } from 'semantic-ui-react';
import MarketPrice from '../common/MarketPrice';
import styled from 'styled-components';
import { InventoryCard } from '../utils/ScryfallCard';
import parseQoh from '../utils/parseQoh';

interface Props {
    card: InventoryCard;
}

// These numbers were the originally calculated px values
const cardImageRatio = 418.3 / 300;
const cardImageWidth = 275;
const cardImageHeight = cardImageRatio * cardImageWidth;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${cardImageWidth}px;
`;

const InventoryWrapper = styled.div`
    display: flex;
    width: 100%;
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
    width: ${cardImageWidth}px;
    height: ${cardImageHeight}px;
    box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.25);
    background: repeating-linear-gradient(
        45deg,
        #bfbfbf,
        #bfbfbf 10px,
        #b0b0b0 10px,
        #b0b0b0 20px
    );
    border-radius: 15px;
`;

const Image = styled(SurImage)({
    borderRadius: '15px',
});

const PublicCardItem: FC<Props> = ({ card }) => {
    const { id, cardImage } = card;
    const [foilQty, nonfoilQty] = parseQoh(card.qoh);

    return (
        <Wrapper>
            <ImageWrapper>
                <Image src={cardImage} size="medium" />
            </ImageWrapper>
            <InventoryWrapper>
                {foilQty > 0 && (
                    <InventoryRow>
                        <Label color="blue" image>
                            Foil<Label.Detail>{foilQty}</Label.Detail>
                        </Label>
                        <MarketPrice
                            id={id}
                            finish="FOIL"
                            round
                            showMid={false}
                        />
                    </InventoryRow>
                )}
                {nonfoilQty > 0 && (
                    <InventoryRow>
                        <Label color="blue" image>
                            Nonfoil<Label.Detail>{nonfoilQty}</Label.Detail>
                        </Label>
                        <MarketPrice
                            id={id}
                            finish="NONFOIL"
                            round
                            showMid={false}
                        />
                    </InventoryRow>
                )}
            </InventoryWrapper>
        </Wrapper>
    );
};

export default PublicCardItem;
