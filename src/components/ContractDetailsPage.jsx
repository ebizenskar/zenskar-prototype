import { useState } from 'react';
import AddProductModal from './AddProductModal.jsx';
import ProductCard from './ProductCard.jsx';

// Asset URLs from Figma MCP server
const imgUsFlag = "http://localhost:3845/assets/c65c24c74682b744c0825f6903bc7868d6604fce.svg";

// ─── Mock products already on the contract ─────────────────────────────────────

const INITIAL_PRODUCTS = [
  {
    id: 'cp1',
    catalogId: 'api-calls',
    name: 'API Calls',
    type: 'Point in time',
    metric: 'Quantity',
    period: 'Jan 01, 2026 → Jun 31, 2026',
    billingDate: 'Jan 01, 2026',
    phases: [
      { status: 'ONGOING',  range: 'Product Start → Mar 31, 2026', perUnitPrice: '$1.00', quantityIncluded: '1000 units/month', billingCadence: 'Postpaid - Every Month' },
      { status: 'UPCOMING', range: 'Apr 01, 2026 → Jun 30, 2026',  perUnitPrice: '$2.00', quantityIncluded: '1000 units/month', billingCadence: 'Postpaid - Every Month' },
    ],
  },
  {
    id: 'cp2',
    catalogId: 'hd-plan',
    name: 'HD Plan',
    type: 'Point in time',
    metric: 'Quantity',
    period: 'Jan 01, 2026 → Jun 31, 2026',
    billingDate: 'Jan 01, 2026',
    phases: [
      { status: 'ONGOING',  range: 'Product Start → Mar 31, 2026', perUnitPrice: '$1.00', quantityIncluded: '1000 units/month', billingCadence: 'Postpaid - Every Month' },
      { status: 'UPCOMING', range: 'Apr 01, 2026 → Jun 30, 2026',  perUnitPrice: '$2.00', quantityIncluded: '1000 units/month', billingCadence: 'Postpaid - Every Month' },
    ],
  },
];

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = ['Summary', 'Invoices', 'Accounting', 'Logs'];

// ─── Contract Details Page ────────────────────────────────────────────────────

