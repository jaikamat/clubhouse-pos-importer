import React, { FC, useEffect, useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import Price from '../common/Price';
import { SaleListCard } from '../context/SaleContext';
import SalePriceTotal from './SalePriceTotal';

interface Props {
    saleListCards: SaleListCard[];
}

const PrintWrapper = styled.div`
    @media print {
        background-color: white;
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        font-size: 30px;
        line-height: 40px;
        z-index: 5000;
        overflow: hidden;
    }
    @media screen {
        display: none !important;
    }
`;

const PrintList: FC<Props> = ({ saleListCards }) => {
    const [printClicked, setPrintClicked] = useState<boolean>(false);

    useEffect(() => {
        if (printClicked) {
            window.print();
            setPrintClicked(false);
        }
    }, [printClicked]);

    return (
        <>
            <div>
                {saleListCards.length > 0 && (
                    <Button
                        size="tiny"
                        onClick={() => setPrintClicked(true)}
                        icon
                    >
                        <Icon name="print" />
                    </Button>
                )}
            </div>
            <PrintWrapper
                style={{
                    display: printClicked ? 'inline-block' : 'none',
                }}
            >
                <ul>
                    {saleListCards.map((slc) => {
                        return (
                            <li key={slc.id}>
                                <b>
                                    {slc.display_name} | x{slc.qtyToSell} |{' '}
                                    {slc.finishCondition} | {slc.set_name} |{' '}
                                    <Price num={slc.price} />
                                </b>
                            </li>
                        );
                    })}
                </ul>
                <span>
                    <b>
                        Subtotal: <SalePriceTotal saleList={saleListCards} />
                    </b>
                </span>
            </PrintWrapper>
        </>
    );
};

export default PrintList;
