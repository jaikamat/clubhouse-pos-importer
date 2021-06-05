import React, { FC, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
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
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <>
            <div>
                <Button size="tiny" onClick={handlePrint} icon>
                    <Icon name="print" />
                </Button>
            </div>
            <PrintWrapper ref={componentRef}>
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
