import React, { FC, useEffect, useState } from 'react';
import { Header, Label, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import { InventoryCard } from '../utils/ScryfallCard';
import allLocationInventoryQuery, {
    Response,
} from './allLocationInventoryQuery';

const StyledContainer = styled('div')({
    display: 'inline',
});

const FlexContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    '& > *': {
        marginLeft: '10px',
    },
});

interface QohLabelProps {
    label: string;
    value: number;
}

const QohLabel: FC<QohLabelProps> = ({ label, value }) => (
    <Label {...(value > 0 && { color: 'blue' })} image>
        {label}
        <Label.Detail>{value}</Label.Detail>
    </Label>
);

interface AllLocationInventoryProps {
    title: string;
    searchResults: InventoryCard[];
}

// TODO: refetch on result set change
const AllLocationInventory: FC<AllLocationInventoryProps> = ({
    title,
    searchResults,
}) => {
    const [quantities, setQuantities] = useState<Response['data']>({
        ch1: { foilQty: 0, nonfoilQty: 0 },
        ch2: { foilQty: 0, nonfoilQty: 0 },
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await allLocationInventoryQuery({ title });
                setQuantities(data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [title, searchResults]);

    if (loading) {
        return (
            <FlexContainer>
                <span>Loading totals for all locations</span>
                <div>
                    <Loader active inline size="small" />
                </div>
            </FlexContainer>
        );
    }

    return (
        <FlexContainer>
            <div>
                <Header sub>Beaverton totals:</Header>
                <StyledContainer>
                    <QohLabel label="Foil" value={quantities.ch1.foilQty} />
                    <QohLabel
                        label="Nonfoil"
                        value={quantities.ch1.nonfoilQty}
                    />
                </StyledContainer>
            </div>
            <div>
                <Header sub>Hillsboro totals:</Header>
                <StyledContainer>
                    <QohLabel label="Foil" value={quantities.ch2.foilQty} />
                    <QohLabel
                        label="Nonfoil"
                        value={quantities.ch2.nonfoilQty}
                    />
                </StyledContainer>
            </div>
        </FlexContainer>
    );
};

export default AllLocationInventory;
