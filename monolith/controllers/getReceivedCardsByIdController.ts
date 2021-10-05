require('dotenv').config();
import { Controller, RequestWithUserInfo } from '../common/types';
import getReceivingById from '../interactors/getReceivingById';

const getReceivedCardsByIdController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    const { id } = req.params;

    const message = await getReceivingById(id, req.currentLocation);
    res.status(200).send(message);
};

export default getReceivedCardsByIdController;
