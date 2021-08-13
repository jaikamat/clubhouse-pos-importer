require('dotenv').config();
import { Response } from 'express';
import { RequestWithUserInfo } from '../common/types';
import getReceivingById from '../interactors/getReceivingById';

const getReceivedCardsByIdController = async (
    req: RequestWithUserInfo,
    res: Response
) => {
    const { id } = req.params;

    try {
        const message = await getReceivingById(id, req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
};

export default getReceivedCardsByIdController;
