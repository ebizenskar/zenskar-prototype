import { useState, useEffect, useRef } from 'react';

// Icons as inline SVG components
function ArrowLeft() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M6 9L2 5L6 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M4 1L8 5L4 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UpArrow() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <path d="M1 5L4 2L7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Phase Column ─────────────────────────────────────────────────────────────

function PhaseColumn({ phase }) {
  return (
    <div className="bg-[#f8fafc] rounded-[12px] flex-1 min-w-0 flex flex-col gap-[24px] pl-[16px] pr-[16px] py-[16px]">

      {/* Status badge + date range */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center gap-[8px] flex-wrap">
          {phase.status === 'ONGOING' ? (
            <div className="bg-[#e0f5fe] flex items-center px-[8px] rounded-[16px] h-[22px] shrink-0">
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#0370a1] text-[10px] leading-[10px] whitespace-nowrap">
                ONGOING
              </span>
            </div>
          ) : (
            <div className="bg-[#e2e8f0] border border-[#cbd5e1] border-dashed flex items-center px-[8px] rounded-[16px] h-[22px] shrink-0">
              <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#64748b] text-[10px] leading-[10px] whitespace-nowrap">
                UPCOMING
              </span>
            </div>
          )}
          <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[16px] truncate">
            {phase.range}
          </span>
        </div>

        {/* Metric cells */}
        <div className="flex gap-[24px] flex-wrap">
          {phase.perUnitPrice && (
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center gap-[4px]">
                <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[12px] whitespace-nowrap">
                  Per Unit Price
                </span>
                <span className="text-[#7c8ba1] text-[11px] leading-none">↻</span>
              </div>
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#1e293b] text-[13px] leading-[16px]">
                {phase.perUnitPrice}
              </span>
            </div>
          )}
          {phase.quantityIncluded && (
            <div className="flex flex-col gap-[6px]">
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[12px] whitespace-nowrap">
                Quantity Included
              </span>
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#1e293b] text-[13px] leading-[16px]">
                {phase.quantityIncluded}
              </span>
            </div>
          )}
          {phase.billingCadence && (
            <div className="flex flex-col gap-[6px]">
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[12px] whitespace-nowrap">
                Billing Cadence
              </span>
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#1e293b] text-[13px] leading-[16px]">
                {phase.billingCadence}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Details toggle */}
      <button className="flex items-center gap-[8px] text-[#64748b] text-[12px] font-['Figtree:Regular',sans-serif] font-normal bg-transparent border-0 cursor-pointer p-0 self-start leading-none">
        <UpArrow />
        <span>Details</span>
      </button>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

export default function ProductCard({ product, onRemove }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="border border-[#e2e8f0] rounded-[16px] bg-white overflow-hidden">

      {/* Card header */}
      <div className="flex items-start justify-between pl-[24px] pr-[14px] pt-[24px] pb-[10px]">
        <div className="flex flex-col gap-[10px]">
          {/* Name + type + metric badges */}
          <div className="flex items-center gap-[4px] flex-wrap">
            <span className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#1e293b] text-[14px] leading-[14px]">
              {product.name}
            </span>
            <div className="bg-[#eef] h-[22px] flex items-center px-[6px] rounded-[6px] shrink-0">
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#334155] text-[12px] leading-[18px] whitespace-nowrap">
                {product.type}
              </span>
            </div>
            <div className="bg-[#eef] h-[22px] flex items-center px-[6px] rounded-[6px] shrink-0">
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#334155] text-[12px] leading-[18px] whitespace-nowrap">
                {product.metric}
              </span>
            </div>
          </div>
          {/* Date range */}
          <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px]">
            {product.period}{'   |   '}{product.billingDate}
          </span>
        </div>

        {/* 3-dot menu */}
        <div ref={menuRef} className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex flex-col gap-[2px] items-center justify-center h-[24px] w-[22px] cursor-pointer bg-transparent border-0 p-0 pt-[1px] hover:opacity-70 transition-opacity"
          >
            {[0, 1, 2].map(i => (
              <div key={i} className="bg-[#94a3b8] rounded-full" style={{ width: '2.664px', height: '2.664px' }} />
            ))}
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 top-[28px] bg-white border border-[#e2e8f0] rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.10)] py-[4px] min-w-[128px] z-10">
              <button
                onClick={() => { setMenuOpen(false); onRemove?.(); }}
                className="flex items-center gap-[8px] w-full px-[12px] py-[8px] bg-transparent border-0 cursor-pointer text-left hover:bg-[#fff5f5] transition-colors"
              >
                <svg width="12" height="13" viewBox="0 0 12 13" fill="none">
                  <path d="M1 3.5h10M4.5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M2 3.5l.667 7a1 1 0 0 0 1 .9h4.666a1 1 0 0 0 1-.9L10 3.5" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#ef4444] text-[12px] leading-none whitespace-nowrap">
                  Remove product
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Phase navigation row */}
      <div className="flex items-center justify-between px-[24px] mb-[12px] h-[24px]">
        {/* Phase dots */}
        <div className="flex items-center gap-[6px]">
          {product.phases.map((_, i) => (
            <div key={i}>
              {i === 0 ? (
                <div className="bg-[#383bca] h-[6px] w-[16px] rounded-[3px]" />
              ) : (
                <div className="bg-[#cbd5e1] size-[6px] rounded-[3px]" />
              )}
            </div>
          ))}
        </div>
        {/* Nav arrows */}
        <div className="flex items-center gap-[4px]">
          <button className="bg-white border border-[#e2e8f0] flex items-center justify-center rounded-full size-[24px] p-[1px] cursor-pointer opacity-30 text-[#94a3b8]" disabled>
            <ArrowLeft />
          </button>
          <button className="bg-white border border-[#e2e8f0] flex items-center justify-center rounded-full size-[24px] p-[1px] cursor-pointer text-[#94a3b8]">
            <ArrowRight />
          </button>
        </div>
      </div>

      {/* Phase columns */}
      <div className="flex gap-[12px] px-[24px] pb-[16px] overflow-x-auto">
        {product.phases.map((phase, i) => (
          <PhaseColumn key={i} phase={phase} />
        ))}
      </div>

    </div>
  );
}
