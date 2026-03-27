import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import AddProductModal from './AddProductModal.jsx';
import ProductCard from './ProductCard.jsx';
import NewContractPane from './NewContractPane.jsx';

// ─── Mock products for existing (non-new) contracts ────────────────────────────

const INITIAL_PRODUCTS = [
  {
    id: 'cp1',
    catalogId: 'api-calls',
    name: 'API Calls',
    type: 'Point in time',
    metric: 'Quantity',
    period: 'Jan 01, 2026 → Jun 30, 2026',
    billingDate: 'Jan 01, 2026',
    isMetered: true,
    phases: [
      { status: 'ONGOING',  range: 'Product Start → Mar 31, 2026', perUnitPrice: '$1.00',  quantityIncluded: '1000 units/month', billingCadence: 'Postpaid - Every Month', discount: '10% off', startDate: '2026-01-01', endDate: '2026-03-31' },
      { status: 'UPCOMING', range: 'Apr 01, 2026 → Jun 30, 2026',  perUnitPrice: '$2.00',  quantityIncluded: '1000 units/month', billingCadence: 'Postpaid - Every Month', minCommitment: '5000 units/month', startDate: '2026-04-01', endDate: '2026-06-30' },
    ],
  },
  {
    id: 'cp2',
    catalogId: 'hd-plan',
    name: 'HD Plan',
    type: 'Point in time',
    metric: 'Quantity',
    period: 'Jan 01, 2026 → Jun 30, 2026',
    billingDate: 'Jan 01, 2026',
    isMetered: false,
    phases: [
      { status: 'ONGOING',  range: 'Product Start → Mar 31, 2026', perUnitPrice: '$100.00', quantityIncluded: '1 seat/month', billingCadence: 'Prepaid - Every Month', startDate: '2026-01-01', endDate: '2026-03-31' },
      { status: 'UPCOMING', range: 'Apr 01, 2026 → Jun 30, 2026',  perUnitPrice: '$120.00', quantityIncluded: '1 seat/month', billingCadence: 'Prepaid - Every Month', startDate: '2026-04-01', endDate: '2026-06-30' },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function toDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  return new Date(v);
}

function toISODate(v) {
  const d = toDate(v);
  if (!d || isNaN(d)) return undefined;
  return d.toISOString().split('T')[0];
}

function fmtPeriodDate(v) {
  const d = toDate(v);
  if (!d || isNaN(d)) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function fmtBillingDate(v) {
  const d = toDate(v);
  if (!d || isNaN(d)) return '—';
  const day   = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  return `${day} ${month} ${d.getFullYear()}`;
}

// Invoice date helpers
function fmtInvShort(d) {
  if (!d || isNaN(d)) return '';
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day   = String(d.getDate()).padStart(2, '0');
  return `${month} ${day}`;
}

function fmtInvLong(d) {
  if (!d || isNaN(d)) return '';
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day   = String(d.getDate()).padStart(2, '0');
  return `${month} ${day}, ${d.getFullYear()}`;
}

// Build monthly preview invoices — seed drives simulated metered quantities
function generatePreviewInvoices(contract, products, seed = 1) {
  const contractStart = toDate(contract?.startDate || contract?.start);
  const contractEnd   = toDate(contract?.endDate   || contract?.end);
  const start = contractStart && !isNaN(contractStart) ? contractStart : new Date('2026-03-01');
  const end   = contractEnd   && !isNaN(contractEnd)   ? contractEnd   : new Date('2027-03-01');

  const invoices = [];
  let cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  let num = 1;

  while (cur < end && num <= 12) {
    const pStart = new Date(cur);
    const pEnd   = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
    if (pEnd >= end) pEnd.setTime(new Date(end.getTime() - 86400000));

    let subtotal = 0;
    const lineItems = products.map((p, pi) => {
      const priceStr = p.phases?.[0]?.perUnitPrice ?? p.prices?.[0]?.amount ?? '$0.00';
      const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      const isMetered = !!(p.isMetered || p.phases?.some(ph => ph?.billingCadence?.toLowerCase().includes('metered')));

      let qty, amountNum;
      if (isMetered) {
        // Pseudo-random qty 50–999 that varies per seed / invoice / product
        const r = 50 + ((seed * 173 + num * 41 + pi * 97) % 950);
        qty = r.toFixed(2);
        amountNum = priceNum * r;
      } else {
        qty = '1.00';
        amountNum = priceNum;
      }

      const amountStr = `$${amountNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      subtotal += amountNum;
      return { name: p.name, pStart: new Date(pStart), pEnd: new Date(pEnd), price: priceStr, qty, amount: amountStr, isMetered };
    });

    const totalStr = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    invoices.push({ id: num, pStart: new Date(pStart), pEnd: new Date(pEnd), lineItems, total: totalStr });

    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    num++;
  }

  return invoices;
}

// ─── Icons ───────────────────────────────────────────────────────────────────────

function EditPencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 8.5L3 10L8.5 4.5L7 3L1.5 8.5Z" stroke="#94a3b8" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 3L8.5 1.5L10.5 3.5L9 5L7 3Z" stroke="#94a3b8" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.5 10.5H10.5" stroke="#94a3b8" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

function UsFlag() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 12" fill="none">
      <rect width="16" height="12" fill="#B22234"/>
      <path d="M0 1.5h16M0 3h16M0 4.5h16M0 6h16M0 7.5h16M0 9h16M0 10.5h16" stroke="white" strokeWidth="0.9"/>
      <rect width="7" height="5" fill="#3C3B6E"/>
      <g fill="white">
        <circle cx="1.5" cy="1" r="0.5"/><circle cx="3" cy="1" r="0.5"/><circle cx="4.5" cy="1" r="0.5"/>
        <circle cx="6" cy="1" r="0.5"/><circle cx="2.25" cy="2" r="0.5"/><circle cx="3.75" cy="2" r="0.5"/>
        <circle cx="5.25" cy="2" r="0.5"/><circle cx="1.5" cy="3" r="0.5"/><circle cx="3" cy="3" r="0.5"/>
        <circle cx="4.5" cy="3" r="0.5"/><circle cx="6" cy="3" r="0.5"/><circle cx="2.25" cy="4" r="0.5"/>
        <circle cx="3.75" cy="4" r="0.5"/><circle cx="5.25" cy="4" r="0.5"/>
      </g>
    </svg>
  );
}

function PlusChipIcon() {
  return (
    <div className="relative size-[16px] flex items-center justify-center shrink-0">
      <div className="absolute bg-[#94a3b8] h-[1.5px] w-[10px] rounded-[1px]" />
      <div className="absolute bg-[#94a3b8] h-[10px] w-[1.5px] rounded-[1px]" />
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <circle cx="5.5" cy="5.5" r="4.75" stroke="#94a3b8" strokeWidth="1"/>
      <rect x="5" y="5" width="1" height="3" rx="0.5" fill="#94a3b8"/>
      <circle cx="5.5" cy="3.5" r="0.6" fill="#94a3b8"/>
    </svg>
  );
}

function ChevronIcon({ up = false, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d={up ? 'M4 10L8 6L12 10' : 'M4 6L8 10L12 6'}
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h3l7 8h2M14 4h-2l-2-2M14 12h-2l-7-8H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2l2 2-2 2M12 10l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Small shared pieces ─────────────────────────────────────────────────────────

function ActionChip({ label }) {
  return (
    <button className="bg-white border border-[#e2e8f0] flex gap-[4px] items-center pl-[4px] pr-[8px] py-[4px] rounded-[4px] cursor-pointer hover:bg-[#f8fafc] transition-colors">
      <PlusChipIcon />
      <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[16px] whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────────

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center gap-[24px]">
      <div className="w-[89px] h-[89px] rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
          <rect x="5" y="4" width="18" height="24" rx="2" stroke="#cbd5e1" strokeWidth="1.5"/>
          <path d="M9 10h10M9 14h10M9 18h6" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="24" cy="24" r="6" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5"/>
          <path d="M24 21v6M21 24h6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="flex flex-col items-center gap-[8px]">
        <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[20px] leading-[1.4] text-center">
          No products added to the contract yet.
        </span>
        <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[1.4] text-center">
          Add a product to get started.
        </span>
      </div>
      <button
        onClick={onAdd}
        className="bg-[#ed765e] flex h-[40px] items-center justify-center px-[20px] rounded-[4px] border-0 cursor-pointer hover:bg-[#e06650] transition-colors"
      >
        <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-white text-[13px] tracking-[0.2px]">
          Add Products
        </span>
      </button>
    </div>
  );
}

// ─── Invoice Card ─────────────────────────────────────────────────────────────────

function InvoiceCard({ invoice, expanded, onToggle, isFirst }) {
  const periodLabel = `${fmtInvShort(invoice.pStart)} - ${fmtInvShort(invoice.pEnd)}, ${invoice.pEnd.getFullYear()}`;

  return (
    <div className="flex flex-col">

      {/* Divider — not before the very first invoice */}
      {!isFirst && <div className="h-px bg-[#e2e8f0] w-full shrink-0" />}

      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-[8px] py-[16px] bg-transparent border-0 cursor-pointer text-left hover:bg-[#f8fafc] transition-colors rounded-[4px]"
      >
        <div className="flex flex-col gap-[3px]">
          <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[14px] leading-[19.6px]">
            Invoice {invoice.id}
          </span>
          <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px]">
            {periodLabel}
          </span>
        </div>
        <div className="flex items-center gap-[8px] shrink-0">
          <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[14px] leading-[19.6px] whitespace-nowrap">
            {invoice.total}
          </span>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={`shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="M4 6l4 4 4-4" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {/* Expanded line items */}
      {expanded && (
        <div className="flex flex-col pb-[16px]">

          {/* Column headers */}
          <div className="flex gap-[8px] items-center pb-[8px] px-[8px]">
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#94a3b8] text-[10px] leading-[16px] tracking-[0.4px] uppercase shrink-0 w-[140px]">Item</span>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#94a3b8] text-[10px] leading-[16px] tracking-[0.4px] uppercase flex-1 min-w-0">Service Period</span>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#94a3b8] text-[10px] leading-[16px] tracking-[0.4px] uppercase flex-1 min-w-0 text-right">Price</span>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#94a3b8] text-[10px] leading-[16px] tracking-[0.4px] uppercase flex-1 min-w-0 text-right">Qty</span>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#94a3b8] text-[10px] leading-[16px] tracking-[0.4px] uppercase flex-1 min-w-0 text-right">Amount</span>
          </div>

          {/* Line item groups */}
          <div className="flex flex-col gap-[2px]">
            {invoice.lineItems.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                {/* Product group header */}
                <div className="bg-[#f8fafc] flex items-center p-[8px] rounded-[6px]">
                  <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1e293b] text-[12px] leading-[16px] w-[140px] shrink-0">
                    {item.name}
                  </span>
                </div>
                {/* Per Unit row */}
                <div className="flex gap-[8px] items-start p-[8px]">
                  <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] w-[140px] shrink-0">Per Unit</span>
                  <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] flex-1 min-w-0">
                    {fmtInvLong(item.pStart)} –<br />{fmtInvLong(item.pEnd)}
                  </span>
                  <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] flex-1 min-w-0 text-right whitespace-nowrap">{item.price}</span>
                  <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] flex-1 min-w-0 text-right">{item.qty}</span>
                  <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] flex-1 min-w-0 text-right whitespace-nowrap">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals summary */}
          <div className="bg-[#f8fafc] px-[12px] py-[12px] rounded-[6px] mt-[2px]">
            <div className="flex flex-col gap-[6px] items-end text-[12px] leading-[16px]">
              <div className="flex gap-[32px] justify-between w-full">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b]">Subtotal</span>
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] whitespace-nowrap">{invoice.total}</span>
              </div>
              <div className="flex gap-[32px] justify-between w-full">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b]">Invoice Total</span>
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] whitespace-nowrap">{invoice.total}</span>
              </div>
              <div className="flex gap-[32px] justify-between w-full">
                <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1e293b]">Amount Due</span>
                <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1e293b] whitespace-nowrap">{invoice.total}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ─── Invoice Preview Panel ────────────────────────────────────────────────────────

