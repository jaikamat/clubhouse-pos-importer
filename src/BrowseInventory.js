import React from 'react';
import axios from 'axios';
import InventoryTable from './InventoryTable';
import { GET_INVENTORY_QUERY } from './api_resources';

class BrowseInventory extends React.Component {
    // sort by cmc, name (alphaebetically)
    // search on card type (tribal, art, ench, creat, inst, sorc, land, PW) via type line
    // search by color identity

    state = {
        sort: '',
        cardType: '',
        colorIdentity: '',
        typeLine: '',
        inventory: [],
        skip: 0
    };

    async componentDidMount() {
        const { data } = await axios.get(GET_INVENTORY_QUERY);
        this.setState({ inventory: data });
    }

    render() {
        const { inventory } = this.state;
        return (
            <div>
                <InventoryTable cards={inventory} />
            </div>
        );
    }
}

export default BrowseInventory;
