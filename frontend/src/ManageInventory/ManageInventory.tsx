import React, { useContext, useEffect, useState } from 'react';
import { Segment, Header, Icon, Divider } from 'semantic-ui-react';
import TotalStoreInventory from './TotalStoreInventory';
import { InventoryContext } from '../context/InventoryContext';
import ManageInventoryListItem from './ManageInventoryListItem';
import { Grid } from '@material-ui/core';
import { HeaderText } from '../ui/Typography';
import Loading from '../ui/Loading';
import ControlledSearchBar from '../ui/ControlledSearchBar';

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
            <Grid container>
                <Grid item xs={12} md={4}>
                    <ControlledSearchBar
                        value={term}
                        onChange={(v) => setTerm(v)}
                    />
                </Grid>
            </Grid>
            <br />
            <Grid container justify="space-between">
                <HeaderText>Manage Inventory</HeaderText>
                {searchResults.length > 0 && (
                    <TotalStoreInventory
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
