import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Label } from 'semantic-ui-react';
import styled from 'styled-components';
import { GET_CARD_FROM_ALL_LOCATIONS } from '../utils/api_resources';

const StyledContainer = styled('div')({
    display: 'inline-flex',
});

export default function SearchMetadata({ title }) {
    const [quantities, setQuantities] = useState({
        ch1: { foilQty: 0, nonfoilQty: 0 },
        ch2: { foilQty: 0, nonfoilQty: 0 },
    });

    const fetchCardQuantities = async () => {
        try {
            const { data } = await axios.get(GET_CARD_FROM_ALL_LOCATIONS, {
                params: { title: 'Birds of Paradise' },
            });

            setQuantities(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCardQuantities().catch((err) => console.log);
    }, []);

    return (
        <>
            <StyledContainer>
                Beaverton totals: {''}
                <Label
                    color={quantities.ch1.foilQty > 0 ? 'blue' : 'transparent'}
                    image
                >
                    Foil<Label.Detail>{quantities.ch1.foilQty}</Label.Detail>
                </Label>
                <Label
                    color={
                        quantities.ch1.nonfoilQty > 0 ? 'blue' : 'transparent'
                    }
                    image
                >
                    Nonfoil
                    <Label.Detail>{quantities.ch1.nonfoilQty}</Label.Detail>
                </Label>
            </StyledContainer>
            <StyledContainer>
                Hillsboro totals: {''}
                <Label
                    color={quantities.ch2.foilQty > 0 ? 'blue' : 'transparent'}
                    image
                >
                    Foil<Label.Detail>{quantities.ch2.foilQty}</Label.Detail>
                </Label>
                <Label
                    color={
                        quantities.ch2.nonfoilQty > 0 ? 'blue' : 'transparent'
                    }
                    image
                >
                    Nonfoil
                    <Label.Detail>{quantities.ch2.nonfoilQty}</Label.Detail>
                </Label>
            </StyledContainer>
        </>
    );
}