export default function ContractDetailsPage({ contract, onBack }) {
  const [activeTab, setActiveTab]       = useState('summary');
  const [products, setProducts]         = useState(INITIAL_PRODUCTS);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const contractName = contract?.name     || 'Contract_123';
  const customerName = contract?.customer || 'Amazon inc';

  function handleProductsAdded(newProducts) {
    setProducts(prev => [...prev, ...newProducts]);
    setAddModalOpen(false);
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 pt-[11px]">

      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-[6px] h-[30px] shrink-0">
        <span
          onClick={onBack}
          className="font-['Figtree:Medium',sans-serif] font-medium text-[#94a3b8] text-[13px] cursor-pointer hover:text-[#cbd5e1]"
        >
          Home
        </span>
        <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#94a3b8] text-[13px]">/</span>
        <span
          onClick={onBack}
          className="font-['Figtree:Medium',sans-serif] font-medium text-[#94a3b8] text-[13px] cursor-pointer hover:text-[#cbd5e1]"
        >
          Contract
        </span>
        <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#94a3b8] text-[13px]">/</span>
        <div className="bg-[#334155] flex items-center justify-center px-[6px] py-[3px] rounded-[4px] shrink-0">
          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[13px] text-white whitespace-nowrap">
            {contractName}
          </span>
        </div>
      </div>

      {/* ── White card ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-tl-[8px] flex flex-col flex-1 min-h-0 overflow-hidden">

        {/* Contract title row */}
        <div className="flex items-start justify-between px-[24px] pt-[20px] pb-[10px] shrink-0">
          <div className="flex flex-col gap-[6px]">
            {/* Name + badges */}
            <div className="flex items-center gap-[8px] flex-wrap">
              <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[24px] tracking-[-0.24px] leading-[24px]">
                {contractName}
              </span>
              {/* DRAFT badge */}
              <div className="bg-[#f8fafc] border border-[#f1f5f9] flex items-center gap-[4px] p-[4px] rounded-[2px] shrink-0">
                <span className="text-[#64748b] text-[10px] leading-none">✎</span>
                <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[10px] uppercase leading-[12px] whitespace-nowrap">
                  Draft
                </span>
              </div>
              {/* USD badge */}
              <div className="bg-[#f8fafc] border border-[#f1f5f9] flex items-center gap-[4px] px-[4px] py-[2px] rounded-[2px] shrink-0">
                <div className="overflow-clip relative shrink-0 size-[10px]">
                  <img alt="US" className="absolute block max-w-none size-full" src={imgUsFlag} />
                </div>
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#334155] text-[12px] leading-[12px] whitespace-nowrap">
                  USD
                </span>
              </div>
              {/* Customer link */}
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1145bc] text-[13px] cursor-pointer hover:underline whitespace-nowrap">
                {customerName}
              </span>
            </div>
            {/* Description */}
            <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px]">
              The description for this contract goes here
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-[8px] shrink-0 ml-[16px]">
            <button className="bg-white border border-[#94a3b8] flex h-[32px] items-center justify-center px-[16px] rounded-[4px] cursor-pointer">
              <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[12px] tracking-[0.2px] uppercase whitespace-nowrap">
                SAVE DRAFT
              </span>
            </button>
            <button className="bg-[#ed765e] flex h-[32px] items-center justify-center px-[16px] rounded-[4px] cursor-pointer border-0">
              <span className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[12px] tracking-[0.2px] uppercase">
                PUBLISH
              </span>
            </button>
          </div>
        </div>

        {/* Contract info metadata row */}
        <div className="flex items-center gap-[48px] px-[24px] pb-[16px] shrink-0 overflow-x-auto">
          <div className="flex flex-col gap-[8px] shrink-0">
            <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">
              Contract Period
            </span>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[14px] leading-[16px] whitespace-nowrap">
              Jan 01, 2026  -  Jun 30, 2026
            </span>
          </div>
          <div className="flex flex-col gap-[8px] shrink-0">
            <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">
              Start Billing Cycle on
            </span>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[14px] leading-[16px] whitespace-nowrap">
              01 Jan 2026
            </span>
          </div>
          <div className="flex flex-col gap-[4px] shrink-0">
            <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">
              Custom Attributes
            </span>
            <div className="border border-[#e2e8f0] flex items-center justify-center px-[4px] py-[4px] rounded-[4px] w-[48px] cursor-pointer">
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#7c8ba1] text-[12px] leading-[12px] whitespace-nowrap">
                View
              </span>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="h-[36px] w-px bg-[#e2e8f0] shrink-0" />

          <div className="flex flex-col gap-[8px] shrink-0">
            <div className="flex items-center gap-[4px]">
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">TCV</span>
              <span className="text-[#94a3b8] text-[11px] cursor-help" title="Total Contract Value">ⓘ</span>
            </div>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[14px] leading-[16px] whitespace-nowrap">
              $12,000.00*
            </span>
          </div>
          <div className="flex flex-col gap-[8px] shrink-0">
            <div className="flex items-center gap-[4px]">
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Payment Due</span>
              <span className="text-[#94a3b8] text-[11px] cursor-help" title="Payment Due">ⓘ</span>
            </div>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[14px] leading-[16px] whitespace-nowrap">
              $5,443.00*
            </span>
          </div>
          <div className="flex flex-col gap-[8px] shrink-0">
            <div className="flex items-center gap-[4px]">
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Overdue</span>
              <span className="text-[#94a3b8] text-[11px] cursor-help" title="Overdue">ⓘ</span>
            </div>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[14px] leading-[16px] whitespace-nowrap">
              $5,443.00*
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-[#e2e8f0] px-[24px] shrink-0">
          {TABS.map(tab => {
            const key    = tab.toLowerCase();
            const active = activeTab === key;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(key)}
                className={`font-['Figtree:SemiBold',sans-serif] font-semibold text-[13px] px-[2px] py-[14px] mr-[28px] bg-transparent border-0 cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                  active
                    ? 'text-[#ed765e] border-[#ed765e]'
                    : 'text-[#64748b] border-transparent hover:text-[#334155]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'summary' && (
            <div className="px-[24px] py-[20px] flex flex-col gap-[20px]">

              {/* Feature action chips */}
              <div className="flex gap-[8px] flex-wrap">
                {['Discount', 'Tax', 'Commitment'].map(label => (
                  <button
                    key={label}
                    className="flex items-center gap-[6px] bg-white border border-[#e2e8f0] px-[12px] py-[6px] rounded-[20px] cursor-pointer hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                  >
                    <span className="text-[#94a3b8] text-[14px] leading-none font-light">+</span>
                    <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#475569] text-[12px] leading-[12px]">
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Products section */}
              <div className="flex flex-col gap-[12px]">
                {/* Section label */}
                <div className="flex items-center gap-[6px]">
                  <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[12px] tracking-[0.6px] uppercase leading-[12px]">
                    Products
                  </span>
                  <span className="text-[#94a3b8] text-[12px] cursor-help leading-none" title="Products added to this contract">ⓘ</span>
                </div>

                {/* Product cards */}
                <div className="flex flex-col gap-[16px]">
                  {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Add product */}
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="flex items-center gap-[6px] text-[#ed765e] font-['Figtree:SemiBold',sans-serif] font-semibold text-[13px] bg-transparent border-0 cursor-pointer p-0 self-start mt-[4px] hover:text-[#d4614a] leading-[13px]"
                >
                  <span className="text-[16px] leading-none">+</span>
                  <span>ADD PRODUCT</span>
                </button>
              </div>

            </div>
          )}

          {activeTab !== 'summary' && (
            <div className="flex items-center justify-center h-[200px] text-[#94a3b8] font-['Figtree:Regular',sans-serif] text-[13px]">
              No data available for {activeTab}.
            </div>
          )}
        </div>

      </div>

      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleProductsAdded}
        existingProductIds={products.map(p => p.catalogId).filter(Boolean)}
      />

    </div>
  );
}
