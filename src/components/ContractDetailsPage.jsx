import { useState, useEffect, useRef } from 'react';
import AddProductModal from './AddProductModal.jsx';
import ProductCard from './ProductCard.jsx';

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

function InvoiceCard({ invoice, expanded, onToggle }) {
  const periodLabel = `${fmtInvShort(invoice.pStart)} - ${fmtInvShort(invoice.pEnd)}, ${invoice.pEnd.getFullYear()}`;

  return (
    <div className="border border-[#e2e8f0] rounded-[8px] bg-white overflow-hidden">

      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between px-[16px] py-[14px] bg-transparent border-0 cursor-pointer text-left hover:bg-[#f8fafc] transition-colors"
      >
        <div className="flex flex-col gap-[4px]">
          <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[14px] leading-[1.4]">
            Invoice #{invoice.id}
          </span>
          <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px]">
            {periodLabel} • {invoice.total}
          </span>
        </div>
        <div className="mt-[2px] shrink-0">
          <ChevronIcon up={expanded} />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-[#e2e8f0]">

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                {['Item', 'Service Period', 'Price', 'Qty', 'Amount'].map((col, i) => (
                  <th
                    key={col}
                    className={`py-[8px] font-['Figtree:SemiBold',sans-serif] font-semibold text-[#94a3b8] text-[10px] leading-[16px] whitespace-nowrap border-b border-[#e2e8f0]
                      ${i === 0 ? 'text-left px-[16px]' : i === 1 ? 'text-left px-[6px]' : 'text-right px-[6px]'}
                      ${i === 4 ? 'pr-[16px]' : ''}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {invoice.lineItems.map((item, idx) => (
                <>
                  {/* Product name row */}
                  <tr key={`item-${idx}`} className="border-t border-[#e2e8f0]">
                    <td className="px-[16px] pt-[10px] pb-[3px] font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1e293b] text-[12px] leading-[1.4] align-top">
                      {item.name}
                    </td>
                    <td className="px-[6px] pt-[10px] pb-[3px] font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[11px] leading-[15px] align-top">
                      {fmtInvLong(item.pStart)} –<br />{fmtInvLong(item.pEnd)}
                    </td>
                    <td className="px-[6px] pt-[10px] pb-[3px] align-top" />
                    <td className="px-[6px] pt-[10px] pb-[3px] align-top" />
                    <td className="px-[6px] pr-[16px] pt-[10px] pb-[3px] text-right font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1e293b] text-[12px] leading-[1.4] align-top whitespace-nowrap">
                      {item.amount}
                    </td>
                  </tr>
                  {/* Per Unit sub-row */}
                  <tr key={`unit-${idx}`} className="bg-white">
                    <td className="pl-[24px] pr-[6px] py-[7px] font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[11px] leading-[15px]">
                      Per Unit
                    </td>
                    <td className="px-[6px] py-[7px] font-['Figtree:Regular',sans-serif] font-normal text-[#94a3b8] text-[11px] leading-[15px]">
                      –
                    </td>
                    <td className="px-[6px] py-[7px] text-right font-['Figtree:Regular',sans-serif] font-normal text-[#334155] text-[11px] leading-[15px] whitespace-nowrap">
                      {item.price}
                    </td>
                    <td className="px-[6px] py-[7px] text-right font-['Figtree:Regular',sans-serif] font-normal text-[#334155] text-[11px] leading-[15px]">
                      {item.qty}
                    </td>
                    <td className="px-[6px] pr-[16px] py-[7px] text-right font-['Figtree:Regular',sans-serif] font-normal text-[#334155] text-[11px] leading-[15px] whitespace-nowrap">
                      {item.amount}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t border-[#e2e8f0]">
            {[['Subtotal', invoice.total], ['Total', invoice.total]].map(([label, val]) => (
              <div key={label} className="flex items-center justify-end gap-[32px] px-[16px] py-[7px]">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[11px] leading-[15px] w-[64px] text-right">
                  {label}
                </span>
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#334155] text-[11px] leading-[15px] w-[72px] text-right">
                  {val}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-end gap-[32px] px-[16px] py-[9px] bg-[#f8fafc] border-t border-[#e2e8f0]">
              <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[11px] leading-[15px] w-[64px] text-right">
                Amount Due
              </span>
              <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[11px] leading-[15px] w-[72px] text-right">
                {invoice.total}
              </span>
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
      {/* Hide scrollbar for webkit browsers */}
      <style>{`.inv-no-scroll::-webkit-scrollbar{display:none}`}</style>

      <div className="flex flex-col h-full">

        {/* ── Panel header ── */}
        <div className="px-[20px] pt-[20px] pb-[16px] border-b border-[#e2e8f0] shrink-0">
          <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[15px] leading-[1.4] block">
            Invoice Preview
          </span>
          <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] mt-[4px] m-0">
            Preview estimated invoices based on your current contract settings.
          </p>
        </div>

        {/* ── Metered usage banner ── */}
        {hasMetered && (
          <div className="mx-[16px] mt-[12px] bg-[#fffbeb] border border-[#fde68a] rounded-[6px] px-[12px] py-[10px] flex items-start gap-[10px] shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[1px]">
              <path d="M8 2L14 13H2L8 2Z" stroke="#d97706" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M8 7v3M8 11.5v.5" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <div className="flex-1 min-w-0">
              <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#92400e] text-[11px] leading-[15px] m-0">
                Metered usage is simulated and not real.
              </p>
            </div>
            <button
              onClick={() => setUsageSeed(s => s + 1)}
              className="flex items-center gap-[4px] bg-white border border-[#fde68a] rounded-[4px] px-[8px] py-[4px] cursor-pointer hover:bg-[#fef3c7] transition-colors shrink-0 border-0"
            >
              <ShuffleIcon />
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#92400e] text-[11px] leading-[15px] whitespace-nowrap">
                Randomise
              </span>
            </button>
          </div>
        )}

        {/* ── Invoice list ── */}
        <div
          className="inv-no-scroll flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex flex-col gap-[8px] p-[16px]">
            {invoices.map(inv => (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                expanded={expandedId === inv.id}
                onToggle={() => setExpandedId(prev => prev === inv.id ? null : inv.id)}
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
  const [status, setStatus]             = useState(isNew ? 'draft' : 'published');
  const [contractName, setContractName] = useState(contract?.name || 'Contract');
  const [editingName, setEditingName]   = useState(false);
  const [nameInput, setNameInput]       = useState(contract?.name || 'Contract');
  const [products, setProducts]         = useState(isNew ? [] : INITIAL_PRODUCTS);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeTab, setActiveTab]       = useState('summary');
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [panelWidth, setPanelWidth]     = useState(420);
  const [isResizing, setIsResizing]     = useState(false);
  const [hasChanges, setHasChanges]     = useState(false);
  const nameInputRef    = useRef(null);
  const resizeStartX    = useRef(0);
  const resizeStartW    = useRef(0);

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
    if (!hasProducts) setShowInvoicePreview(false);
  }, [hasProducts]);

  // ── Resize drag listeners ──
  useEffect(() => {
    if (!isResizing) return;

    document.body.style.cursor    = 'col-resize';
    document.body.style.userSelect = 'none';

    function onMouseMove(e) {
      // Panel is on the RIGHT; dragging handle LEFT = wider
      const delta  = resizeStartX.current - e.clientX;
      const newW   = Math.max(320, Math.min(700, resizeStartW.current + delta));
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
      <div className="flex items-center gap-[8px] mb-[9px] shrink-0">
        <span
          onClick={onBack}
          className="font-['Figtree:Medium',sans-serif] font-medium text-[#94a3b8] text-[13px] leading-[16px] cursor-pointer hover:text-[#cbd5e1] whitespace-nowrap"
        >
          {'Home  /  Contract  /'}
        </span>
        <div className="bg-[#334155] flex items-center justify-center px-[4px] py-[4px] rounded-[4px] shrink-0">
          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[13px] text-white leading-[13px] whitespace-nowrap">
            {contractName}
          </span>
        </div>
      </div>

      {/* ── Top white card ── */}
      <div className="bg-white rounded-tl-[8px] rounded-bl-[8px] shrink-0">

        <div className="px-[24px] pt-[19px] shrink-0">
          <div className="flex items-center justify-between mb-[12px]">

            <div className="flex items-center gap-[15px] flex-wrap min-w-0">
              {editingName ? (
                <input
                  ref={nameInputRef}
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onBlur={saveContractName}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveContractName();
                    if (e.key === 'Escape') { setNameInput(contractName); setEditingName(false); }
                  }}
                  className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[24px] tracking-[-0.24px] leading-[24px] border-0 border-b-2 border-[#ed765e] outline-none bg-transparent min-w-[200px]"
                />
              ) : (
                <span
                  onClick={() => { setNameInput(contractName); setEditingName(true); }}
                  className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[24px] tracking-[-0.24px] leading-[24px] cursor-pointer hover:opacity-80 whitespace-nowrap"
                  title="Click to rename"
                >
                  {contractName}
                </span>
              )}

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

          <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] mb-[12px] m-0">
            {contract?.description || 'The description for this contract goes here'}
          </p>
        </div>

        <div className="h-px bg-[#e2e8f0] mx-[24px] shrink-0" />

        <div className="flex items-center gap-[48px] px-[24px] pt-[20px] pb-[24px] shrink-0 overflow-x-auto">
          <div className="flex flex-col gap-[8px] shrink-0">
            <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Customer</span>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1145bc] text-[14px] leading-[16px] cursor-pointer hover:underline whitespace-nowrap">
              {contract?.customer || '—'}
            </span>
          </div>
          <div className="flex flex-col gap-[8px] shrink-0">
            <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Currency</span>
            <div className="flex items-center gap-[6px]">
              <UsFlag />
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[14px] leading-[16px] whitespace-nowrap">
                {contract?.currency || 'USD'}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-[8px] shrink-0">
            <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Contract Period</span>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[14px] leading-[16px] whitespace-pre">
              {`${startDateStr}  -  ${endDateStr}`}
            </span>
          </div>
          <div className="flex flex-col gap-[8px] shrink-0">
            <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Anchor Date</span>
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[14px] leading-[16px] whitespace-nowrap">
              {billingStartStr}
            </span>
          </div>
          <div className="flex flex-col gap-[4px] shrink-0">
            <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px] whitespace-nowrap">Custom Attributes</span>
            <div className="border border-[#e2e8f0] flex items-center justify-center p-[4px] rounded-[4px] w-[48px] cursor-pointer hover:bg-[#f8fafc]">
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#7c8ba1] text-[12px] leading-[12px] whitespace-nowrap">View</span>
            </div>
          </div>
        </div>

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

          {/* Toggle button — draft only */}
          {isDraft && hasProducts && (
            <button
              onClick={() => setShowInvoicePreview(prev => !prev)}
              className={`absolute right-[24px] bottom-[14px] bg-transparent border-0 p-0 cursor-pointer font-['Figtree:Regular',sans-serif] font-normal text-[12px] leading-[16px] whitespace-nowrap transition-colors ${
                showInvoicePreview
                  ? 'text-[#ed765e] hover:text-[#c05040]'
                  : 'text-[#64748b] hover:text-[#334155]'
              }`}
            >
              {showInvoicePreview ? 'Hide Invoice Preview' : 'Preview Invoices'}
            </button>
          )}
        </div>

        {/* ── Content: main area + invoice panel (on right) ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Main content */}
          <div className="bg-[#f8fafc] flex-1 overflow-y-auto">
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
            style={{ width: showInvoicePreview ? `${panelWidth}px` : '0px' }}
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
              style={{ width: `${panelWidth}px`, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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

    </div>
  );
}
