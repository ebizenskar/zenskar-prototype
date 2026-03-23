import './ContractsView.css'
import DataTable from './DataTable'

export default function ContractsView() {
  return (
    <div className="contracts-view">
      <div className="title-row">
        <h1 className="page-title">Contracts</h1>
        
        <div className="action-row">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Customers" />
          </div>
          
          <button className="btn btn-outline">
            GENERATE INVOICES <span className="chevron-down"></span>
          </button>
          
          <button className="btn btn-outline">
            <span className="download-icon">⬇</span> EXPORT
          </button>
          
          <button className="btn btn-primary">
            ADD NEW CONTRACT
          </button>
        </div>
      </div>

      <div className="filter-row">
        <button className="btn btn-filter">
          <span className="filter-icon">≡</span> Filter
        </button>
      </div>

      <DataTable />
    </div>
  )
}
