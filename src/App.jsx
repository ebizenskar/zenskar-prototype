import { useState, useEffect } from 'react';
import NewContractPane from './components/NewContractPane.jsx';
import ContractDetailsPage from './components/ContractDetailsPage.jsx';
import profilePhoto from './assets/images/profile-john-doe.png';
import {
  Logo,
  SearchIcon,
  DownloadIcon,
  BellIcon,
  BellAlertsIcon,
  UsersIcon,
  UsageIcon,
  FileIcon,
  InvoicesIcon,
  ChartIcon,
  MoreIcon,
  FlagIcon,
  CheckboxIcon,
  SortIcon,
  DotsMenuIcon,
  ColumnAdjustIcon,
  TimelineIcon,
  FilterIcon
} from './components/Icons.jsx';

// ─── Table data ──────────────────────────────────────────────────────────────

const contracts = [
  { id: 1, name: 'Contract 1', customer: 'Patricia Sanders', start: 'Oct 5, 2023',  end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 12,000.00'  },
  { id: 2, name: 'Contract 2', customer: 'Kurt Bates',       start: 'Sep 24, 2023', end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 15,500.00*' },
  { id: 3, name: 'Contract 3', customer: 'Iva Ryan',         start: 'Oct 7, 2023',  end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 9,750.00*'  },
  { id: 4, name: 'Contract 4', customer: 'Rhonda Rhodes',    start: 'Sep 21, 2023', end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 22,300.00'  },
  { id: 5, name: 'Contract 5', customer: 'Daniel Hamilton',  start: 'Oct 4, 2023',  end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 18,650.00'  },
  { id: 6, name: 'Contract 6', customer: 'Jerry Helfer',     start: 'Oct 12, 2023', end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 25,000.00*' },
  { id: 7, name: 'Contract 7', customer: 'Corina McCoy',     start: 'Sep 25, 2023', end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 30,750.00*' },
  { id: 8, name: 'Contract 8', customer: 'Kathy Pacheco',    start: 'Oct 1, 2023',  end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 5,500.00*'  },
  { id: 9, name: 'Contract 9', customer: 'John Dukes',       start: 'Oct 6, 2023',  end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 19,900.00'  },
];

// Grid column template — checkbox | name | customer | period | created | value | actions
const COLS = '52px 1.5fr 1.5fr 2fr 1.75fr 1.5fr 40px';

// ─── Small reusable pieces ────────────────────────────────────────────────────

// Logo is imported from Icons.jsx

function CheckBox({ className }) {
  return (
    <div className={className || 'relative size-[16px] text-[#cbd5e1]'}>
      <CheckboxIcon />
    </div>
  );
}

// SortIcon is imported from Icons.jsx

function ColHeader({ label, align = 'left', showSort = true }) {
  return (
    <div className={`flex gap-[4px] items-center ${align === 'right' ? 'justify-end' : ''}`}>
      <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-end leading-[0] text-[#94a3b8] text-[13px] whitespace-nowrap">
        <p className="leading-[13px]">{label}</p>
      </div>
      {showSort && (
        <div className="text-[#94a3b8]">
          <SortIcon />
        </div>
      )}
    </div>
  );
}

function DotsMenu() {
  return (
    <div className="text-[#94a3b8]">
      <DotsMenuIcon />
    </div>
  );
}

// ─── Contracts table ──────────────────────────────────────────────────────────

function ContractsTable({ onRowClick }) {
  return (
    <div className="overflow-auto flex-1 min-h-0">
      <div style={{ minWidth: '640px' }}>

        {/* Header row */}
        <div
          className="bg-[#f1f5f9] h-[48px] rounded-tl-[8px] items-center"
          style={{ display: 'grid', gridTemplateColumns: COLS }}
        >
          {/* Checkbox */}
          <div className="flex items-center pl-[24px]">
            <CheckBox />
          </div>
          {/* Contract Name */}
          <div className="flex items-center">
            <ColHeader label="Contract Name" />
          </div>
          {/* Customer */}
          <div className="flex items-center">
            <ColHeader label="Customer" />
          </div>
          {/* Contract Period */}
          <div className="flex items-center">
            <ColHeader label="Contract Period" showSort={false} />
          </div>
          {/* Created at */}
          <div className="flex items-center">
            <ColHeader label="Created at" />
          </div>
          {/* Total Contract Value */}
          <div className="flex items-center justify-end pr-[16px]">
            <ColHeader label="Total Contract Value" align="right" />
          </div>
          {/* Column adjuster */}
          <div className="flex items-center justify-center text-[#94a3b8]">
            <ColumnAdjustIcon />
          </div>
        </div>

        {/* Data rows */}
        {contracts.map((c) => (
          <div
            key={c.id}
            className="items-center border-b border-[#e2e8f0] cursor-pointer hover:bg-[#f8fafc]"
            style={{ display: 'grid', gridTemplateColumns: COLS, height: '56px' }}
            onClick={() => onRowClick && onRowClick(c)}
          >
            {/* Checkbox */}
            <div className="flex items-center pl-[24px]">
              <CheckBox />
            </div>

            {/* Contract Name */}
            <div className="flex items-center pr-[8px]">
              <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[13px] leading-[13px] truncate">
                {c.name}
              </span>
            </div>

            {/* Customer */}
            <div className="flex items-center pr-[8px]">
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#1145bc] text-[12px] leading-[12px] truncate">
                {c.customer}
              </span>
            </div>

            {/* Contract Period */}
            <div className="flex items-center gap-[12px] pr-[8px]">
              <TimelineIcon />
              <div className="flex flex-col gap-[8px] font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px]">
                <span className="leading-[12px]">{c.start}</span>
                <span className="leading-[12px]">{c.end}</span>
              </div>
            </div>

            {/* Created at */}
            <div className="flex items-center pr-[8px]">
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[12px] whitespace-nowrap">
                {c.createdAt}
              </span>
            </div>

            {/* Total Contract Value */}
            <div className="flex items-center justify-end pr-[16px]">
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#475569] text-[13px] leading-[16px] text-right whitespace-nowrap">
                {c.value}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center">
              <DotsMenu />
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

// Sidebar menu item — h-[30px], icon + label with 15px gap (matches Figma)
// icon=null → invisible 16px spacer (Figma opacity-0 pattern)
function SidebarMenuItem({ icon: Icon, label, active = false }) {
  const baseClasses = active
    ? "border border-[rgba(137,175,211,0.88)] border-solid flex h-[32px] items-center justify-between px-[8px] rounded-[8px] w-full"
    : "flex h-[30px] items-center px-[8px] w-full";

  const bgStyle = active
    ? { backgroundImage: 'linear-gradient(116.305deg, rgba(99, 150, 195, 0.22) 60.556%, rgba(13, 29, 66, 0.25) 108.74%)' }
    : {};

  return (
    <div className={baseClasses} style={bgStyle}>
      <div className="flex gap-[15px] items-center">
        {/* Icon slot — always 16px wide to keep text aligned */}
        {Icon
          ? <Icon />
          : <span style={{ display: 'inline-block', width: 16, height: 16, flexShrink: 0 }} />
        }
        <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#f1f5f9] text-[14px] leading-[13px] whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-[#1d2235] flex flex-col gap-[21px] h-screen items-start pb-[28px] pt-[16px] px-[16px] w-[240px] shrink-0">
      <div className="flex flex-col items-start p-[12px] relative shrink-0 w-full">
        <Logo className="h-[24px] w-[110px]" variant="white" />
      </div>
      <div className="flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px min-w-px relative w-full">
        <div className="flex flex-col items-start relative shrink-0 w-full">
          <div className="flex gap-[17px] items-center px-[8px] py-[6px] relative shrink-0 w-full">
            <FlagIcon />
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#f1f5f9] text-[14px] leading-[13px]">
              Getting Started
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] items-start w-full">
          <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#b3c0cd] text-[13px] px-[8px]">
            Platform
          </span>
          <div className="flex flex-col gap-[8px] items-start w-full mt-[8px]">
            <SidebarMenuItem icon={ChartIcon}   label="Insights" />
            <SidebarMenuItem icon={UsersIcon}   label="Customers" />
            <SidebarMenuItem icon={UsageIcon}   label="Usage" />
            <SidebarMenuItem icon={FileIcon}    label="Contracts" active={true} />
            {/* Plans / Products / Accounting: icon is opacity-0 in Figma — pass null */}
            <SidebarMenuItem icon={null}        label="Plans" />
            <SidebarMenuItem icon={null}        label="Products" />
            <SidebarMenuItem icon={InvoicesIcon} label="Invoices" />
            <SidebarMenuItem icon={null}        label="Accounting" />
            <SidebarMenuItem icon={MoreIcon}    label="More" />
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="h-px bg-[#475569] w-full" />
      {/* Bottom section */}
      <div className="flex flex-col gap-[16px] items-start relative shrink-0 w-full">
        <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          {/* Alerts */}
          <div className="border border-[rgba(137,175,211,0.88)] border-solid flex h-[32px] items-center justify-between px-[8px] py-[7px] relative rounded-[8px] shrink-0 w-full" style={{ backgroundImage: 'linear-gradient(116.305deg, rgba(99, 150, 195, 0.22) 60.556%, rgba(13, 29, 66, 0.25) 108.74%)' }}>
            <div className="flex gap-[16px] items-center relative shrink-0">
              <BellAlertsIcon />
              <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] relative shrink-0 text-[#f1f5f9] text-[13px] whitespace-nowrap">
                <p className="leading-[13px]">Alerts</p>
              </div>
            </div>
            <div className="bg-[#d98b06] flex flex-col items-center justify-center overflow-clip px-[6px] py-[3px] relative rounded-[20px] shrink-0">
              <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[#f1f5f9] text-[10px] whitespace-nowrap">
                <p className="leading-[10px]">17</p>
              </div>
            </div>
          </div>
          {/* Help & information */}
          <div className="flex h-[32px] items-center justify-between px-[8px] py-[7px] relative rounded-[8px] shrink-0 w-full">
            <div className="flex gap-[16px] items-center relative shrink-0">
              <UsersIcon />
              <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] relative shrink-0 text-[#f1f5f9] text-[13px] whitespace-nowrap">
                <p className="leading-[13px]">{`Help & information`}</p>
              </div>
            </div>
            <div className="bg-[#35b25f] flex flex-col items-center justify-center overflow-clip px-[6px] py-[3px] relative rounded-[20px] shrink-0">
              <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[#f1f5f9] text-[10px] whitespace-nowrap">
                <p className="leading-[10px]">3</p>
              </div>
            </div>
          </div>
        </div>
        {/* Profile card */}
        <div className="backdrop-blur-[2px] border border-[rgba(137,175,211,0.88)] border-solid flex items-center justify-between pl-[16px] pr-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[208px]" style={{ backgroundImage: 'linear-gradient(105.774deg, rgba(45, 60, 84, 0.9) 60.556%, rgba(31, 41, 65, 0.9) 108.74%)' }}>
          <div className="flex gap-[8px] items-center relative shrink-0">
            <div className="relative shrink-0 size-[40px] rounded-full overflow-hidden">
              <img src={profilePhoto} alt="John Doe" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-[5px] items-start leading-[0] relative shrink-0 whitespace-nowrap">
              <div className="flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-end relative shrink-0 text-[#f8fafc] text-[13px]">
                <p className="leading-[13px]">John Doe</p>
              </div>
              <div className="flex flex-col font-['Figtree:Regular',sans-serif] font-normal justify-end relative shrink-0 text-[#cbd5e1] text-[10px]">
                <p className="leading-[10px]">Sales manager</p>
              </div>
            </div>
          </div>
          <div className="text-[#cbd5e1]">
            <SortIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [paneOpen, setPaneOpen] = useState(false);
  const [view, setView] = useState('list');
  const [selectedContract, setSelectedContract] = useState(null);

  // ── Browser history sync ────────────────────────────────────────────────
  useEffect(() => {
    // On first load, restore from history state (handles F5 refresh on detail page)
    const hs = window.history.state;
    if (hs?.view === 'detail' && hs?.contract) {
      setSelectedContract(hs.contract);
      setView('detail');
    } else {
      // Stamp the initial list entry so back always has a target
      window.history.replaceState({ view: 'list' }, '');
    }

    function handlePopState(e) {
      if (e.state?.view === 'detail' && e.state?.contract) {
        setSelectedContract(e.state.contract);
        setView('detail');
      } else {
        setSelectedContract(null);
        setView('list');
      }
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function handleRowClick(contract) {
    setSelectedContract(contract);
    setView('detail');
    window.history.pushState({ view: 'detail', contract }, '');
  }

  function handleCreateContract(data) {
    const contract = {
      id: `new-${Date.now()}`,
      name: data.name,
      customer: data.customer,
      currency: data.currency,
      startDate: data.startDate,
      endDate: data.endDate,
      billingStartDate: data.billingStartDate,
      description: data.description || '',
      tags: data.tags || [],
      isNew: true,
    };
    setSelectedContract(contract);
    setView('detail');
    window.history.pushState({ view: 'detail', contract }, '');
  }

  function handleBack() {
    // Let the browser navigate back — the popstate listener will update state
    window.history.back();
  }

  if (view === 'detail' && selectedContract) {
    return (
      <div className="flex h-screen bg-[#1d2235] overflow-hidden">
        <Sidebar />
        <ContractDetailsPage
          contract={selectedContract}
          onBack={handleBack}
          isNew={selectedContract?.isNew}
        />
      </div>
    );
  }

  return (
    <>
    <div className="flex h-screen bg-[#1d2235] overflow-hidden">

      {/* Sidebar — fixed 240 px */}
      <Sidebar />

      {/* Right side — fills remaining width */}
      <div className="flex flex-col flex-1 min-w-0 pt-[11px]">

        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center h-[30px] px-0 shrink-0">
          <div className="flex items-center">
            <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] text-[#94a3b8] text-[13px] whitespace-nowrap">
              <p className="leading-[16px] whitespace-pre">{`Home  / `}</p>
            </div>
          </div>
          <div className="bg-[#334155] flex items-center justify-center p-[4px] relative rounded-[4px] shrink-0">
            <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-end leading-[0] text-[13px] text-white whitespace-nowrap">
              <p className="leading-[13px]">Contract</p>
            </div>
          </div>
        </div>

        {/* White content card — fills remaining height */}
        <div className="bg-white rounded-tl-[8px] flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* Card header */}
          <div className="flex items-center justify-between overflow-clip px-[20px] py-[24px] shrink-0">
            <div className="flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-end leading-[0] text-[#1e293b] text-[24px] tracking-[-0.24px] whitespace-nowrap">
              <p className="leading-[24px]">Contracts</p>
            </div>
            <div className="flex gap-[8px] items-center justify-end">
              {/* Search */}
              <div className="bg-white border border-[#e2e8f0] border-solid flex h-[32px] items-center pl-[8px] pr-[6px] rounded-[4px] shrink-0 w-[305px]">
                <div className="flex gap-[7px] items-center">
                  <div className="text-[#94a3b8]">
                    <SearchIcon />
                  </div>
                  <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-center leading-[0] text-[#94a3b8] text-[13px] whitespace-nowrap">
                    <p className="leading-[13px]">Customers</p>
                  </div>
                </div>
              </div>
              {/* Generate Invoices */}
              <div className="bg-white border border-[#cbd5e1] border-solid flex gap-[8px] h-[32px] items-center justify-end pl-[12px] pr-[8px] rounded-[4px] shrink-0">
                <div className="flex items-center">
                  <div className="flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-end leading-[0] text-[#334155] text-[13px] text-right tracking-[0.2px] uppercase whitespace-nowrap">
                    <p className="leading-[14px]">GENERATE INVOICES</p>
                  </div>
                </div>
                <div className="bg-[#cbd5e1] h-[12px] rounded-[2px] shrink-0 w-px" />
                <div className="text-[#334155]">
                  <DownloadIcon />
                </div>
              </div>
              {/* Export */}
              <div className="bg-white border border-[#cbd5e1] border-solid flex gap-[8px] h-[32px] items-center justify-end px-[12px] rounded-[4px] shrink-0">
                <div className="text-[#334155]">
                  <DownloadIcon />
                </div>
                <div className="flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-end leading-[0] text-[#334155] text-[13px] text-right tracking-[0.2px] uppercase whitespace-nowrap">
                  <p className="leading-[14px]">Export</p>
                </div>
              </div>
              {/* Add New Contract */}
              <div
                className="bg-[#ed765e] flex h-[32px] items-center justify-center px-[16px] rounded-[4px] shrink-0 cursor-pointer"
                onClick={() => setPaneOpen(true)}
              >
                <div className="flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-end leading-[0] text-[12px] text-right text-white tracking-[0.2px] uppercase whitespace-nowrap">
                  <p className="leading-[12px]">ADD NEW CONTRACT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter row */}
          <div className="px-[20px] pb-[20px] shrink-0">
            <div className="border-[#cbd5e1] border-[0.8px] border-solid flex gap-[10px] h-[32px] items-center px-[12px] py-[8px] rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.15)] inline-flex">
              <div className="text-[#475569]">
                <FilterIcon />
              </div>
              <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-center leading-[0] text-[#475569] text-[12px] whitespace-nowrap">
                <p className="leading-[12px]">Filter</p>
              </div>
            </div>
          </div>

          {/* Table — scrollable, fills remaining space */}
          <ContractsTable onRowClick={handleRowClick} />

        </div>
      </div>
    </div>

    <NewContractPane isOpen={paneOpen} onClose={() => setPaneOpen(false)} onCreate={handleCreateContract} />
    </>
  );
}
