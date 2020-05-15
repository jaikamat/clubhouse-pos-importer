import React, { Component } from 'react';
import SearchBar from '../SearchBar';
import SalesList from './SalesList';
import axios from 'axios';
import makeAuthHeader from '../makeAuthHeader';
import { GET_SALES_BY_TITLE } from '../utils/api_resources';
import { Header, Divider } from 'semantic-ui-react';

class BrowseSales extends Component {
    state = { salesList: [], cardName: '' };

    handleSearchSelect = async cardName => {
        const { data } = await axios.get(GET_SALES_BY_TITLE, {
            params: { cardName: cardName },
            headers: makeAuthHeader()
        });

        this.setState({ salesList: data, cardName: cardName });
    };

    render() {
        const { salesList, cardName } = this.state;

        return (
            <div>
                <SearchBar handleSearchSelect={this.handleSearchSelect} />

                <Header as="h2">Browse Sales</Header>
                <Divider />

                <span>
                    <em>
                        {cardName !== '' && (
                            <h4>
                                {salesList.length} results for {cardName}
                            </h4>
                        )}
                    </em>
                </span>
                <SalesList list={salesList} />
            </div>
        );
    }
}

export default BrowseSales;
