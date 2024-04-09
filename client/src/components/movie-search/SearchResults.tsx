import React from 'react';
import MovieCard from './MovieCard';
import { Box } from '@mui/material';

export default function SearchResults({ items: movies }: { items: any[] }) {

    return <Box display={'flex'} flexDirection="row" gap={4} justifyContent={'start'} my={2} flexWrap={'wrap'} alignItems={'stretch'}>
        {movies.map((movie: any) => <MovieCard key={movie.id} {...movie}/>)}
    </Box>
}