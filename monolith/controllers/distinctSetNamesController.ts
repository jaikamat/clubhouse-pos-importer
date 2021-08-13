require('dotenv').config();
import getDistinctSetNames from '../interactors/getDistinctSetNames';
import { RequestWithUserInfo } from '../common/types';
import { Response } from 'express';

const distinctSetNamesController = async (
    req: RequestWithUserInfo,
    res: Response
) => {
    try {
        const names = await getDistinctSetNames(req.currentLocation);
        res.status(200).send(names);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export default distinctSetNamesController;
