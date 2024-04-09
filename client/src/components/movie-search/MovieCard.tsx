import { Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import React from "react";

export interface MovieCardProps {
    title: string;
    original_title: string;
    original_language: string;
    poster_path: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    release_date: string;
}

export default function MovieCard({ title, original_title, original_language, poster_path, overview, vote_average, vote_count, release_date }: MovieCardProps) {

    return <Card sx={{ maxWidth: '350px'}}>
        <CardHeader title={title}/>
        <CardMedia component="img" src={poster_path} alt={title} title={title}/>
        <CardContent>
            <Typography variant="h6">Original title: {original_title + ' (' + original_language + ')'}</Typography>
            <Typography variant="body1" sx={{ marginY: '10px'}}>{overview}</Typography>
            <Typography variant="body2">Rating: {vote_average} ({vote_count} votes)</Typography>
            <Typography variant="body2">Release date: {release_date}</Typography>
        </CardContent>
    </Card>
}