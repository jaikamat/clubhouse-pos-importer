import React from 'react';
import styled from 'styled-components';

const Text = styled.p`
    font-size: 16px;
    color: black;
    text-align: left;
`;

const Image = styled.img`
    width: 100%;
`;

const Content = styled.div`
    padding: 2px 16px;
`;

const Container = styled.div`
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

export default function Card({ imageSrc, header, date, children }) {
    return <Container>
        <Image src={imageSrc} />
        <Content>
            <h3><b>{header}</b></h3>
            <p><em>{date}</em></p>
            <Text>{children}</Text>
        </Content>
    </Container>
}