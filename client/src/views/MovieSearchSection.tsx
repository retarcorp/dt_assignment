import React from 'react';
import SearchControls from '../components/movie-search/SearchControls';
import StatusBar from '../components/movie-search/StatusBar';
import SearchResults from '../components/movie-search/SearchResults';

export default function MovieSearchSection() {
    return <div>
        <SearchControls />
        <StatusBar />
        <SearchResults />
    </div>
}