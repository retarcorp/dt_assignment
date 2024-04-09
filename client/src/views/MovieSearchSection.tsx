import React from 'react';
import SearchControls from '../components/movie-search/SearchControls';
import StatusBar from '../components/movie-search/StatusBar';
import SearchResults from '../components/movie-search/SearchResults';
import Pagination from '../components/movie-search/Pagination';
import { Box } from '@mui/material';

export default function MovieSearchSection() {

    const onPageChange = (page: number) => {
        console.log(`Navigating to page ${page}`);
    }

    return <div>
        <Box marginX={'auto'} maxWidth={'1100px'}>
            <SearchControls isSearching={false} onSubmit={(v) => console.log(v)} />
            <StatusBar error={'Unable to fetch from API'} />
            <SearchResults />
            <Pagination pageCount={10} currentPage={3} onPageChange={onPageChange} />
        </Box>
    </div>
}