// src/ComicSearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComicSearch = () => {
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [comics, setComics] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false); // Loading state

    const categories = ['Marvel', 'DC', 'Image', 'Dark Horse']; // Add more categories as needed

    // Function to fetch comics based on the search input or selected category
    const fetchComics = async (pageNumber = 1) => {
        setLoading(true); // Set loading to true when starting the fetch
        const baseURL = `http://localhost:8080/api/comics/search`;
        const params = {
            query: selectedCategory === 'All' ? query : selectedCategory,
            page: pageNumber,
        };
        
        try {
            const response = await axios.get(baseURL, { params });
            setComics(response.data);
            setTotalPages(Math.ceil(response.data.length / 10)); // Assuming 10 items per page
        } catch (error) {
            console.error('Error fetching comics:', error);
        } finally {
            setLoading(false); // Set loading to false after fetch completes
        }
    };

    useEffect(() => {
        fetchComics(page);
    }, [query, selectedCategory, page]);

    const handleSearch = () => {
        fetchComics(page);
    };

    return (
        <div className='main'>
            <h2>Comic Search</h2>
            <div>
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setQuery(''); // Clear the search bar if a category is selected
                    }}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                

                <button onClick={handleSearch}>Search</button>
            </div>

            <div>
                <h3>Results:</h3>
                {loading ? ( // Display loading message if loading
                    <p>Loading...</p>
                ) : (
                    <ul>
                        {comics.map((comic, index) => (
                            <li key={index}>
                                <h3>{comic.title}</h3>
                                <img src={comic.coverPage} alt={comic.title} />
                                <p>{comic.description}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                    Previous
                </button>
                
                <span> Page {page} of {totalPages} </span>
                
                <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ComicSearch;