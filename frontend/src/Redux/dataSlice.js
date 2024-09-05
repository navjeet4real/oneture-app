import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const FETCH_TABLE_DATA_API_URL = "http://localhost:8080/api/data";
const Filter_DATA_API_URL = "http://localhost:8080/api/filter-data";

export const fetchTableData = createAsyncThunk(
  "data/fetchTableData",
  async ({ page, size, location, industry, query }, { rejectWithValue }) => {
    try {
      console.log(page, size, location, industry, query, "inside fetchData");
      const response = await axios.get(`${FETCH_TABLE_DATA_API_URL}`, {
        params: {
          page,
          size,
          location,
          industry,
          query,
        },
      });
      console.log(response, "Data length");

      // Transform data here
      const mappedData = response.data.items.map((item) => ({
        imageSrcUrl: item.item.additionalFields.imageSrcUrl,
        customerName: item.item.additionalFields.customerNameLower,
        headline: item.item.additionalFields.headline,
        headlineUrl: item.item.additionalFields.headlineUrl,
        descriptionSummary: item.item.additionalFields.descriptionSummary,
        page: page+1,
        location: item.item.additionalFields.displayLocation,
        industry: item.item.additionalFields.industry,
      }));
      return mappedData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for fetching all data, locations, and industries
export const fetchFilterOptionData = createAsyncThunk(
  "data/fetchFilterOptionData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Filter_DATA_API_URL}`);

      return {
        locations: response.data.locations,
        industries: response.data.industries,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState: {
    tableData: [],
    locations: [],
    industries: [],
    status: "idle",
    error: null,
    page: 0,
  },
  reducers: {
    incrementPage: (state) => {
      console.log(state.page, "inside incrementPage");
      state.page += 1;
    },
    decrementPage: (state) => {
      state.page = state.page > 0 ? state.page - 1 : 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tableData = action.payload;
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch All Data, Locations, and Industries
      .addCase(fetchFilterOptionData.pending, (state) => {
        state.allDataStatus = "loading";
      })
      .addCase(fetchFilterOptionData.fulfilled, (state, action) => {
        state.allDataStatus = "succeeded";
        state.locations = action.payload.locations;
        state.industries = action.payload.industries;
      })
      .addCase(fetchFilterOptionData.rejected, (state, action) => {
        state.allDataStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { incrementPage, decrementPage } = dataSlice.actions;

export default dataSlice.reducer;
