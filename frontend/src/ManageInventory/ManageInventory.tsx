import React, { useContext, useEffect, useState } from 'react';
import { Segment, Header, Icon, Divider } from 'semantic-ui-react';
import AllLocationInventory from './AllLocationInventory';
import { InventoryContext } from '../context/InventoryContext';
import ManageInventoryListItem from './ManageInventoryListItem';
import { Grid } from '@material-ui/core';
import { HeaderText } from '../ui/Typography';
import ControlledSearchBar from '../common/ControlledSearchBar';
import Loading from '../ui/Loading';

export default function ManageInventory() {
    const [term, setTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { searchResults, handleSearchSelect } = useContext(InventoryContext);

    useEffect(() => {
        if (term) {
            (async () => {
                setLoading(true);
                await handleSearchSelect(term);
                setLoading(false);
            })();
        }
    }, [term]);

    return (
        <>
            <ControlledSearchBar value={term} onChange={(v) => setTerm(v)} />
            <br />
            <Grid container justify="space-between">
                <HeaderText>Manage Inventory</HeaderText>
                {searchResults.length > 0 && (
                    <AllLocationInventory
                        searchResults={searchResults}
                        title={searchResults[0].name}
                    />
                )}
            </Grid>
            <Divider />
            {loading ? (
                <Loading />
            ) : (
                <>
                    {!searchResults.length && (
                        <Segment placeholder>
                            <Header icon>
                                <Icon name="search" />
                                <em>
                                    "For the first time in his life, Grakk felt
                                    a little warm and fuzzy inside."
                                </em>
                            </Header>
                        </Segment>
                    )}
                    <Grid container spacing={2}>
                        {searchResults.map((card) => (
                            <Grid item xs={12} key={card.id}>
                                <ManageInventoryListItem card={card} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </>
    );
}
