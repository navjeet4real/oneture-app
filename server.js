const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});
const cors = require("cors");
app.use(cors());
const axios = require("axios");

const PORT = process.env.PORT || 8080;

app.use(express.json());

const HOST_URL = 'https://aws.amazon.com/api/dirs/items/search?';

const URL = "https://aws.amazon.com/api/dirs/items/search?item.directoryId=customer-references&sort_by=item.additionalFields.sortDate&sort_order=desc&" +
"size=9&item.locale=en_US&tags.id=GLOBAL%23industry%23financial-services%7Ccustomer-references%23industry%23financial-services&page=0"
app.get("/api/data", async (req, res) => {
  console.log("Fetching data...");
  try {
    const { page, size, location = null, industry = null, query } = req.query;
    console.log(req.query, "req.query fetchData");

    // Base API URL
    let apiUrl = `https://aws.amazon.com/api/dirs/items/search?` +
      `item.directoryId=customer-references&` +
      `sort_by=item.additionalFields.sortDate&` +
      `sort_order=desc&` +
      `size=${size}&` +
      `item.locale=en_US&` +
      `page=${page}`;

    // Initialize tags.id array
    let tags = [];

    // Add industry to tags.id if exists
    
    // Add location to tags.id if exists
    if (location) {
      const formattedLocation = location.split(" ").join("%23").toLowerCase(); // Split on spaces, join with %23, lowercase
      tags.push(`GLOBAL%23displayLocation%23${formattedLocation}`);
      tags.push(`customer-references%23displayLocation%23${formattedLocation}`);
    }
    
    if (industry) {
      // const formattedIndustry = industry.split(" ").join("-").toLowerCase();
      // tags.push(`GLOBAL%23industry%23${formattedIndustry}`);
      // tags.push(`customer-references%23industry%23${formattedIndustry}`);
    }
    // Append tags.id to the API URL if there are any tags
    if (tags.length > 0) {
      apiUrl += `&tags.id=${tags.join('%7C')}`; // Join tags with %7C for '|'
    }

    // Optionally add query search term
    if (query) {
      // apiUrl += `&q=${encodeURIComponent(query)}`;
    }

    console.log(apiUrl, "----------------------------------------------Constructed API URL");

    // console.log("API URL:", apiUrl);
    // Fetch data from the API
    const response = await axios.get(apiUrl);

    console.log("Data fetched successfully:", response.data);

    // Send the fetched data as the response
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get('/api/filter-data', async (req, res) => {
  try {
      // let allItems = [];
      let page = 0;
      const pageSize = 280;
      const apiUrl = `https://aws.amazon.com/api/dirs/items/search?` +
      `item.directoryId=customer-references&` +
      `sort_by=item.additionalFields.sortDate&` +
      `sort_order=desc&` +
      `size=${pageSize}&` +
      `item.locale=en_US&` +
      // `tags.id=GLOBAL%23industry%23${industry}%7Ccustomer-references%23industry%23${industry}&` +
      // `tags.id=GLOBAL%23location%23${location}%7Ccustomer-references%23location%23${location}&` +
      // `item.name=${query}&` +
      `page=${page}`;

      const response = await axios.get(`${apiUrl}`, {
          params: { page, size: pageSize }
      });

      const allItems = response.data.items || [];

      const uniqueLocations = [...new Set(allItems.map(item => item.item.additionalFields.displayLocation).filter(Boolean))];
      const uniqueIndustries = [...new Set(allItems.map(item => item.item.additionalFields.industry).filter(Boolean))];

      res.json({
          locations: uniqueLocations,
          industries: uniqueIndustries
      });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