function InvoicePreviewPanel({ contract, products }) {
  const [usageSeed, setUsageSeed]   = useState(1);
  const invoices                    = generatePreviewInvoices(contract, products, usageSeed);
  const [expandedId, setExpandedId] = useState(invoices[0]?.id ?? null);

  const hasMetered = products.some(p =>
    p.isMetered || p.phases?.some(ph => ph?.billingCadence?.toLowerCase().includes('metered'))
  );

  return (
    <>
      <style>{`.inv-no-scroll::-webkit-scrollbar{display:none}`}</style>

      <div
        className="inv-no-scroll flex flex-col gap-[14px] p-[24px] h-full overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >

        {/* ── Header ── */}
        <div className="flex flex-col gap-[6px] shrink-0">
          <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[16px] leading-[16px]">
            Invoice Preview
          </span>
          <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] m-0">
            Preview estimated invoices based on your current contract settings.
          </p>
        </div>

        {/* ── Banner + invoice list ── */}
        <div className="flex flex-col gap-[6px]">

          {/* Metered usage banner */}
          {hasMetered && (
            <div className="bg-[#fff8eb] border border-[#feeac7] rounded-[4px] pl-[8px] pr-[12px] py-[8px] flex gap-[16px] items-center shrink-0 w-full">
              <div className="flex flex-1 min-w-0 gap-[6px] items-start">
                <div className="flex items-center py-[2px] shrink-0">
                  {/* alert-circle icon */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="#d97706" strokeWidth="1.4"/>
                    <path d="M7 4.5v3" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round"/>
                    <circle cx="7" cy="9.5" r="0.6" fill="#d97706"/>
                  </svg>
                </div>
                <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#92610e] text-[12px] leading-[16px] m-0">
                  Metered line items use sample usage figures. Actual amounts will update based on real usage.
                </p>
              </div>
              <button
                onClick={() => setUsageSeed(s => s + 1)}
                className="flex items-center gap-[4px] bg-white border border-[#e2e8f0] rounded-[4px] px-[9px] py-[5px] cursor-pointer hover:bg-[#f8fafc] transition-colors shrink-0"
              >
                {/* refresh-ccw icon */}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M11 2v3H8" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.5 6a4.5 4.5 0 0 1 7.72-3.14L11 5" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 10V7h3" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.5 6a4.5 4.5 0 0 1-7.72 3.14L1 7" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#334155] text-[12px] leading-[16px] whitespace-nowrap">
                  Randomize Usage
                </span>
              </button>
            </div>
          )}

          {/* Flat invoice list separated by dividers */}
          <div className="flex flex-col">
            {invoices.map((inv, i) => (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                expanded={expandedId === inv.id}
                onToggle={() => setExpandedId(prev => prev === inv.id ? null : inv.id)}
                isFirst={i === 0}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Contract Details Page ─────────────────────────────────────────────────────────

export default function ContractDetailsPage({ contract, onBack, isNew = false }) {
  const [status, setStatus]                       = useState(isNew ? 'draft' : 'published');
  const [contractName, setContractName]           = useState(contract?.name || 'Contract');
  const [editingName, setEditingName]             = useState(false);
  const [nameInput, setNameInput]                 = useState(contract?.name || 'Contract');
  const [description, setDescription]             = useState(contract?.description || '');
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionInput, setDescriptionInput]   = useState(contract?.description || '');
  const [products, setProducts]                   = useState(isNew ? [] : INITIAL_PRODUCTS);
  const [addModalOpen, setAddModalOpen]           = useState(false);
  const [activeTab, setActiveTab]                 = useState('summary');
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [panelWidth, setPanelWidth]               = useState(600);
  const [isResizing, setIsResizing]               = useState(false);
  const [hasChanges, setHasChanges]               = useState(false);
  const [showEditPane, setShowEditPane]       = useState(false);
  const [showAllDetails, setShowAllDetails]   = useState(false);
  // overflowFromIndex: items[i] with i >= this value are hidden in row 1 (shown in row 2)
  // 7 = all visible (no overflow)
  const [overflowFromIndex, setOverflowFromIndex] = useState(7);

  const nameInputRef        = useRef(null);
  const descriptionInputRef = useRef(null);
  const resizeStartX        = useRef(0);
  const resizeStartW        = useRef(0);
  const detailRowOuterRef   = useRef(null);   // outer flex container (items + buttons)
  const detailItemsRef      = useRef([]);     // ref per detail item element
  const cachedItemWidths    = useRef([]);     // natural widths, measured once on mount

  const isDraft     = status === 'draft';
  const hasProducts = products.length > 0;

  useEffect(() => {
    if (isNew) setAddModalOpen(true);
  }, []);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  useEffect(() => {
    if (editingDescription && descriptionInputRef.current) {
      const el = descriptionInputRef.current;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
      el.focus();
      // place cursor at end
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
  }, [editingDescription]);

  useEffect(() => {
    if (!hasProducts) setShowInvoicePreview(false);
  }, [hasProducts]);

  // ── Details row: measure item widths once, then compute cutoff on resize ──
  function computeDetailsCutoff() {
    const outer = detailRowOuterRef.current;
    const widths = cachedItemWidths.current;
    if (!outer || !widths.length) return;

    const containerW = outer.clientWidth;
    // Approximate button widths + gap (24px) before each: Edit ~55px, Show All ~85px
    const EDIT_SLOT     = 55 + 24;
    const SHOW_ALL_SLOT = 85 + 24;

    // Total natural width for all items (with 48px gaps between them)
    const totalW = widths.reduce((s, w, i) => s + w + (i > 0 ? 48 : 0), 0);

    // If all items fit alongside Edit button only → no Show All needed
    if (totalW <= containerW - EDIT_SLOT) {
      setOverflowFromIndex(7);
      return;
    }

    // Items overflow → find how many fit alongside Show All + Edit
    const available = containerW - EDIT_SLOT - SHOW_ALL_SLOT;
    let used = 0;
    let cutoff = 1; // always show at least 1 item
    for (let i = 0; i < widths.length; i++) {
      const needed = (i > 0 ? 48 : 0) + widths[i];
      if (used + needed > available) break;
      used += needed;
      cutoff = i + 1;
    }
    setOverflowFromIndex(cutoff);
  }

  // Measure all item widths synchronously before first paint (no flicker)
  useLayoutEffect(() => {
    cachedItemWidths.current = detailItemsRef.current.map(el => el?.offsetWidth ?? 0);
    computeDetailsCutoff();
  }, []);

  // Re-compute on every container resize
  useEffect(() => {
    const el = detailRowOuterRef.current;
    if (!el) return;
    const ro = new ResizeObserver(computeDetailsCutoff);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Resize drag listeners ──
  useEffect(() => {
    if (!isResizing) return;

    document.body.style.cursor    = 'col-resize';
    document.body.style.userSelect = 'none';

    function onMouseMove(e) {
      // Panel is on the RIGHT; dragging handle LEFT = wider
      const delta  = resizeStartX.current - e.clientX;
      const newW   = Math.max(280, Math.min(600, resizeStartW.current + delta));
      setPanelWidth(newW);
    }
    function onMouseUp() {
      setIsResizing(false);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',   onMouseUp);
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  function handleResizeStart(e) {
    resizeStartX.current = e.clientX;
    resizeStartW.current = panelWidth;
    setIsResizing(true);
    e.preventDefault();
  }

  const tabs = isDraft
    ? ['Summary']
    : ['Summary', 'Invoices', 'Accounting', 'Logs', 'Settings'];

  const startDateStr    = fmtPeriodDate(contract?.startDate || contract?.start);
  const endDateStr      = fmtPeriodDate(contract?.endDate   || contract?.end);
  const billingStartStr = fmtBillingDate(contract?.billingStartDate || contract?.startDate || contract?.start);

  function markChanged() {
    if (!isDraft) {
      setHasChanges(true);
      setShowInvoicePreview(true);
    }
  }

  function saveContractName() {
    const trimmed = nameInput.trim();
    if (trimmed) {
      if (trimmed !== contractName) markChanged();
      setContractName(trimmed);
    } else {
      setNameInput(contractName);
    }
    setEditingName(false);
  }

  function saveDescription() {
    const trimmed = descriptionInput.trim();
    if (trimmed !== description) markChanged();
    setDescription(trimmed);
    setEditingDescription(false);
  }

  function handleProductsAdded(newProducts) {
    setProducts(prev => [...prev, ...newProducts]);
    markChanged();
  }

  function handleProductRemoved(catalogId) {
    setProducts(prev => prev.filter(p => p.catalogId !== catalogId));
    markChanged();
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 pt-[11px]">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-[8px] mb-[9px] shrink-0 h-[22px]">
        <span
          onClick={onBack}
          className="font-['Figtree:Medium',sans-serif] font-medium text-[#94a3b8] text-[13px] leading-none cursor-pointer hover:text-[#cbd5e1] whitespace-nowrap"
        >
          {'Home  /  Contract  /'}
        </span>
        <div className="bg-[#334155] flex items-center justify-center px-[4px] h-[22px] rounded-[4px] shrink-0">
          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[13px] text-white leading-none whitespace-nowrap">
            {contractName}
          </span>
        </div>
      </div>

      {/* ── Top white card ── */}
      <div className="bg-white rounded-tl-[8px] rounded-bl-[8px] shrink-0">

        <div className="px-[24px] pt-[20px] pb-[4px] shrink-0">
          <div className="flex items-center justify-between mb-[-4px]">

            <div className="flex items-center gap-[12px] flex-wrap min-w-0">
              {/* Contract name — p-[4px] wrapper keeps content in same position across default/hover/editing states */}
              <div
                className={`p-[4px] rounded-[4px] border transition-colors ${
                  editingName
                    ? 'border-[#e2e8f0]'
                    : 'border-transparent hover:bg-[#f5f7fb] cursor-pointer'
                }`}
                onClick={() => { if (!editingName) { setNameInput(contractName); setEditingName(true); } }}
                title={editingName ? undefined : 'Click to rename'}
              >
                {/* Inner relative wrapper — no padding, so inset-0 on the input aligns exactly with the ghost span */}
                <div className="relative">
                  {/* Ghost span — always holds the size; hidden when editing so input text shows */}
                  <span
                    aria-hidden="true"
                    className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[24px] tracking-[-0.24px] leading-[24px] whitespace-nowrap select-none block"
                    style={{ visibility: editingName ? 'hidden' : 'visible' }}
                  >
                    {editingName ? nameInput || '\u00A0' : contractName}
                  </span>
                  {/* Input sits exactly over the ghost span */}
                  {editingName && (
                    <input
                      ref={nameInputRef}
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      onBlur={saveContractName}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveContractName();
                        if (e.key === 'Escape') { setNameInput(contractName); setEditingName(false); }
                      }}
                      className="absolute inset-0 w-full font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[24px] tracking-[-0.24px] leading-[24px] border-0 outline-none bg-transparent p-0 m-0"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-start gap-[8px]">
                {isDraft ? (
                  <div className="bg-[#f8fafc] border border-[#f1f5f9] flex gap-[4px] items-center p-[4px] rounded-[2px] shrink-0">
                    <EditPencilIcon />
                    <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[10px] uppercase leading-[12px] whitespace-nowrap">
                      Draft
                    </span>
                  </div>
                ) : (
                  <div className="bg-[#f0fdf4] border border-[#bbf7d0] flex items-center px-[8px] h-[22px] rounded-[4px] shrink-0">
                    <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#16a34a] text-[10px] uppercase tracking-[0.4px]">
                      Published
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isDraft && hasProducts && (
              <button
                onClick={() => setStatus('published')}
                className="bg-[#ed765e] flex h-[32px] items-center justify-center px-[16px] rounded-[4px] cursor-pointer border-0 shrink-0 ml-[16px] hover:bg-[#e06650] transition-colors"
              >
                <span className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[12px] tracking-[0.2px] uppercase">
                  PUBLISH
                </span>
              </button>
            )}
            {!isDraft && hasChanges && (
              <button
                onClick={() => { setHasChanges(false); setShowInvoicePreview(false); }}
                className="bg-[#ed765e] flex h-[32px] items-center justify-center px-[16px] rounded-[4px] cursor-pointer border-0 shrink-0 ml-[16px] hover:bg-[#e06650] transition-colors"
              >
                <span className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[12px] tracking-[0.2px] uppercase">
                  UPDATE CONTRACT
                </span>
              </button>
            )}

          </div>

          {/* Description — same hover/edit pattern as contract name */}
          <div
            className={`p-[4px] rounded-[4px] border transition-colors w-fit min-w-[200px] ${
              editingDescription
                ? 'border-[#e2e8f0]'
                : 'border-transparent hover:bg-[#f5f7fb] cursor-pointer'
            }`}
            onClick={() => {
              if (!editingDescription) {
                setDescriptionInput(description);
                setEditingDescription(true);
              }
            }}
          >
            <div className="relative">
              {/* Ghost span — holds size so no layout shift */}
              <span
                aria-hidden="true"
                className="font-['Figtree:Regular',sans-serif] font-normal text-[12px] leading-[16px] whitespace-pre-wrap block"
                style={{
                  visibility: editingDescription ? 'hidden' : 'visible',
                  color: '#64748b',
                }}
              >
                {editingDescription
                  ? (descriptionInput || '\u00A0')
                  : (description || 'Add description')}
              </span>
              {/* Textarea overlaid when editing */}
              {editingDescription && (
                <textarea
                  ref={descriptionInputRef}
                  value={descriptionInput}
                  rows={1}
                  onChange={e => {
                    setDescriptionInput(e.target.value);
                    // auto-grow
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onBlur={saveDescription}
                  onKeyDown={e => {
                    if (e.key === 'Escape') { setDescriptionInput(description); setEditingDescription(false); }
                  }}
                  className="absolute inset-0 w-full font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] border-0 outline-none bg-transparent p-0 m-0 resize-none overflow-hidden"
                />
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-[#e2e8f0] mx-[24px] shrink-0" />

        {/* ── Details row: measurement-based overflow — items that don't fit are hidden
              completely (display:none) and shown in the secondary row below ── */}
        <div ref={detailRowOuterRef} className="flex items-end gap-[24px] px-[20px] pt-[12px] pb-[16px] shrink-0">

          {/* Items — no overflow clipping; items beyond cutoff are display:none */}
          <div className="flex-1 min-w-0 flex gap-[48px] items-end overflow-visible">

            {/* 0 · Customer */}
            <div ref={el => { detailItemsRef.current[0] = el; }}
              className="flex flex-col gap-[6px] p-[4px] shrink-0"
              style={overflowFromIndex <= 0 ? { display: 'none' } : {}}>
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Customer</span>
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1145bc] text-[13px] leading-[13px] cursor-pointer hover:underline whitespace-nowrap">
                {contract?.customer || '—'}
              </span>
            </div>

            {/* 1 · Currency */}
            <div ref={el => { detailItemsRef.current[1] = el; }}
              className="flex flex-col gap-[6px] p-[4px] shrink-0"
              style={overflowFromIndex <= 1 ? { display: 'none' } : {}}>
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Currency</span>
              <div className="flex items-center gap-[6px]">
                <UsFlag />
                <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[13px] leading-[13px] whitespace-nowrap">
                  {contract?.currency || 'USD'}
                </span>
              </div>
            </div>

            {/* 2 · Contract Period */}
            <div ref={el => { detailItemsRef.current[2] = el; }}
              className="flex flex-col gap-[6px] p-[4px] shrink-0"
              style={overflowFromIndex <= 2 ? { display: 'none' } : {}}>
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Contract Period</span>
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[13px] leading-[13px] whitespace-pre">
                {`${startDateStr}  -  ${endDateStr}`}
              </span>
            </div>

            {/* 3 · Anchor Date */}
            <div ref={el => { detailItemsRef.current[3] = el; }}
              className="flex flex-col gap-[6px] p-[4px] shrink-0"
              style={overflowFromIndex <= 3 ? { display: 'none' } : {}}>
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Anchor Date</span>
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[13px] leading-[13px] whitespace-nowrap">
                {billingStartStr}
              </span>
            </div>

            {/* 4 · Billing Cadence */}
            <div ref={el => { detailItemsRef.current[4] = el; }}
              className="flex flex-col gap-[6px] p-[4px] shrink-0"
              style={overflowFromIndex <= 4 ? { display: 'none' } : {}}>
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Billing Cadence</span>
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[13px] leading-[13px] whitespace-nowrap">
                {contract?.billingCadence || 'Postpaid - Every Month'}
              </span>
            </div>

            {/* 5 · Custom Attributes */}
            <div ref={el => { detailItemsRef.current[5] = el; }}
              className="flex flex-col gap-[6px] p-[4px] shrink-0"
              style={overflowFromIndex <= 5 ? { display: 'none' } : {}}>
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Custom Attributes</span>
              <div className="border border-[#e2e8f0] flex items-center justify-center h-[18px] px-[6px] py-[2px] rounded-[4px] self-start">
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#334155] text-[11px] leading-none whitespace-nowrap">
                  {contract?.customAttributeCount != null ? `${contract.customAttributeCount} Added` : '3 Added'}
                </span>
              </div>
            </div>

            {/* 6 · Tags */}
            <div ref={el => { detailItemsRef.current[6] = el; }}
              className="flex flex-col gap-[6px] p-[4px] shrink-0"
              style={overflowFromIndex <= 6 ? { display: 'none' } : {}}>
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Tags</span>
              <div className="flex items-center gap-[4px]">
                {(contract?.tags || ['placeholder', 'placeholder']).slice(0, 2).map((tag, i) => (
                  <span key={i}
                    className="flex items-center justify-center h-[18px] px-[4px] py-[2px] rounded-[4px] font-['Figtree:Medium',sans-serif] font-medium text-[#334155] text-[11px] leading-none whitespace-nowrap"
                    style={{ background: i === 0 ? '#e0e1ff' : '#f4e8ff' }}>
                    {tag}
                  </span>
                ))}
                {(contract?.tags?.length || 4) > 2 && (
                  <span className="flex items-center justify-center h-[18px] px-[4px] py-[2px] rounded-[4px] bg-[#f4e8ff] font-['Figtree:Medium',sans-serif] font-medium text-[#334155] text-[11px] leading-none whitespace-nowrap">
                    +{(contract?.tags?.length || 4) - 2}
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Show All + Edit — wrapped together so they always center-align with each other */}
          <div className="flex items-center gap-[24px] self-end shrink-0">

            {overflowFromIndex < 7 && (
              <button
                onClick={() => setShowAllDetails(v => !v)}
                className="flex items-center gap-[7px] bg-transparent border-0 cursor-pointer p-0"
              >
                <svg width="9" height="8" viewBox="0 0 9 8" fill="none"
                  className={`transition-transform shrink-0 ${showAllDetails ? '-rotate-90' : 'rotate-90'}`}>
                  <path d="M1 4H8M5 1l3 3-3 3" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">
                  {showAllDetails ? 'Show Less' : 'Show All'}
                </span>
              </button>
            )}

            <button
              onClick={() => setShowEditPane(true)}
              className="flex items-center gap-[6px] p-[6px] bg-transparent border-0 cursor-pointer rounded-[4px] hover:bg-[#f1f5f9] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9.917 1.75a1.237 1.237 0 0 1 1.75 1.75L4.083 11.083l-2.333.584.583-2.334L9.917 1.75Z" stroke="#7c8ba1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#7c8ba1] text-[12px] leading-[16px] whitespace-nowrap">Edit</span>
            </button>

          </div>
        </div>

        {/* ── Secondary row: all overflow items shown when Show All is active ── */}
        {overflowFromIndex < 7 && showAllDetails && (
          <div className="flex gap-[48px] items-end px-[20px] pb-[16px] shrink-0">

            {/* Render whichever items were hidden in row 1 */}
            {overflowFromIndex <= 0 && (
              <div className="flex flex-col gap-[6px] p-[4px] shrink-0">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Customer</span>
                <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1145bc] text-[13px] leading-[13px] cursor-pointer hover:underline whitespace-nowrap">{contract?.customer || '—'}</span>
              </div>
            )}
            {overflowFromIndex <= 1 && (
              <div className="flex flex-col gap-[6px] p-[4px] shrink-0">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Currency</span>
                <div className="flex items-center gap-[6px]"><UsFlag /><span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[13px] leading-[13px] whitespace-nowrap">{contract?.currency || 'USD'}</span></div>
              </div>
            )}
            {overflowFromIndex <= 2 && (
              <div className="flex flex-col gap-[6px] p-[4px] shrink-0">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Contract Period</span>
                <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[13px] leading-[13px] whitespace-pre">{`${startDateStr}  -  ${endDateStr}`}</span>
              </div>
            )}
            {overflowFromIndex <= 3 && (
              <div className="flex flex-col gap-[6px] p-[4px] shrink-0">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Anchor Date</span>
                <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[13px] leading-[13px] whitespace-nowrap">{billingStartStr}</span>
              </div>
            )}
            {overflowFromIndex <= 4 && (
              <div className="flex flex-col gap-[6px] p-[4px] shrink-0">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Billing Cadence</span>
                <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[13px] leading-[13px] whitespace-nowrap">{contract?.billingCadence || 'Postpaid - Every Month'}</span>
              </div>
            )}
            {overflowFromIndex <= 5 && (
              <div className="flex flex-col gap-[6px] p-[4px] shrink-0">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Custom Attributes</span>
                <div className="border border-[#e2e8f0] flex items-center justify-center h-[18px] px-[6px] py-[2px] rounded-[4px] self-start">
                  <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#334155] text-[11px] leading-none whitespace-nowrap">{contract?.customAttributeCount != null ? `${contract.customAttributeCount} Added` : '3 Added'}</span>
                </div>
              </div>
            )}
            {overflowFromIndex <= 6 && (
              <div className="flex flex-col gap-[6px] p-[4px] shrink-0">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Tags</span>
                <div className="flex items-center gap-[4px]">
                  {(contract?.tags || ['placeholder', 'placeholder']).slice(0, 2).map((tag, i) => (
                    <span key={i}
                      className="flex items-center justify-center h-[18px] px-[4px] py-[2px] rounded-[4px] font-['Figtree:Medium',sans-serif] font-medium text-[#334155] text-[11px] leading-none whitespace-nowrap"
                      style={{ background: i === 0 ? '#e0e1ff' : '#f4e8ff' }}>
                      {tag}
                    </span>
                  ))}
                  {(contract?.tags?.length || 4) > 2 && (
                    <span className="flex items-center justify-center h-[18px] px-[4px] py-[2px] rounded-[4px] bg-[#f4e8ff] font-['Figtree:Medium',sans-serif] font-medium text-[#334155] text-[11px] leading-none whitespace-nowrap">
                      +{(contract?.tags?.length || 4) - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── 8px gap ── */}
      <div className="h-[8px] shrink-0" />

      {/* ── Bottom white card ── */}
      <div className="bg-white rounded-tl-[8px] flex flex-col flex-1 min-h-0 overflow-hidden">

        {/* ── Tab bar ── */}
        <div className="relative flex items-end border-b border-[#e2e8f0] px-[24px] shrink-0">
          {tabs.map(tab => {
            const key    = tab.toLowerCase();
            const active = activeTab === key;
            return (
              <div key={tab} className="relative mr-[28px] shrink-0">
                <button
                  onClick={() => setActiveTab(key)}
                  className={`font-['Figtree:SemiBold',sans-serif] font-semibold text-[13px] pb-[14px] pt-[12px] bg-transparent border-0 cursor-pointer whitespace-nowrap ${
                    active ? 'text-[#ed765e]' : 'text-[#64748b] hover:text-[#334155]'
                  }`}
                >
                  {tab}
                </button>
                {active && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ed765e] rounded-tl-[2px] rounded-tr-[2px]" />
                )}
              </div>
            );
          })}

          {/* Invoice Preview toggle — draft, or published with unsaved changes */}
          {(isDraft || hasChanges) && hasProducts && (
            <label className="absolute right-[24px] bottom-[14px] flex items-center gap-[8px] cursor-pointer select-none">
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#64748b] text-[13px] leading-[16px] whitespace-nowrap">
                Invoice Preview
              </span>
              {/* Track */}
              <div
                onClick={() => setShowInvoicePreview(prev => !prev)}
                className={`relative w-[32px] h-[18px] rounded-full transition-colors duration-200 ${
                  showInvoicePreview ? 'bg-[#ed765e]' : 'bg-[#cbd5e1]'
                }`}
              >
                {/* Thumb */}
                <div className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  showInvoicePreview ? 'translate-x-[16px]' : 'translate-x-[2px]'
                }`} />
              </div>
            </label>
          )}
        </div>

        {/* ── Content: main area + invoice panel (on right) ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Main content */}
          <div className="bg-white flex-1 overflow-y-auto">
            {activeTab === 'summary' && (
              hasProducts ? (
                <div className="px-[24px] pt-[28px] pb-[32px]">
                  <div className="max-w-[820px] flex flex-col gap-[24px]">
                    <div className="flex items-center gap-[8px] flex-wrap">
                      {['Discount', 'Commitment'].map(label => (
                        <ActionChip key={label} label={label} />
                      ))}
                    </div>
                    <div className="flex flex-col gap-[16px]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[4px]">
                          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#64748b] text-[12px] leading-[12px] uppercase tracking-[0.2px]">
                            PRODUCTS
                          </span>
                          <InfoIcon />
                        </div>
                        <button
                          onClick={() => setAddModalOpen(true)}
                          className="font-['Figtree:Bold',sans-serif] font-bold text-[#1145bc] text-[12px] tracking-[0.2px] uppercase leading-[1.4] bg-transparent border-0 cursor-pointer p-0 hover:opacity-80"
                        >
                          + ADD PRODUCT
                        </button>
                      </div>
                      <div className="flex flex-col gap-[16px]">
                        {products.map(p => (
                          <ProductCard
                            key={p.id}
                            productName={p.name}
                            tags={[...new Set([p.type, p.metric].filter(t => t && t !== '—'))]}
                            contractStart={startDateStr}
                            contractEnd={endDateStr}
                            billingStartDate={p.billingDate}
                            prices={p.phases.map((phase, i) => ({
                              id:               `${p.id}-p${i}`,
                              status:           phase.status,
                              dateRange:        phase.range,
                              perUnitPrice:     phase.perUnitPrice,
                              quantityIncluded: phase.quantityIncluded,
                              billingCadence:   phase.billingCadence,
                              priceChanged:     phase.priceChanged || false,
                              discount:         phase.discount,
                              minCommitment:    phase.minCommitment,
                              startDate:        phase.startDate,
                              endDate:          phase.endDate,
                            }))}
                            overallStartDate={toISODate(contract?.startDate || contract?.start) || p.phases[0]?.startDate}
                            overallEndDate={toISODate(contract?.endDate || contract?.end) || p.phases[p.phases.length - 1]?.endDate}
                            onRemove={() => handleProductRemoved(p.catalogId)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <EmptyState onAdd={() => setAddModalOpen(true)} />
                </div>
              )
            )}
            {activeTab !== 'summary' && (
              <div className="flex items-center justify-center h-[200px] text-[#94a3b8] font-['Figtree:Regular',sans-serif] text-[13px]">
                Coming soon
              </div>
            )}
          </div>

          {/* ── Invoice preview panel — slides in from RIGHT ── */}
          <div
            style={{ width: showInvoicePreview ? `${Math.min(panelWidth, 600)}px` : '0px' }}
            className={`relative shrink-0 bg-white border-l border-[#e2e8f0] overflow-hidden ${
              isResizing ? '' : 'transition-[width] duration-300 ease-in-out'
            }`}
          >
            {/* Drag-to-resize handle on left edge */}
            {showInvoicePreview && (
              <div
                onMouseDown={handleResizeStart}
                className="absolute left-0 top-0 bottom-0 w-[4px] z-10 cursor-col-resize hover:bg-[#e2e8f0] transition-colors"
              />
            )}

            {/* Scrollable content at full panel width */}
            <div
              style={{ width: `${Math.min(panelWidth, 600)}px`, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className="h-full overflow-y-auto"
            >
              <InvoicePreviewPanel contract={contract} products={products} />
            </div>
          </div>

        </div>
      </div>

      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleProductsAdded}
        onRemove={handleProductRemoved}
        onDone={() => { if (isDraft) setShowInvoicePreview(true); }}
        existingProductIds={products.map(p => p.catalogId).filter(Boolean)}
      />

      {/* ── Edit Contract Details pane ── */}
      <NewContractPane
        isOpen={showEditPane}
        onClose={() => setShowEditPane(false)}
        editMode
      />

    </div>
  );
}
