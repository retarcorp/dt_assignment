import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

export interface SearchControlsProps {
    onSubmit: (value: string) => void;
    isSearching: boolean;
}

export default function SearchControls({ onSubmit, isSearching = false }: SearchControlsProps) {

    const [value, setValue] = useState('');

    const disabled = isSearching || value.length < 3;
    return <Box gap={4} width={'100%'} display={'flex'} mb={2}>
        <TextField variant="standard" value={value} onChange={(e) => setValue(e.target.value)} sx={{ paddingY: '2px', flexGrow: '1' }} placeholder="Query" />
        <Button variant="contained" disabled={disabled} onClick={() => onSubmit(value)}>Search</Button>
    </Box>
}