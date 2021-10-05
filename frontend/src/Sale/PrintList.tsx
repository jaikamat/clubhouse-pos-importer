import { IconButton } from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';
import React, { FC, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import Price from '../common/Price';
import { SaleListCard } from '../context/SaleContext';
import displayFinishCondition from '../utils/displayFinishCondition';
import SaleCartPriceTotal from './SaleCartPriceTotal';

interface Props {
    saleListCards: SaleListCard[];
}

const PrintWrapper = styled.div`
    @media print {
        background-color: white;
        margin: 0;
        padding: 0;
        font-size: 20px;
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
                <IconButton onClick={handlePrint} size="small">
                    <PrintIcon />
                </IconButton>
            </div>
            <PrintWrapper ref={componentRef}>
                <ul>
                    {saleListCards.map((slc) => {
                        const {
                            id,
                            display_name,
                            qtyToSell,
                            finishCondition,
                            set_name,
                            price,
                        } = slc;
                        return (
                            <li key={id}>
                                <b>
                                    {display_name} | x{qtyToSell} |{' '}
                                    {displayFinishCondition(finishCondition)} |{' '}
                                    {set_name} | <Price num={price} />
                                </b>
                            </li>
                        );
                    })}
                </ul>
                <span>
                    <b>
                        Subtotal:{' '}
                        <SaleCartPriceTotal saleList={saleListCards} />
                    </b>
                </span>
            </PrintWrapper>
        </>
    );
};

export default PrintList;
