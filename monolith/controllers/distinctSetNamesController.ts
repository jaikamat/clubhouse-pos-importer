require('dotenv').config();
import getDistinctSetNames from '../interactors/getDistinctSetNames';
import { Controller, RequestWithUserInfo } from '../common/types';

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
