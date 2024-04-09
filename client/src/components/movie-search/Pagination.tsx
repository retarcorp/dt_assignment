import { Pagination } from "@mui/material";
import React from "react";

export interface PaginationBlockProps {
    pageCount: number;
    currentPage: number;
    onPageChange: (value: number) => void;
    isSearching?: boolean;
}

export default function PaginationBlock({ pageCount, currentPage, onPageChange, isSearching = false}: PaginationBlockProps) {

    return <>
        <Pagination count={pageCount} page={currentPage} onChange={(e, v) => onPageChange(v)} disabled={isSearching}/>
    </>
}