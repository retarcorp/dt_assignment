import React from 'react';
import MovieCard from './MovieCard';
import { Box } from '@mui/material';

export default function SearchResults() {

    return <Box display={'flex'} gap={4} justifyContent={'start'} my={2}>
        <MovieCard
            title={'The Matrix'}
            original_title={'The Matrix'}
            original_language={'en'}
            poster_path={'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/hEpWvX6Bp79eLxY1kX5ZZJcme5U.jpg'}
            overview={'A computer hacker learns about the true nature of reality and his role in the war against its controllers.'}
            vote_average={8.1}
            vote_count={17345}
            release_date={'1999-03-30'}
        />

        <MovieCard
            title={'The Matrix'}
            original_title={'The Matrix'}
            original_language={'en'}
            poster_path={'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/hEpWvX6Bp79eLxY1kX5ZZJcme5U.jpg'}
            overview={'A computer hacker learns about the true nature of reality and his role in the war against its controllers.'}
            vote_average={8.1}
            vote_count={17345}
            release_date={'1999-03-30'}
        />

        <MovieCard
            title={'The Matrix'}
            original_title={'The Matrix'}
            original_language={'en'}
            poster_path={'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/hEpWvX6Bp79eLxY1kX5ZZJcme5U.jpg'}
            overview={'A computer hacker learns about the true nature of reality and his role in the war against its controllers.'}
            vote_average={8.1}
            vote_count={17345}
            release_date={'1999-03-30'}
        />

    </Box>
}