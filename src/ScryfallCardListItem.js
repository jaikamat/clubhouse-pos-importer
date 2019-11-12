import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

export default class ScryfallCardListItem extends Component {
    render() {
        return <Segment>{this.props.name}</Segment>;
    }
}
