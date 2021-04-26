import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Header, Label, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import { GET_CARD_FROM_ALL_LOCATIONS } from '../utils/api_resources';

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

const QohLabel = ({ label, value }) => (
    <Label {...(value > 0 && { color: 'blue' })} image>
        {label}
        <Label.Detail>{value}</Label.Detail>
    </Label>
);

// TODO: refetch on result set change
export default function AllLocationInventory({ title, searchResults }) {
    const [quantities, setQuantities] = useState({
        ch1: { foilQty: 0, nonfoilQty: 0 },
        ch2: { foilQty: 0, nonfoilQty: 0 },
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(GET_CARD_FROM_ALL_LOCATIONS, {
                    params: { title },
                });

                setQuantities(data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [title, searchResults]);

    return loading ? (
        <FlexContainer>
            <span>Loading totals for all locations</span>
            <div>
                <Loader active inline size="small" />
            </div>
        </FlexContainer>
    ) : (
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
}
