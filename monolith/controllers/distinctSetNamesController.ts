require('dotenv').config();
import { Controller, RequestWithUserInfo } from '../common/types';
import getDistinctSetNames from '../interactors/getDistinctSetNames';

const distinctSetNamesController: Controller<RequestWithUserInfo> = async (
    req,
    res
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
