import { Alert, Box } from "@mui/material";
import React from "react";

export interface StatusBarProps {
    isSearching?: boolean;

    totalResults?: number | null;
    fromCache?: boolean;

    error?: string | null;

    hitCount?: number;
}

export default function StatusBar({ isSearching = false, totalResults = 0, fromCache, error = null, hitCount = 0 }: StatusBarProps) {
        const searchStatus = isSearching && (
            <Alert severity="info">Searching...</Alert>
        )

        const resultStatus = totalResults !== null && !isSearching && !error && (
            <Alert severity="success">Found {totalResults} results {fromCache ? 'from cache. Hit Count: ' + hitCount : 'from direct API request.'}</Alert>
        )

        const errorStatus = error && (
            <Alert severity="error">{error}</Alert>
        )

        return (<Box display={'flex'} flexDirection={'column'} gap={2} my={2}>
            {searchStatus} 
            {resultStatus}
            {errorStatus}
        </Box>)
    }