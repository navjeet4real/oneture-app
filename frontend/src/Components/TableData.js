import { useSelector } from 'react-redux';

const TableData = () => {
    const { tableData, status, error } = useSelector((state) => state.data);

    if (status === 'loading') {
      return <div>Loading...</div>;
    }
    
    if (status === 'failed') {
      return <div>Error: {error}</div>;
    }
  
    return (
      <table>
        <thead>
          <tr>
            <th>Customer Logo</th>
            <th>Customer Name</th>
            <th>Headline</th>
            <th>URL</th>
            <th>Description Summary</th>
            <th>Page URL</th>
            <th>Location</th>
            <th>Industry</th>
          </tr>
        </thead>
        <tbody>
          {
            tableData.map((data, index) => (
              <tr key={index}>
                <td><img src={data.imageSrcUrl} alt={data.customerName} /></td>
                <td>{data.customerName}</td>
                <td>{data.headline}</td>
                <td><a href={data.headlineUrl}>{data.headlineUrl}</a></td>
                <td>{data.descriptionSummary}</td>
                <td>{data.page}</td>
                <td>{data.location}</td>
                <td>{data.industry}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }

  export default TableData