import './Header.css'

export default function Header() {
  return (
    <header className="main-header">
      <div className="breadcrumbs">
        <span>Home /</span>
        <span className="breadcrumb-active">Contract</span>
      </div>
    </header>
  )
}
