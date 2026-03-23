import './DataTable.css'

export default function DataTable() {
  const data = [
    { id: 1, name: 'Contract 1', customer: 'Patricia Sanders', start: 'Oct 5, 2023', end: 'Oct 16, 2023', created: 'Sep 16, 2025 11:32 PM', value: '$ 12,000.00' },
    { id: 2, name: 'Contract 2', customer: 'Kurt Bates', start: 'Sep 24, 2023', end: 'Oct 16, 2023', created: 'Sep 16, 2025 11:32 PM', value: '$ 15,500.00', asterisk: true },
    { id: 3, name: 'Contract 3', customer: 'Iva Ryan', start: 'Oct 7, 2023', end: 'Oct 16, 2023', created: 'Sep 16, 2025 11:32 PM', value: '$ 9,750.00', asterisk: true },
    { id: 4, name: 'Contract 4', customer: 'Rhonda Rhodes', start: 'Sep 21, 2023', end: 'Oct 16, 2023', created: 'Sep 16, 2025 11:32 PM', value: '$ 22,300.00' },
    { id: 5, name: 'Contract 5', customer: 'Daniel Hamilton', start: 'Oct 4, 2023', end: 'Oct 16, 2023', created: 'Sep 16, 2025 11:32 PM', value: '$ 18,650.00' },
    { id: 6, name: 'Contract 6', customer: 'Jerry Helfer', start: 'Oct 12, 2023', end: 'Oct 16, 2023', created: 'Sep 16, 2025 11:32 PM', value: '$ 25,000.00', asterisk: true },
    { id: 7, name: 'Contract 7', customer: 'Corina McCoy', start: 'Sep 25, 2023', end: 'Oct 16, 2023', created: 'Sep 16, 2025 11:32 PM', value: '$ 30,750.00', asterisk: true },
    { id: 8, name: 'Contract 8', customer: 'Kathy Pacheco', start: 'Oct 1, 2023', end: 'Oct 16, 2023', created: 'Sep 16, 2025 11:32 PM', value: '$ 5,500.00', asterisk: true },
    { id: 9, name: 'Contract 9', customer: 'John Dukes', start: 'Oct 6, 2023', end: 'Oct 16, 2023', created: 'Sep 16, 2025 11:32 PM', value: '$ 19,900.00' },
  ];

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th className="th-checkbox">
              <input type="checkbox" className="custom-checkbox" />
              <span className="drag-icon">⋮⋮</span>
            </th>
            <th>Contract Name <span className="sort-icon">↕</span></th>
            <th>Customer <span className="sort-icon">↕</span></th>
            <th>Contract Period</th>
            <th>Created at <span className="sort-icon">↕</span></th>
            <th className="text-right">Total Contract Value <span className="sort-icon">↕</span></th>
            <th className="th-settings">
              <span className="settings-icon">◫</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td className="td-checkbox">
                <input type="checkbox" className="custom-checkbox" />
              </td>
              <td className="td-name">{row.name}</td>
              <td className="td-customer">
                <a href="#" className="customer-link">{row.customer}</a>
              </td>
              <td className="td-period">
                <div className="period-container">
                  <div className="timeline-graphic">
                    <div className="timeline-dot"></div>
                    <div className="timeline-line"></div>
                    <div className="timeline-dot-bottom"></div>
                  </div>
                  <div className="period-dates">
                    <span>{row.start}</span>
                    <span>{row.end}</span>
                  </div>
                </div>
              </td>
              <td className="td-created">{row.created}</td>
              <td className="td-value text-right">
                {row.value}
                <span className="asterisk-space">{row.asterisk ? '*' : ''}</span>
              </td>
              <td className="td-actions">
                <span className="action-icon">⋮</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
