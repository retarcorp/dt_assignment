import { Alert, Box } from "@mui/material";
import React from "react";

export interface StatusBarProps {
    isSearching?: boolean;

    totalResults?: number;
    fromCache?: boolean;

    error?: string | null;
}

export default function StatusBar({ isSearching = false, totalResults = 0, fromCache, error = null }: StatusBarProps) {
        const searchStatus = isSearching && (
            <Alert severity="info">Searching...</Alert>
        )

        const resultStatus = !isSearching && !error && (
            <Alert severity="success">Found {totalResults} results {fromCache ? 'from cache.' : 'from direct API request.'}</Alert>
        )

        const errorStatus = error && (
            <Alert severity="error">{error}</Alert>
        )

        return (<Box display={'flex'} flexDirection={'column'} gap={2}>
            {searchStatus} 
            {resultStatus}
            {errorStatus}
        </Box>)
    }