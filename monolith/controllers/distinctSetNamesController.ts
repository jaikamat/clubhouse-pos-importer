require('dotenv').config();
import { Controller, RequestWithUserInfo } from '../common/types';
import getDistinctSetNames from '../interactors/getDistinctSetNames';

const distinctSetNamesController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    const names = await getDistinctSetNames(req.currentLocation);
    res.status(200).send(names);
};

export default distinctSetNamesController;
