import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { decrementPage, fetchTableData, incrementPage } from "../Redux/dataSlice";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const FilterBar = () => {
    const dispatch = useDispatch();
    const locations = useSelector((state) => state.data.locations);
    const industries = useSelector((state) => state.data.industries);
    const page = useSelector((state) => state.data.page);
    const tableData = useSelector((state) => state.data.tableData);

    const [location, setLocation] = useState("");
    const [industry, setIndustry] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        // Fetch data whenever page pr filter changes
        dispatch(fetchTableData({ page, size: 15, location, industry, query }));
    }, [page, location, industry, query, dispatch]);

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const fetchDataWithFilters = debounce((location, industry, query) => {
        dispatch(fetchTableData({ page, size: 15, location, industry, query }));
    }, 500);

    const handleInputChange = () => {
        const newLocation = document.getElementById('location-select').value;
        const newIndustry = document.getElementById('industry-select').value;
        const newQuery = document.getElementById('search-box').value;

        setLocation(newLocation);
        setIndustry(newIndustry);
        setQuery(newQuery);

        fetchDataWithFilters(newLocation, newIndustry, newQuery);
    };

    const handlePreviousPage = () => {
        dispatch(decrementPage());
    };

    const handleNextPage = () => {
        dispatch(incrementPage());
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "TableData");
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        saveAs(blob, "tableData.xlsx");
    };

    return (
        <div className="filter-bar">
            <button className="page-button" onClick={handlePreviousPage} disabled={page === 0}>
                Previous
            </button>
            <select id="location-select" className="filter-select" onChange={handleInputChange}>
                <option value="">All Locations ({locations.length})</option>
                {locations.map((loc, index) => (
                    <option key={index} value={loc}>{loc}</option>
                ))}
            </select>

            <select id="industry-select" className="filter-select" onChange={handleInputChange}>
                <option value="">All Industries ({industries.length})</option>
                {industries.map((ind, index) => (
                    <option key={index} value={ind}>{ind}</option>
                ))}
            </select>

            <input
                type="text"
                className="filter-input"
                id="search-box"
                placeholder="Search by Customer Name or Description"
                onChange={handleInputChange}
            />
            <button className="page-button" onClick={handleNextPage}>
                Next
            </button>

            <button className="export-button" id="export-button" onClick={exportToExcel}>Export to Excel</button>
        </div>
    );
};

export default FilterBar;
