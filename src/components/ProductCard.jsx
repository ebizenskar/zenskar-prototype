// Asset URLs from Figma MCP server
const imgArrowLeft  = "http://localhost:3845/assets/8fe903ba6db4971d7e2cfd3d32eda0b20517a2bc.svg";
const imgArrowRight = "http://localhost:3845/assets/fd07f00a1f332e2e1bbf66dbc84813033c7d6e6b.svg";
const imgUpArrow    = "http://localhost:3845/assets/8e7baa0024e3eb6951bd3302886b655e7cefaadb.svg";

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
        <img alt="" className="block h-[8px] w-[8px]" src={imgUpArrow} />
        <span>Details</span>
      </button>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

export default function ProductCard({ product }) {
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
        <div className="flex flex-col gap-[2px] items-center justify-center h-[24px] w-[22px] shrink-0 cursor-pointer pt-[1px]">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-[#94a3b8] rounded-full" style={{ width: '2.664px', height: '2.664px' }} />
          ))}
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
          <button className="bg-white border border-[#e2e8f0] flex items-center justify-center rounded-full size-[24px] p-[1px] cursor-pointer opacity-30" disabled>
            <img alt="prev" className="block size-[10px]" src={imgArrowLeft} />
          </button>
          <button className="bg-white border border-[#e2e8f0] flex items-center justify-center rounded-full size-[24px] p-[1px] cursor-pointer">
            <img alt="next" className="block size-[10px]" src={imgArrowRight} />
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
