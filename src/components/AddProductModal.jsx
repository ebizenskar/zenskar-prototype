import { useState } from 'react';

const imgClose = "http://localhost:3845/assets/98e25a857aab2114e770322536f9cafb06034d96.svg";

// ─── Product catalog ──────────────────────────────────────────────────────────

export const PRODUCT_CATALOG = [
  {
    id: 'user-seats',
    name: 'User Seats',
    type: 'Period of time',
    metric: 'Quantity',
    prices: [
      { id: 'us-p1', model: 'Per Unit Price', amount: '$20.00',    unit: '/seat/month' },
      { id: 'us-p2', model: 'Per Unit Price', amount: '$200.00',   unit: '/seat/year'  },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    type: 'Period of time',
    metric: 'Quantity',
    prices: [
      { id: 'st-p1', model: 'Per Unit Price', amount: '$0.10', unit: '/GB/month' },
    ],
  },
  {
    id: 'premium-support',
    name: 'Premium Support',
    type: 'Period of time',
    metric: 'Flat fee',
    prices: [
      { id: 'ps-p1', model: 'Flat Fee', amount: '$500.00',   unit: '/month' },
      { id: 'ps-p2', model: 'Flat Fee', amount: '$5,000.00', unit: '/year'  },
    ],
  },
  {
    id: 'data-exports',
    name: 'Data Exports',
    type: 'Point in time',
    metric: 'Quantity',
    prices: [
      { id: 'de-p1', model: 'Per Unit Price', amount: '$0.05', unit: '/export' },
    ],
  },
  {
    id: 'api-calls',
    name: 'API Calls',
    type: 'Point in time',
    metric: 'Quantity',
    prices: [
      { id: 'ac-p1', model: 'Per Unit Price', amount: '$1.00', unit: '/call' },
      { id: 'ac-p2', model: 'Volume Price', unit: '/call',
        tiers: [
          { from: 0,    to: 1000, price: '$0.010' },
          { from: 1000, to: 5000, price: '$0.008' },
          { from: 5000, to: null, price: '$0.005' },
        ],
      },
    ],
  },
  {
    id: 'hd-plan',
    name: 'HD Plan',
    type: 'Point in time',
    metric: 'Quantity',
    prices: [
      { id: 'hd-p1', model: 'Per Unit Price', amount: '$1.00', unit: '/access' },
    ],
  },
  {
    id: 'email-notifications',
    name: 'Email Notifications',
    type: 'Point in time',
    metric: 'Quantity',
    prices: [
      { id: 'en-p1', model: 'Per Unit Price', amount: '$0.002', unit: '/email' },
      { id: 'en-p2', model: 'Volume Price', unit: '/email',
        tiers: [
          { from: 0,     to: 10000, price: '$0.0020' },
          { from: 10000, to: 50000, price: '$0.0015' },
          { from: 50000, to: null,  price: '$0.0010' },
        ],
      },
    ],
  },
  {
    id: 'feature-access',
    name: 'Feature Access',
    type: 'Period of time',
    metric: 'Flat fee',
    prices: [
      { id: 'fa-p1', model: 'Flat Fee', amount: '$99.00',  unit: '/month' },
      { id: 'fa-p2', model: 'Flat Fee', amount: '$299.00', unit: '/month' },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtNum(n) {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000)     return `${n / 1_000}K`;
  return String(n);
}

function tierLabel(tier, isLast) {
  return isLast ? `${fmtNum(tier.from)}+` : `${fmtNum(tier.from)} – ${fmtNum(tier.to)}`;
}

function priceSummary(price) {
  if (price.tiers) return `${price.model} · ${price.tiers.length} tiers`;
  return `${price.amount}${price.unit ? ' ' + price.unit : ''}`;
}

// ─── Check circle ─────────────────────────────────────────────────────────────

function CheckCircle({ checked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
        checked
          ? 'bg-[#ed765e] border-[1.5px] border-[#ed765e]'
          : 'bg-white border border-[#cbd5e1] hover:border-[#94a3b8]'
      }`}
    >
      {checked && (
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
          <path d="M1 3.5L3.5 6L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ─── Type tag ─────────────────────────────────────────────────────────────────

function TypeTag({ type }) {
  const bg = type === 'Point in time' ? 'bg-[#d8edff]' : 'bg-[#eef]';
  return (
    <span className={`${bg} text-[#64748b] text-[11px] font-['Figtree:Medium',sans-serif] font-medium px-[6px] py-[2px] rounded-[4px] whitespace-nowrap shrink-0`}>
      {type}
    </span>
  );
}

// ─── Price content (amount or tier chips) ────────────────────────────────────

function PriceContent({ price }) {
  if (price.tiers) {
    return (
      <div className="flex flex-col gap-[5px]">
        <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#475569] text-[12px] leading-[14px]">
          {price.model}
        </span>
        <div className="flex flex-wrap gap-[4px]">
          {price.tiers.map((tier, i) => (
            <span
              key={i}
              className="font-['Figtree:Medium',sans-serif] font-medium text-[#475569] text-[11px] bg-[#f1f5f9] px-[6px] py-[2px] rounded-[4px] whitespace-nowrap leading-[14px]"
            >
              {tierLabel(tier, i === price.tiers.length - 1)}
              <span className="text-[#94a3b8] mx-[3px]">→</span>
              {tier.price}
              {price.unit && <span className="text-[#94a3b8] ml-[1px]">{price.unit}</span>}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[1px]">
      <div className="flex items-baseline gap-[3px]">
        <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[13px] leading-[16px]">
          {price.amount}
        </span>
        {price.unit && (
          <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#94a3b8] text-[11px] leading-[14px]">
            {price.unit}
          </span>
        )}
      </div>
      <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#94a3b8] text-[11px] leading-[13px]">
        {price.model}
      </span>
    </div>
  );
}

// ─── Price row (full, used when expanded) ─────────────────────────────────────

function PriceRow({ price, checked, onCheck }) {
  return (
    <div className="flex items-start gap-[10px] py-[6px] cursor-pointer hover:bg-[#f8fafc] rounded-[4px]">
      <div className="mt-[1px] shrink-0">
        <CheckCircle checked={checked} onClick={onCheck} />
      </div>
      <PriceContent price={price} />
    </div>
  );
}

// ─── Collapsed selected price ─────────────────────────────────────────────────

function CollapsedPrice({ price, onDeselect }) {
  return (
    <div className="flex items-center gap-[10px] py-[6px]">
      <CheckCircle checked={true} onClick={onDeselect} />
      <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#475569] text-[12px] leading-[16px]">
        {priceSummary(price)}
      </span>
    </div>
  );
}

// ─── Product item ─────────────────────────────────────────────────────────────

function ProductItem({ product, selectedPriceId, isExpanded, onToggle, onSelectPrice }) {
  const selectedPrice = selectedPriceId ? product.prices.find(p => p.id === selectedPriceId) : null;

  return (
    <div className="flex flex-col">

      {/* Header */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between py-[8px] cursor-pointer"
      >
        <div className="flex items-center gap-[8px] min-w-0 mr-[8px]">
          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1e293b] text-[14px] leading-[18px] truncate">
            {product.name}
          </span>
          <TypeTag type={product.type} />
        </div>
        <svg
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          className={`shrink-0 text-[#94a3b8] transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Prices */}
      {(isExpanded || selectedPrice) && (
        <div>
          {isExpanded
            ? product.prices.map(price => (
                <PriceRow
                  key={price.id}
                  price={price}
                  checked={selectedPriceId === price.id}
                  onCheck={() => onSelectPrice(product.id, price.id)}
                />
              ))
            : <CollapsedPrice
                price={selectedPrice}
                onDeselect={() => onSelectPrice(product.id, selectedPriceId)}
              />
          }
        </div>
      )}

    </div>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────

function Separator() {
  return <div className="h-px bg-[#e2e8f0] shrink-0" />;
}

function FullSeparator() {
  return <div className="h-px bg-[#e2e8f0] shrink-0 -mx-[24px]" />;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function AddProductModal({ isOpen, onClose, onAdd, existingProductIds = [] }) {
  const [search,     setSearch]     = useState('');
  const [selections, setSelections] = useState({});
  const [expanded,   setExpanded]   = useState(() => new Set(PRODUCT_CATALOG.map(p => p.id)));

  const allAvailable = PRODUCT_CATALOG.filter(p => !existingProductIds.includes(p.id));

  const selectedProducts   = allAvailable.filter(p =>  selections[p.id]);
  const unselectedProducts = allAvailable.filter(p =>
    !selections[p.id] &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleExpand(productId) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  }

  function selectPrice(productId, priceId) {
    setSelections(prev => {
      if (prev[productId] === priceId) {
        setExpanded(e => new Set([...e, productId]));
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      setExpanded(e => { const n = new Set(e); n.delete(productId); return n; });
      return { ...prev, [productId]: priceId };
    });
  }

  function handleAdd() {
    const now      = new Date();
    const mo       = now.toLocaleString('en-US', { month: 'short' });
    const startStr = `${mo} 01, ${now.getFullYear()}`;
    const endStr   = `${mo} 01, ${now.getFullYear() + 1}`;

    const newProducts = Object.entries(selections).map(([productId, priceId]) => {
      const product = PRODUCT_CATALOG.find(p => p.id === productId);
      const price   = product.prices.find(p => p.id === priceId);
      return {
        id:          `added-${productId}-${Date.now()}-${Math.random()}`,
        catalogId:   productId,
        name:        product.name,
        type:        product.type,
        metric:      product.metric,
        period:      `${startStr} → ${endStr}`,
        billingDate: startStr,
        phases: [
          {
            status:           'ONGOING',
            range:            'Product Start →',
            perUnitPrice:     price.tiers ? `Volume (${price.tiers.length} tiers)` : price.amount,
            quantityIncluded: '—',
            billingCadence:   price.model === 'Flat Fee' ? 'Prepaid - Every Month' : 'Postpaid - Every Month',
          },
        ],
      };
    });

    onAdd(newProducts);
    handleClose();
  }

  function handleClose() {
    setSelections({});
    setSearch('');
    setExpanded(new Set(PRODUCT_CATALOG.map(p => p.id)));
    onClose();
  }

  const selectedCount = selectedProducts.length;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={handleClose} />

      <div className="fixed right-0 top-0 h-full w-[560px] z-50 flex flex-col shadow-[-4px_0_32px_rgba(0,0,0,0.16)] bg-white rounded-tl-[12px] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[18px] border-b border-[#e2e8f0] shrink-0">
          <div className="flex flex-col gap-[2px]">
            <p className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[16px] leading-[24px]">
              Add Products
            </p>
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[18px]">
              Select a product and choose its pricing
            </p>
          </div>
          <button onClick={handleClose} className="flex items-center justify-center cursor-pointer bg-transparent border-0 p-0">
            <div className="h-[25px] w-[25px] relative">
              <img alt="Close" className="absolute block max-w-none size-full" src={imgClose} />
            </div>
          </button>
        </div>

        {/* Controls: create button + OR + search */}
        <div className="px-[24px] pt-[24px] pb-[20px] shrink-0 flex flex-col gap-[20px]">

          {/* Create new product */}
          <button className="w-full flex items-center justify-center gap-[6px] h-[44px] bg-white border border-[#cbd5e1] rounded-[6px] cursor-pointer hover:bg-[#f8fafc]">
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none" className="text-[#334155] shrink-0">
              <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[12px] tracking-[0.2px] uppercase">
              Create new product
            </span>
          </button>

          {/* OR divider */}
          <div className="flex items-center gap-[13px]">
            <div className="flex-1 h-px bg-[#e2e8f0]" />
            <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px]">OR</span>
            <div className="flex-1 h-px bg-[#e2e8f0]" />
          </div>

          {/* Search */}
          <div className="bg-[#f8fafc] flex h-[44px] items-center gap-[10px] px-[12px] rounded-[6px] border border-[#e2e8f0]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#94a3b8]">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent border-0 outline-none font-['Figtree:Regular',sans-serif] font-normal text-[#1e293b] text-[13px] placeholder:text-[#94a3b8]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[#94a3b8] bg-transparent border-0 cursor-pointer text-[16px] leading-none p-0">×</button>
            )}
          </div>

        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-[24px] pb-[24px] flex flex-col gap-[16px]">

            {/* Selected section */}
            {selectedProducts.length > 0 && (
              <>
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#64748b] text-[12px] uppercase leading-[16.5px]">
                  Added ({selectedCount})
                </span>
                {selectedProducts.map((product, i) => (
                  <div key={product.id} className="flex flex-col gap-[16px]">
                    {i > 0 && <Separator />}
                    <ProductItem
                      product={product}
                      selectedPriceId={selections[product.id]}
                      isExpanded={expanded.has(product.id)}
                      onToggle={() => toggleExpand(product.id)}
                      onSelectPrice={selectPrice}
                    />
                  </div>
                ))}
                <FullSeparator />
              </>
            )}

            {/* Available products label */}
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#64748b] text-[12px] uppercase leading-[16.5px]">
              Available Products
            </span>

            {/* Empty state */}
            {unselectedProducts.length === 0 && (
              <div className="flex items-center justify-center py-[40px]">
                <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#94a3b8] text-[13px]">
                  {search ? 'No products match your search' : 'All products have been added'}
                </p>
              </div>
            )}

            {/* Unselected products */}
            {unselectedProducts.map((product, i) => (
              <div key={product.id} className="flex flex-col gap-[16px]">
                {i > 0 && <Separator />}
                <ProductItem
                  product={product}
                  selectedPriceId={selections[product.id]}
                  isExpanded={expanded.has(product.id)}
                  onToggle={() => toggleExpand(product.id)}
                  onSelectPrice={selectPrice}
                />
              </div>
            ))}

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-[24px] py-[14px] border-t border-[#e2e8f0] shrink-0 bg-white">
          <div className="flex items-center gap-[6px]">
            {selectedCount > 0 && (
              <div className="w-[20px] h-[20px] rounded-full bg-[#ed765e] flex items-center justify-center shrink-0">
                <span className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[11px] leading-none">{selectedCount}</span>
              </div>
            )}
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#64748b] text-[13px]">
              {selectedCount > 0
                ? `${selectedCount} product${selectedCount !== 1 ? 's' : ''} added`
                : 'No products added yet'}
            </span>
          </div>
          <div className="flex gap-[8px]">
            <button
              onClick={handleClose}
              className="flex h-[32px] items-center justify-center px-[16px] rounded-[4px] cursor-pointer bg-transparent border-0 font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[12px] tracking-[0.2px] uppercase"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={selectedCount === 0}
              className={`flex h-[32px] items-center justify-center px-[16px] rounded-[4px] border-0 font-['Figtree:Bold',sans-serif] font-bold text-[12px] tracking-[0.2px] uppercase whitespace-nowrap ${
                selectedCount > 0
                  ? 'bg-[#ed765e] text-white cursor-pointer'
                  : 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed'
              }`}
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
