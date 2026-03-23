import './Sidebar.css'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">zenskar</div>
        
        <nav className="sidebar-nav">
          <div className="nav-item">
            <span className="icon-placeholder bg-icon" />
            <span>Getting Started</span>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Platform</div>
            
            <ul className="nav-list">
              <li className="nav-item">
                <span className="icon-placeholder line-chart-icon" />
                <span>Insights</span>
                <span className="chevron down" />
              </li>
              <li className="nav-item">
                <span className="icon-placeholder users-icon" />
                <span>Customers</span>
                <span className="chevron down" />
              </li>
              <li className="nav-item">
                <span className="icon-placeholder clock-icon" />
                <span>Usage</span>
                <span className="chevron down" />
              </li>
              
              {/* Active Section */}
              <li className="nav-item active-parent">
                <span className="icon-placeholder document-icon active-icon" />
                <span>Contracts</span>
                <span className="chevron up" />
              </li>
              <ul className="sub-nav-list">
                <li className="sub-nav-item active">Contracts</li>
                <li className="sub-nav-item">Plans</li>
                <li className="sub-nav-item">Products</li>
              </ul>
              
              <li className="nav-item">
                <span className="icon-placeholder invoice-icon" />
                <span>Invoices</span>
                <span className="chevron up" />
              </li>
              <li className="nav-item">
                <span className="icon-placeholder accounting-icon" />
                <span>Accounting</span>
              </li>
              <li className="nav-item">
                <span className="icon-placeholder more-icon" />
                <span>More</span>
                <span className="chevron up" />
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="bottom-badges">
          <div className="badge-item">
            <div className="badge-icon-wrapper">
              <span className="icon-placeholder bell-icon" />
              <span>Alerts</span>
            </div>
            <span className="badge-count count-yellow">17</span>
          </div>
          <div className="badge-item">
            <div className="badge-icon-wrapper">
              <span className="icon-placeholder group-icon" />
              <span>Help & information</span>
            </div>
            <span className="badge-count count-green">3</span>
          </div>
        </div>
        
        <div className="user-profile">
          <div className="avatar">
            <img src="https://i.pravatar.cc/150?u=johndoe" alt="John Doe" />
          </div>
          <div className="user-info">
            <div className="user-name">John Doe</div>
            <div className="user-role">Sales manager</div>
          </div>
          <span className="chevron up user-chevron" />
        </div>
      </div>
    </aside>
  )
}
