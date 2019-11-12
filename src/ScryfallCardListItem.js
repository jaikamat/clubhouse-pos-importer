import React, { Component } from 'react';
import { Segment, Image, Dropdown } from 'semantic-ui-react';

const finishes = [
    { key: 'NONFOIL', text: 'Nonfoil', value: 'NONFOIL' },
    { key: 'FOIL', text: 'Foil', value: 'FOIL' }
];

const cardConditions = [
    { key: 'NM', text: 'Near Mint', value: 'NM' },
    { key: 'LP', text: 'Light Play', value: 'LP' },
    { key: 'MP', text: 'Moderate Play', value: 'MP' },
    { key: 'HP', text: 'Heavy Play', value: 'HP' }
];

function checkCardFinish(nonfoilProp, foilProp) {
    if (!nonfoilProp && foilProp) {
        return { selectedFinish: 'FOIL', finishDisabled: true };
    } else if (nonfoilProp && !foilProp) {
        return { selectedFinish: 'NONFOIL', finishDisabled: true };
    } else if (nonfoilProp && foilProp) {
        return { selectedFinish: 'NONFOIL', finishDisabled: false };
    }
}

export default class ScryfallCardListItem extends Component {
    state = {
        foil: null,
        condition: '',
        selectedFinish: 'NONFOIL',
        selectedCondition: 'NM',
        finishDisabled: false
    };

    render() {
        const { selectedFinish, selectedCondition, finishDisabled } = this.state;
        const { image_uris, name, set_name, set, artist } = this.props;

        return (
            <Segment>
                <Image src={image_uris.normal} verticalAlign="middle" size="tiny" />
                {name} - {set_name} ({String(set).toUpperCase()}) - {artist}
                <Dropdown
                    defaultValue={selectedFinish}
                    selection
                    options={finishes}
                    disabled={finishDisabled}
                />
                <Dropdown defaultValue={selectedCondition} selection options={cardConditions} />
                --- QTY
            </Segment>
        );
    }
}

// nonfoil is false if it's only foil
// foil is true if a foil exists of it
