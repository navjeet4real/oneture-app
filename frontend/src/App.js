import './App.css';
import FilterBar from './Components/FilterBar';
import TableData from './Components/TableData';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTableData, fetchFilterOptionData  } from './Redux/dataSlice';

function App() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.data.page);
  let limit = 15 // Records per page

  useEffect(() => {
    dispatch(fetchTableData({ page, size: limit }));
    dispatch(fetchFilterOptionData()); // Load filter data on initial load
  }, [dispatch]);

  return (
    <div className="App">
      <FilterBar />
      <TableData />
    </div>
  );
}

export default App;
