import { useState } from 'react';

// ─── Product catalog ──────────────────────────────────────────────────────────

export const PRODUCT_CATALOG = [
  {
    id: 'user-seats',
    name: 'User Seats',
    type: 'Period of time',
    prices: [
      {
        id: 'us-p1',
        model: 'Per Unit Price',
        amount: '$20.00',
        unit: '/seat/month',
        billingType: 'Prepaid',
        billingFrequency: 'Monthly',
        isMetered: false,
      },
      {
        id: 'us-p2',
        model: 'Per Unit Price',
        amount: '$200.00',
        unit: '/seat/year',
        billingType: 'Prepaid',
        billingFrequency: 'Annually',
        isMetered: false,
        discount: 17,
        description: 'Annual billing with 2 months free',
      },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    type: 'Period of time',
    prices: [
      {
        id: 'st-p1',
        model: 'Per Unit Price',
        amount: '$0.10',
        unit: '/GB/month',
        billingType: 'Postpaid',
        billingFrequency: 'Monthly',
        isMetered: true,
        description: 'Metered storage usage billed monthly',
      },
    ],
  },
  {
    id: 'premium-support',
    name: 'Premium Support',
    type: 'Period of time',
    prices: [
      {
        id: 'ps-p1',
        model: 'Flat Fee',
        amount: '$500.00',
        unit: '/month',
        billingType: 'Prepaid',
        billingFrequency: 'Monthly',
        isMetered: false,
        discount: 10,
      },
      {
        id: 'ps-p2',
        model: 'Flat Fee',
        amount: '$5,000.00',
        unit: '/year',
        billingType: 'Prepaid',
        billingFrequency: 'Annually',
        isMetered: false,
        description: 'Includes 24/7 phone support and dedicated account manager',
      },
    ],
  },
  {
    id: 'white-labeling',
    name: 'White-labeling',
    type: 'Period of time',
    prices: [
      {
        id: 'wl-p1',
        model: 'Flat Fee',
        amount: '$1,200.00',
        unit: '/month',
        billingType: 'Prepaid',
        billingFrequency: 'Monthly',
        isMetered: false,
        description: 'Remove all platform branding',
      },
    ],
  },
  {
    id: 'report-credits',
    name: 'Report Generation Credits',
    type: 'Point in time',
    prices: [
      {
        id: 'rc-p1',
        model: 'Per Unit Price',
        amount: '$50.00',
        unit: '/50 credits',
        billingType: null,
        billingFrequency: 'One-time',
        isMetered: false,
        description: 'Credits never expire',
      },
    ],
  },
  {
    id: 'platform-credits',
    name: 'Platform Credits',
    type: 'Point in time',
    prices: [
      {
        id: 'pc-p1',
        model: 'Package Price',
        amount: '$100.00',
        unit: '/100 credits',
        billingType: null,
        billingFrequency: 'One-time',
        isMetered: false,
      },
    ],
  },
  {
    id: 'data-exports',
    name: 'Data Exports',
    type: 'Point in time',
    prices: [
      {
        id: 'de-p1',
        model: 'Package Price',
        amount: '$0.05',
        unit: '/export',
        billingType: null,
        billingFrequency: 'One-time',
        isMetered: false,
      },
    ],
  },
  {
    id: 'api-calls',
    name: 'API Calls',
    type: 'Point in time',
    prices: [
      {
        id: 'ac-p1',
        model: 'Per Unit Price',
        amount: '$1.00',
        unit: '/100 calls',
        billingType: null,
        billingFrequency: 'One-time',
        isMetered: false,
      },
      {
        id: 'ac-p2',
        model: 'Volume Price',
        unit: '/call',
        billingType: 'Postpaid',
        billingFrequency: 'Monthly',
        isMetered: true,
        discount: 12,
        description: 'Usage-based pricing with volume discounts',
        tiers: [
          { from: 0,    to: 1000, price: '$0.010' },
          { from: 1000, to: 5000, price: '$0.008' },
          { from: 5000, to: null, price: '$0.005' },
        ],
      },
    ],
  },
  {
    id: 'email-notifications',
    name: 'Email Notifications',
    type: 'Point in time',
    prices: [
      {
        id: 'en-p1',
        model: 'Per Unit Price',
        amount: '$0.002',
        unit: '/email',
        billingType: null,
        billingFrequency: 'One-time',
        isMetered: false,
      },
      {
        id: 'en-p2',
        model: 'Volume Price',
        unit: '/email',
        billingType: 'Postpaid',
        billingFrequency: 'Monthly',
        isMetered: true,
        tiers: [
          { from: 0,     to: 10000, price: '$0.0020' },
          { from: 10000, to: 50000, price: '$0.0015' },
          { from: 50000, to: null,  price: '$0.0010' },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n) {
  if (n == null) return '';
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000)     return `${n / 1_000}K`;
  return String(n);
}

function tierPriceRange(tiers, unit) {
  const vals = tiers.map(t => parseFloat(t.price.replace('$', '')));
  const minP = Math.min(...vals);
  const maxP = Math.max(...vals);
  const fmt = n => {
    if (n < 0.01)  return `$${n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}`;
    if (n < 1)     return `$${n.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}`;
    return `$${n.toFixed(2).replace(/\.?0+$/, '')}`;
  };
  return `${tiers.length} tiers: ${fmt(minP)} → ${fmt(maxP)}${unit ? ' ' + unit : ''}`;
}

function priceSummary(price) {
  if (price.tiers) return tierPriceRange(price.tiers, price.unit);
  return `${price.amount}${price.unit ? ' ' + price.unit : ''}`;
}

function cadenceLabel(price) {
  if (price.billingFrequency === 'One-time' || !price.billingFrequency) return 'One-time';
  if (price.billingType) return `${price.billingType} ${price.billingFrequency}`;
  return price.billingFrequency;
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
    <span className={`${bg} text-[#334155] text-[12px] font-['Figtree:Regular',sans-serif] font-normal px-[6px] h-[22px] inline-flex items-center rounded-[6px] whitespace-nowrap shrink-0`}>
      {type}
    </span>
  );
}

// ─── Neutral badge ────────────────────────────────────────────────────────────

function NeutralBadge({ children }) {
  return (
    <span className="bg-[#f1f5f9] border border-[#e2e8f0] text-[#334155] text-[11px] font-['Figtree:Regular',sans-serif] font-normal px-[6px] h-[20px] inline-flex items-center rounded-[4px] whitespace-nowrap shrink-0">
      {children}
    </span>
  );
}

function DiscountBadge({ pct }) {
  return (
    <span className="bg-[#f1f5f9] border border-[#e2e8f0] text-[#334155] text-[11px] font-['Figtree:Regular',sans-serif] font-normal px-[6px] h-[20px] inline-flex items-center rounded-[4px] whitespace-nowrap shrink-0">
      Discount: {pct}%
    </span>
  );
}

// ─── Price card ───────────────────────────────────────────────────────────────

function PriceCard({ price, checked, onCheck }) {
  const hasBadges = price.isMetered || price.discount;

  return (
    <div
      onClick={onCheck}
      className={`rounded-[8px] p-[12px] cursor-pointer transition-colors ${
        checked ? 'bg-[#f1f5f9]' : 'hover:bg-[#f1f5f9]'
      }`}
    >
      {/* Main row: check + price/unit + badges */}
      <div className="flex items-center justify-between gap-[8px]">

        {/* Left: check circle + price */}
        <div className="flex items-center gap-[8px] flex-1 min-w-0">
          <div className="shrink-0">
            <CheckCircle checked={checked} onClick={(e) => { e.stopPropagation(); onCheck(); }} />
          </div>
          <div className="flex items-baseline gap-[3px] flex-wrap min-w-0">
            {price.tiers ? (
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1e293b] text-[13px] leading-[normal]">
                {tierPriceRange(price.tiers, price.unit)}
              </span>
            ) : price.amount ? (
              <>
                <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1e293b] text-[13px] leading-[normal]">
                  {price.amount}
                </span>
                {price.unit && (
                  <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[13px] leading-[16px]">
                    {price.unit}
                  </span>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Right: badges — metered (conditional, left) + pricing model (always, right) */}
        {hasBadges && (
          <div className="flex items-center gap-[6px] shrink-0 flex-wrap justify-end">
            {price.discount && <DiscountBadge pct={price.discount} />}
            {price.isMetered && <NeutralBadge>Metered</NeutralBadge>}
          </div>
        )}
      </div>

      {/* Description */}
      {price.description && (
        <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[16px] pl-[26px] mt-[4px]">
          {price.description}
        </p>
      )}

      {/* Tier rows for volume pricing */}
      {price.tiers && price.tiers.length > 0 && (
        <div className="pl-[26px] mt-[4px] flex flex-col gap-[4px]">
          {price.tiers.map((tier, i) => {
            const isLast  = i === price.tiers.length - 1;
            const fromStr = fmtNum(tier.from);
            const toStr   = isLast ? `${fromStr}+` : `${fromStr} – ${fmtNum(tier.to)}`;
            return (
              <div key={i} className="flex items-baseline gap-[6px]">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[11px] leading-[16px] w-[60px] shrink-0">
                  {toStr}
                </span>
                <span className="text-[#b0bac6] text-[11px]">→</span>
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#475569] text-[11px] leading-[16px]">
                  {tier.price}{price.unit ? <span className="font-normal text-[#7c8ba1]">{price.unit}</span> : null}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Product item ─────────────────────────────────────────────────────────────

function ProductItem({ product, selectedPriceId, onSelectPrice }) {
  return (
    <div className="flex flex-col gap-[8px]">

      {/* Header: name + type tag */}
      <div className="flex items-center gap-[8px] flex-wrap">
        <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1e293b] text-[14px] leading-[normal]">
          {product.name}
        </span>
        <TypeTag type={product.type} />
      </div>

      {/* Price cards — always visible, no gap between them */}
      <div className="flex flex-col">
        {product.prices.map(price => (
          <PriceCard
            key={price.id}
            price={price}
            checked={selectedPriceId === price.id}
            onCheck={() => onSelectPrice(product.id, price.id)}
          />
        ))}
      </div>

    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function AddProductModal({ isOpen, onClose, onAdd, onRemove, existingProductIds = [] }) {
  const [search, setSearch] = useState('');
  const [selections, setSelections] = useState({});
  const [addedExpanded, setAddedExpanded] = useState(false);

  // Include a product if it wasn't already in the contract before this session opened,
  // OR if the user just selected it (so it stays visible in the "Added" section).
  const allAvailable = PRODUCT_CATALOG.filter(p =>
    !existingProductIds.includes(p.id) || selections[p.id]
  );

  const addedProducts = allAvailable.filter(p => selections[p.id]);
  const unaddedProducts = allAvailable
    .filter(p => !selections[p.id])
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  function buildProduct(productId, priceId) {
    const now = new Date();
    const mo = now.toLocaleString('en-US', { month: 'short' });
    const startStr = `${mo} 01, ${now.getFullYear()}`;
    const endStr = `${mo} 01, ${now.getFullYear() + 1}`;
    const product = PRODUCT_CATALOG.find(p => p.id === productId);
    const price = product.prices.find(p => p.id === priceId);
    const cadenceText = price.billingFrequency === 'One-time'
      ? 'One-time payment'
      : `${price.billingType ? price.billingType + ' - ' : ''}Every ${price.billingFrequency}`;
    return {
      id: `added-${productId}-${Date.now()}-${Math.random()}`,
      catalogId: productId,
      name: product.name,
      type: product.type,
      metric: product.type,
      period: `${startStr} → ${endStr}`,
      billingDate: startStr,
      priceInfo: {
        billingType: price.billingType,
        billingFrequency: price.billingFrequency,
        isMetered: price.isMetered,
      },
      phases: [{
        status: 'ONGOING',
        range: 'Product Start →',
        perUnitPrice: price.tiers ? tierPriceRange(price.tiers, price.unit) : price.amount,
        quantityIncluded: '—',
        billingCadence: `${price.isMetered ? 'Metered - ' : ''}${cadenceText}`,
      }],
    };
  }

  function selectPrice(productId, priceId) {
    const isDeselect = selections[productId] === priceId;
    setSelections(prev => {
      if (isDeselect) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      // Switching price on same product: first remove old, then add new
      return { ...prev, [productId]: priceId };
    });

    if (isDeselect) {
      onRemove?.(productId);
    } else {
      // If switching from one price to another on the same product, remove old first
      if (selections[productId]) onRemove?.(productId);
      onAdd([buildProduct(productId, priceId)]);
    }
  }

  function handleDone() {
    handleClose();
  }

  function handleClose() {
    setSelections({});
    setSearch('');
    setAddedExpanded(false);
    onClose();
  }

  const selectedCount = addedProducts.length;

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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#94a3b8] hover:text-[#64748b]">
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-[24px] pt-[24px] shrink-0">
          <div className="bg-[#f8fafc] flex h-[44px] items-center gap-[10px] px-[12.8px] rounded-[6px] border border-[#e2e8f0]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#b0bac6]">
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
              <button onClick={() => setSearch('')} className="text-[#b0bac6] hover:text-[#64748b] bg-transparent border-0 cursor-pointer text-[16px] leading-none p-0">×</button>
            )}
          </div>
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-[24px] py-[24px] flex flex-col gap-[16px]">

            {/* ── ADDED section — collapsible, collapsed by default ── */}
            {selectedCount > 0 && (
              <>
                {/* Section header — clickable to collapse/expand */}
                <button
                  onClick={() => setAddedExpanded(v => !v)}
                  className="flex items-center justify-between w-full bg-transparent border-0 p-0 cursor-pointer"
                >
                  <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#64748b] text-[12px] uppercase tracking-[0.5px] leading-[16.5px]">
                    Added ({selectedCount})
                  </span>
                  <svg
                    width="10" height="6" viewBox="0 0 10 6" fill="none"
                    className={`text-[#94a3b8] transition-transform duration-150 ${addedExpanded ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Expanded product list */}
                {addedExpanded && (
                  <div className="flex flex-col gap-[16px]">
                    {addedProducts.map(product => (
                      <ProductItem
                        key={product.id}
                        product={product}
                        selectedPriceId={selections[product.id]}
                        onSelectPrice={selectPrice}
                      />
                    ))}
                  </div>
                )}

                {/* Full-width separator */}
                <div className="h-px bg-[#e2e8f0] -mx-[24px]" />
              </>
            )}

            {/* ── AVAILABLE PRODUCTS ── */}
            <div className="flex items-center justify-between">
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#64748b] text-[12px] uppercase tracking-[0.5px] leading-[16.5px]">
                Available Products
              </span>
              <button className="flex items-center gap-[4px] bg-transparent border-0 cursor-pointer p-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <path d="M8 3V13M3 8H13" stroke="#1145bc" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#1145bc] text-[12px] uppercase leading-[normal]">
                  Create Product
                </span>
              </button>
            </div>
            <div className="h-px bg-[#f1f5f9]" />

            {unaddedProducts.length === 0 && (
              <div className="flex items-center justify-center py-[32px]">
                <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#b0bac6] text-[13px]">
                  {search ? 'No products match your search' : 'All products have been added'}
                </p>
              </div>
            )}

            {unaddedProducts.map((product, i) => (
              <div key={product.id} className="flex flex-col gap-[16px]">
                {i > 0 && <div className="h-px bg-[#f1f5f9]" />}
                <ProductItem
                  product={product}
                  selectedPriceId={selections[product.id]}
                  onSelectPrice={selectPrice}
                />
              </div>
            ))}

          </div>
        </div>

        {/* Footer — Done only */}
        <div className="flex items-center justify-between px-[24px] py-[14px] border-t border-[#e2e8f0] shrink-0 bg-white">
          <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[13px] leading-[19.5px]">
            {selectedCount > 0
              ? `${selectedCount} product${selectedCount !== 1 ? 's' : ''} added to contract`
              : ''}
          </span>
          <button
            onClick={handleDone}
            className="flex h-[32px] items-center justify-center px-[20px] rounded-[4px] border-0 bg-[#ed765e] text-white cursor-pointer hover:bg-[#e56a52] font-['Figtree:Bold',sans-serif] font-bold text-[12px] tracking-[0.2px] uppercase whitespace-nowrap transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </>
  );
}

