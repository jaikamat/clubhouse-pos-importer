import { Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useEffect, useState } from 'react';
import { useInventoryContext } from '../context/InventoryContext';
import ControlledSearchBar from '../ui/ControlledSearchBar';
import Loading from '../ui/Loading';
import Placeholder from '../ui/Placeholder';
import { HeaderText } from '../ui/Typography';
import ManageInventoryListItem from './ManageInventoryListItem';
import TotalStoreInventory from './TotalStoreInventory';

export default function ManageInventory() {
    const [term, setTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { searchResults, handleSearchSelect } = useInventoryContext();

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
            <br />
            {loading ? (
                <Loading />
            ) : (
                <>
                    {!searchResults.length && (
                        <Placeholder
                            icon={<SearchIcon style={{ fontSize: 80 }} />}
                        >
                            <em>
                                "For the first time in his life, Grakk felt a
                                little warm and fuzzy inside."
                            </em>
                        </Placeholder>
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
