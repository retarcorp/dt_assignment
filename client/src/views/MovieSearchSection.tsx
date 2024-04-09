import React, { useState } from 'react';
import SearchControls from '../components/movie-search/SearchControls';
import StatusBar from '../components/movie-search/StatusBar';
import SearchResults from '../components/movie-search/SearchResults';
import Pagination from '../components/movie-search/Pagination';
import { Box } from '@mui/material';
import { getMovies } from '../api/getMovies';

type MoviesResponse = {
    page: number;
    totalResults: number;
    totalPages: number;
    items: any[];
    hitCounter: number;
    cachedAt: number;
    fromCache: boolean;
}

export default function MovieSearchSection() {

    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(1);
    const [totalResults, setTotalResults] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);


    const onSubmit = async (query: string) => {
        setError(null);
        setIsSearching(true);
        setSearchQuery(query);
        setPage(1);
        await loadMovies(query, 1); 
    }

    const onPageChange = (page: number) => {
        if (page < 1 || page > pageCount) return;
        setPage(page);
        loadMovies(searchQuery, page);
    }

    const [moviesData, setMoviesData] = useState<MoviesResponse | null>(null);

    const loadMovies = async (query: string, page: number) => {
        try {
            const { result }: { result: MoviesResponse } = await getMovies(query, page);
            setMoviesData(result);
            setPageCount(result.totalPages);
            setTotalResults(result.totalResults);
        } catch (e: unknown) {
            setError('Error loading data!');
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    }

    const moviesList = moviesData?.items || [];

    return <div>
        <Box marginX={'auto'} maxWidth={'1100px'}>
            <SearchControls isSearching={isSearching} onSubmit={onSubmit} />
            <StatusBar error={error} isSearching={isSearching} fromCache={moviesData?.fromCache} totalResults={totalResults} hitCount={moviesData?.hitCounter} />
            <Pagination pageCount={pageCount} currentPage={page} onPageChange={onPageChange} />
            <SearchResults items={moviesList}/>
            <Pagination pageCount={pageCount} currentPage={page} onPageChange={onPageChange} />
        </Box>
    </div>
}