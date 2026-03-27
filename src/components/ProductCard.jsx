import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

// ─── StatusTag ────────────────────────────────────────────────────────────────

function StatusTag({ status }) {
  const styles = {
    EXPIRED:  { bg: 'transparent', text: '#64748b', border: '#cbd5e1', dashed: true },
    ONGOING:  { bg: '#e0f5fe',     text: '#0370a1' },
    UPCOMING: { bg: '#e2e8f0',     text: '#64748b', border: '#e2e8f0', dashed: true },
  };
  const s = styles[status] || styles.ONGOING;
  return (
    <div
      className="relative flex items-center h-[22px] px-[8px] py-[6px] rounded-[16px] shrink-0"
      style={{ backgroundColor: s.bg }}
    >
      {s.dashed && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[16px] pointer-events-none"
          style={{ border: `1px dashed ${s.border}` }}
        />
      )}
      <span
        className="font-['Figtree',sans-serif] font-semibold text-[10px] leading-[10px] whitespace-nowrap"
        style={{ color: s.text }}
      >
        {status}
      </span>
    </div>
  );
}

// ─── ExchangeIcon ─────────────────────────────────────────────────────────────

function ExchangeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <g clipPath="url(#clip0_pricechange)">
        <path d="M10.8356 2.71313H3.39463C2.73681 2.71313 2.10593 2.97457 1.64078 3.43992C1.17563 3.90527 0.914307 4.53643 0.914307 5.19454V6.43523M10.8356 5.81488V7.05558C10.8356 7.71368 10.5743 8.34483 10.1091 8.81019C9.64399 9.27554 9.0131 9.53697 8.35529 9.53697H0.914307" stroke="#383BCA" strokeWidth="1.00075" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.97537 4.57414L10.8356 2.71309L8.97537 0.852051M2.77455 7.67588L0.914307 9.53693L2.77455 11.398" stroke="#383BCA" strokeWidth="1.00075" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_pricechange">
          <rect width="10.9219" height="11.5469" fill="white" transform="translate(0.414062 0.351562)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// ─── PriceChangedTooltip ──────────────────────────────────────────────────────

function PriceChangedTooltip({ children }) {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-[6px] px-[10px] py-[6px] text-[11px] font-['Figtree',sans-serif] font-medium text-white bg-[#1e293b] shadow-md z-50"
            sideOffset={5}
            side="top"
          >
            Price changed
            <Tooltip.Arrow className="fill-[#1e293b]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

// ─── InfoField ────────────────────────────────────────────────────────────────

function InfoField({ label, value, priceChanged }) {
  return (
    <div className="flex flex-col gap-[6px] items-start shrink-0 w-[130px]">
      <div className="flex gap-[4px] items-center py-[2px]">
        <span className="font-['Figtree',sans-serif] font-normal text-[12px] leading-[12px] text-[#7c8ba1] whitespace-nowrap">
          {label}
        </span>
        {priceChanged && (
          <PriceChangedTooltip>
            <button className="inline-flex items-center cursor-pointer bg-transparent border-none p-0">
              <ExchangeIcon />
            </button>
          </PriceChangedTooltip>
        )}
      </div>
      <span className="font-['Figtree',sans-serif] font-medium text-[13px] leading-[16px] text-[#1e293b] whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
        {value}
      </span>
    </div>
  );
}

// ─── TriangleIcon ─────────────────────────────────────────────────────────────
// rotated=false → rotate-90 (points right = collapsed)
// rotated=true  → rotate-180 (points down = expanded)

function TriangleIcon({ rotated }) {
  return (
    <div className={`flex items-center justify-center w-[8px] h-[9px] shrink-0 transition-transform duration-200 ease-in-out ${rotated ? 'rotate-180' : 'rotate-90'}`}>
      <div className="h-[8px] w-[9px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 8">
          {/* Upward-pointing triangle: rotate-90 → right, rotate-180 → down */}
          <path d="M 4.5 0.5 L 8.5 7.5 L 0.5 7.5 Z" fill="#94A3B8" />
        </svg>
      </div>
    </div>
  );
}

// ─── DetailRow ────────────────────────────────────────────────────────────────

function DetailRow({ label, value }) {
  return (
    <div className="flex gap-[6px] items-start w-full min-h-[16px]">
      <div className="w-[148px] shrink-0 flex items-center min-h-[16px]">
        <span className="font-['Figtree',sans-serif] font-normal text-[12px] leading-[12px] text-[#7c8ba1]">
          {label}
        </span>
      </div>
      <div className="flex-1 min-w-0 min-h-[16px] flex items-start">
        <span className="font-['Figtree',sans-serif] font-medium text-[13px] leading-[16px] text-[#1e293b]">
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── AnimatedCollapse ─────────────────────────────────────────────────────────

function AnimatedCollapse({ isOpen, children }) {
  const contentRef = useRef(null);
  const wrapperRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const prevOpenRef = useRef(isOpen);
  const rafRef = useRef(0);

  useEffect(() => {
    if (isOpen && !shouldRender) setShouldRender(true);
  }, [isOpen, shouldRender]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (isOpen && shouldRender) {
      const measured = Math.ceil(content.getBoundingClientRect().height);
      wrapper.style.transition = 'none';
      wrapper.style.height = '0px';
      wrapper.style.opacity = '0';
      wrapper.style.overflow = 'clip';
      wrapper.offsetHeight; // force reflow
      rafRef.current = requestAnimationFrame(() => {
        wrapper.style.transition = 'height 250ms cubic-bezier(0.4,0,0.2,1), opacity 250ms cubic-bezier(0.4,0,0.2,1)';
        wrapper.style.height = `${measured}px`;
        wrapper.style.opacity = '1';
      });
    } else if (!isOpen && prevOpenRef.current) {
      const measured = Math.ceil(content.getBoundingClientRect().height);
      wrapper.style.transition = 'none';
      wrapper.style.height = `${measured}px`;
      wrapper.style.opacity = '1';
      wrapper.style.overflow = 'clip';
      wrapper.offsetHeight; // force reflow
      rafRef.current = requestAnimationFrame(() => {
        wrapper.style.transition = 'height 250ms cubic-bezier(0.4,0,0.2,1), opacity 250ms cubic-bezier(0.4,0,0.2,1)';
        wrapper.style.height = '0px';
        wrapper.style.opacity = '0';
      });
    }

    prevOpenRef.current = isOpen;
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isOpen, shouldRender]);

  const handleTransitionEnd = useCallback((e) => {
    if (e.propertyName !== 'height') return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (isOpen) {
      wrapper.style.height = 'auto';
      wrapper.style.overflow = 'clip';
    } else {
      setShouldRender(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender || !contentRef.current || !isOpen) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(() => {
      if (wrapper.style.height === 'auto' || wrapper.style.overflow === 'clip') {
        wrapper.style.height = 'auto';
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [shouldRender, isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      ref={wrapperRef}
      style={{ height: 0, opacity: 0, overflow: 'clip' }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

// ─── PriceCard ────────────────────────────────────────────────────────────────

function PriceCard({ entry }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const hasDetails = entry.discount || entry.minCommitment;

  return (
    <div className="bg-[#f8fafc] flex flex-col gap-[12px] items-start p-[14px] rounded-[12px] w-full">
      <div className="flex flex-col gap-[10px] items-start w-full pr-[8px]">
        <div className="flex gap-[8px] items-center">
          <StatusTag status={entry.status} />
          <span className="font-['Figtree',sans-serif] font-normal text-[12px] leading-[16px] text-[#7c8ba1] whitespace-nowrap">
            {entry.dateRange}
          </span>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center w-full">
            <div className="flex gap-[24px] items-center flex-1 min-w-0">
              <InfoField label="Per Unit Price" value={entry.perUnitPrice} priceChanged={entry.priceChanged} />
              <InfoField label="Quantity Included" value={entry.quantityIncluded} />
              <div className="flex flex-col gap-[6px] items-start shrink-0 w-[140px]">
                <div className="flex items-center py-[2px]">
                  <span className="font-['Figtree',sans-serif] font-normal text-[12px] leading-[12px] text-[#7c8ba1] whitespace-nowrap">
                    Billing Cadence
                  </span>
                </div>
                <span className="font-['Figtree',sans-serif] font-medium text-[13px] leading-[16px] text-[#1e293b] whitespace-nowrap">
                  {entry.billingCadence}
                </span>
              </div>
            </div>

            {hasDetails && (
              <Tooltip.Provider delayDuration={100}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => setDetailsOpen(!detailsOpen)}
                      className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-transparent border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition-colors shrink-0 ml-[12px]"
                      aria-label={detailsOpen ? 'Hide details' : 'Show details'}
                    >
                      <svg
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                        className="transition-transform duration-200 ease-in-out"
                        style={{ transform: detailsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-[6px] px-[10px] py-[6px] text-[11px] font-['Figtree',sans-serif] font-medium text-white bg-[#1e293b] shadow-md z-50"
                      sideOffset={5} side="top"
                    >
                      More details
                      <Tooltip.Arrow className="fill-[#1e293b]" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </div>

          <AnimatedCollapse isOpen={detailsOpen && !!hasDetails}>
            <div className="flex flex-col gap-[8px] items-start w-full mt-[16px]">
              {entry.discount && <DetailRow label="Discount" value={entry.discount} />}
              {entry.minCommitment && <DetailRow label="Min Commitment" value={entry.minCommitment} />}
            </div>
          </AnimatedCollapse>
        </div>
      </div>
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

const timelineRows = [
  { label: 'Price',           field: 'perUnitPrice',    colors: { bg: '#eef',     border: '#8184f8', bgFaded: '#eef',     borderFaded: '#a5a7fc' } },
  { label: 'Quantity',        field: 'quantityIncluded',colors: { bg: '#f2fbf5',  border: '#60ce85', bgFaded: '#f2fbf5',  borderFaded: '#92e3ad' } },
  { label: 'Billing Cadence', field: 'billingCadence',  colors: { bg: '#eef7ff',  border: '#52b1ff', bgFaded: '#eef7ff',  borderFaded: '#52b1ff' } },
  { label: 'Discount',        field: 'discount',        colors: { bg: '#fff8eb',  border: '#fcbb4d', bgFaded: '#fff8eb',  borderFaded: '#fcbb4d' } },
  { label: 'Min Commitment',  field: 'minCommitment',   colors: { bg: '#faf5ff',  border: '#dab4fe', bgFaded: '#faf5ff',  borderFaded: '#dab4fe' } },
];

function formatPriceForTimeline(field, value) {
  if (!value) return '—';
  if (field === 'perUnitPrice') return `${value}/unit`;
  return value;
}

function TimelineSegmentBar({ displayText, periodText, barStyle, barClassName, isActive }) {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const checkTruncation = useCallback(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [checkTruncation, displayText]);

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            className={barClassName}
            style={{ ...barStyle, opacity: isActive === false ? 0.35 : 1, transition: 'opacity 200ms ease, box-shadow 150ms ease' }}
          >
            <span
              ref={textRef}
              className="block w-full font-['Figtree',sans-serif] font-medium text-[12px] leading-[12px] text-[#1e293b] whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-150 group-hover:text-[#383BCA] group-hover:underline"
            >
              {displayText}
            </span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-[8px] px-[12px] py-[8px] font-['Figtree',sans-serif] text-[#1e293b] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] z-50"
            sideOffset={6} side="top"
          >
            <div className="flex flex-col gap-[2px]">
              {isTruncated && (
                <span className="font-medium text-[13px] leading-[18px] text-[#1e293b] pb-[6px]">{displayText}</span>
              )}
              <span className="font-normal text-[12px] leading-[16px] text-[#64748b]">Period</span>
              <span className="font-medium text-[13px] leading-[18px] text-[#1e293b]">{periodText}</span>
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function Timeline({ prices, overallStartDate, overallEndDate }) {
  const overallStart = new Date(overallStartDate).getTime();
  const overallEnd   = new Date(overallEndDate).getTime();
  const totalDuration = overallEnd - overallStart;

  const segments = prices.map((p) => {
    const start = p.startDate ? new Date(p.startDate).getTime() : overallStart;
    const end   = p.endDate   ? new Date(p.endDate).getTime()   : overallEnd;
    const leftPercent  = totalDuration > 0 ? ((start - overallStart) / totalDuration) * 100 : 0;
    const widthPercent = totalDuration > 0 ? ((end - start) / totalDuration) * 100 : 100 / prices.length;
    return { ...p, leftPercent, widthPercent };
  });

  // Only show timeline rows that have at least one non-empty value across all phases
  const activeTimelineRows = timelineRows.filter(row =>
    prices.some(p => p[row.field] && p[row.field] !== '—')
  );

  function getMergedSegments(field) {
    const merged = [];
    for (let i = 0; i < segments.length; i++) {
      const value = segments[i][field];
      const isOngoing = segments[i].status === 'ONGOING';
      const last = merged[merged.length - 1];
      if (last && last.value === value && value !== undefined) {
        last.widthPercent = (segments[i].leftPercent + segments[i].widthPercent) - last.leftPercent;
        last.endIdx = i;
        if (isOngoing) last.hasOngoing = true;
      } else {
        merged.push({ value, leftPercent: segments[i].leftPercent, widthPercent: segments[i].widthPercent, startIdx: i, endIdx: i, hasOngoing: isOngoing });
      }
    }
    return merged;
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const formatPeriod = (startIdx, endIdx) => {
    const startDate = segments[startIdx]?.startDate ? new Date(segments[startIdx].startDate) : new Date(overallStartDate);
    const endDate   = segments[endIdx]?.endDate     ? new Date(segments[endIdx].endDate)     : new Date(overallEndDate);
    const startStr  = startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const endStr    = endDate.toLocaleDateString('en-US',   { month: 'short', day: '2-digit', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-start w-full relative">
        {/* Labels column */}
        <div className="shrink-0 w-[140px] flex flex-col pr-[10px]">
          <div className="h-[36px]" />
          <div className="flex flex-col gap-[8px] py-[16px]">
            {activeTimelineRows.map((row) => (
              <div key={row.label} className="h-[24px] flex items-center justify-end">
                <span className="font-['Figtree',sans-serif] font-normal text-[12px] leading-[16px] text-[#64748b] text-right">
                  {row.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical separators */}
        <div className="absolute pointer-events-none bg-[#e2e8f0] z-[2]" style={{ left: '140px', top: '20px', bottom: '0', width: '1px' }} />
        <div className="absolute pointer-events-none bg-[#e2e8f0] z-[2]" style={{ right: '0', top: '20px', bottom: '0', width: '1px' }} />

        {/* Bars column */}
        <div className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
          {/* Date labels */}
          <div className="flex items-center justify-between px-[4px]">
            <span className="font-['Figtree',sans-serif] font-normal text-[12px] leading-[16px] text-[#64748b] whitespace-nowrap">{formatDate(overallStartDate)}</span>
            <span className="font-['Figtree',sans-serif] font-normal text-[12px] leading-[16px] text-[#64748b] whitespace-nowrap">{formatDate(overallEndDate)}</span>
          </div>

          {/* Marker line */}
          <div className="relative h-[9px] mt-[4px] mb-[8px]">
            <div className="absolute left-[4px] right-[4px] top-[4px] h-[1px] bg-[#cbd5e1]" />
            <svg className="absolute top-0 z-[3]" style={{ left: '-4px' }} width="9" height="9" viewBox="0 0 9 9" fill="none">
              <circle cx="4.5" cy="4.5" r="4" fill="#e2e8f0" stroke="#cbd5e1" />
            </svg>
            <svg className="absolute top-0 z-[3]" style={{ right: '-4px' }} width="9" height="9" viewBox="0 0 9 9" fill="none">
              <circle cx="4.5" cy="4.5" r="4" fill="#e2e8f0" stroke="#cbd5e1" />
            </svg>
            {(() => {
              const now = Date.now();
              if (now >= overallStart && now <= overallEnd && totalDuration > 0) {
                const todayPercent  = ((now - overallStart) / totalDuration) * 100;
                const todayFormatted = formatDate(new Date().toISOString());
                return (
                  <Tooltip.Provider delayDuration={0}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <svg className="absolute top-0 cursor-pointer z-10" style={{ left: `calc(${todayPercent}% - 4.5px)` }} width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <circle cx="4.5" cy="4.5" r="4" fill="#cbd5e1" stroke="#94a3b8" />
                        </svg>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="rounded-[6px] px-[10px] py-[6px] text-[11px] font-['Figtree',sans-serif] font-medium text-white bg-[#1e293b] shadow-md z-50"
                          sideOffset={5} side="top"
                        >
                          Today: {todayFormatted}
                          <Tooltip.Arrow className="fill-[#1e293b]" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                );
              }
              return null;
            })()}
          </div>

          {/* Today dashed line */}
          {(() => {
            const now = Date.now();
            if (now >= overallStart && now <= overallEnd && totalDuration > 0) {
              const todayPercent = ((now - overallStart) / totalDuration) * 100;
              return (
                <div className="absolute w-0 border-l border-dashed border-[#cbd5e1] z-0 pointer-events-none" style={{ left: `${todayPercent}%`, top: '29px', bottom: '0' }} />
              );
            }
            return null;
          })()}

          {/* Bars */}
          <div className="flex flex-col gap-[8px] py-[16px] relative">
            {activeTimelineRows.map((row) => {
              const merged = getMergedSegments(row.field);
              return (
                <div key={row.label} className="h-[24px] flex gap-[4px] relative z-[1]">
                  {merged.map((seg, segIdx) => {
                    const value = seg.value;
                    const isFirst   = seg.startIdx === 0;
                    const isLast    = seg.endIdx === segments.length - 1;
                    const spansAll  = isFirst && isLast;
                    const width     = spansAll ? '100%' : `${seg.widthPercent}%`;
                    const colors    = row.colors;
                    const hasMultiple = merged.length > 1;

                    let borderRadius = '0';
                    if (!spansAll) {
                      if (isFirst && isLast) borderRadius = '4px';
                      else if (isFirst)      borderRadius = '0 4px 4px 0';
                      else if (isLast)       borderRadius = '4px 0 0 4px';
                      else                   borderRadius = '4px';
                    }

                    let borderStyle;
                    if (spansAll) {
                      borderStyle = { borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` };
                    } else if (isFirst) {
                      borderStyle = { borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`, borderRight: `1px solid ${colors.border}` };
                    } else if (isLast) {
                      borderStyle = { borderTop: `1px solid ${colors.borderFaded}`, borderBottom: `1px solid ${colors.borderFaded}`, borderLeft: `1px solid ${colors.borderFaded}` };
                    } else {
                      borderStyle = { border: `1px solid ${colors.borderFaded}` };
                    }

                    return (
                      <TimelineSegmentBar
                        key={`${row.label}-${segIdx}`}
                        displayText={formatPriceForTimeline(row.field, value)}
                        periodText={formatPeriod(seg.startIdx, seg.endIdx)}
                        isActive={hasMultiple ? seg.hasOngoing : undefined}
                        barClassName="group h-[24px] flex items-center px-[16px] relative cursor-pointer transition-shadow duration-150 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.08)]"
                        barStyle={{ width, flexShrink: 0, flexGrow: spansAll ? 1 : 0, backgroundColor: colors.bg, borderRadius, ...borderStyle }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ProductCard (main) ───────────────────────────────────────────────────────

export default function ProductCard({
  productName,
  tags = [],
  contractStart,
  contractEnd,
  billingStartDate,
  prices = [],
  overallStartDate,
  overallEndDate,
  titleCardGap,
  onEdit,
  onRemove,
}) {
  const scrollRef = useRef(null);
  const [showLeftArrow,  setShowLeftArrow]  = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [timelinesOpen,  setTimelinesOpen]  = useState(false);

  const statusOrder = { EXPIRED: 0, ONGOING: 1, UPCOMING: 2 };
  const sortedPrices = useMemo(
    () => [...prices].sort((a, b) => (statusOrder[a.status] ?? 1) - (statusOrder[b.status] ?? 1)),
    [prices]
  );

  const ongoingIndex = useMemo(() => {
    const idx = sortedPrices.findIndex(p => p.status === 'ONGOING');
    return idx >= 0 ? idx : 0;
  }, [sortedPrices]);

  const updateArrows = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 4);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 4);
    const children = Array.from(scrollRef.current.children);
    if (!children.length) return;
    const containerCenter = scrollRef.current.getBoundingClientRect().left + clientWidth / 2;
    let closestIdx = 0, closestDist = Infinity;
    children.forEach((child, i) => {
      const rect = child.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - containerCenter);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
    });
    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) { updateArrows(); return; }
    const scrollToOngoing = () => {
      const targetCard = container.children[ongoingIndex];
      if (targetCard) {
        container.style.scrollSnapType = 'none';
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = targetCard.offsetLeft;
        requestAnimationFrame(() => {
          container.style.scrollSnapType = '';
          container.style.scrollBehavior = '';
          setActiveIndex(ongoingIndex);
          updateArrows();
        });
      } else {
        setActiveIndex(ongoingIndex);
        updateArrows();
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(scrollToOngoing));
  }, [ongoingIndex, updateArrows]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const nextIndex = direction === 'left'
      ? Math.max(0, activeIndex - 1)
      : Math.min(sortedPrices.length - 1, activeIndex + 1);
    const targetCard = scrollRef.current.children[nextIndex];
    if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const targetCard = scrollRef.current.children[index];
    if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  return (
    <div className="bg-white relative rounded-[16px] w-full group/card">
      <div className="flex items-start rounded-[inherit] w-full">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col items-start pb-[16px] px-[24px] w-full">
            <div className="flex flex-col items-start pt-[20px] w-full" style={{ gap: `${titleCardGap ?? 8}px` }}>

              {/* Title bar */}
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-[4px] items-center min-w-0 flex-wrap">
                  <span className="font-['Figtree',sans-serif] font-semibold text-[14px] leading-[14px] text-[#1e293b] whitespace-nowrap">
                    {productName}
                  </span>
                  {tags.map(tag => (
                    <div key={tag} className="bg-[#eef] flex items-center gap-[12px] overflow-clip px-[6px] py-[2px] rounded-[6px]">
                      <span className="font-['Figtree',sans-serif] font-normal text-[12px] leading-[18px] text-[#334155] whitespace-pre-wrap">
                        {tag}
                      </span>
                    </div>
                  ))}
                  {/* Date info inline */}
                  <div className="flex items-center ml-[4px]">
                    <span className="font-['Figtree',sans-serif] font-normal text-[12px] leading-[16px] text-[#7C8BA1] whitespace-nowrap">
                      <Tooltip.Provider delayDuration={100}>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <span className="cursor-default">
                              {contractStart}{contractEnd ? ` → ${contractEnd}` : ''}
                            </span>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="rounded-[6px] px-[10px] py-[6px] text-[11px] font-['Figtree',sans-serif] font-medium text-white bg-[#1e293b] shadow-md z-50"
                              sideOffset={5} side="top"
                            >
                              Product period
                              <Tooltip.Arrow className="fill-[#1e293b]" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                      <span className="mx-1">|</span>
                      <Tooltip.Provider delayDuration={100}>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <span className="cursor-default">{billingStartDate}</span>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="rounded-[6px] px-[10px] py-[6px] text-[11px] font-['Figtree',sans-serif] font-medium text-white bg-[#1e293b] shadow-md z-50"
                              sideOffset={5} side="top"
                            >
                              Billing Start Date
                              <Tooltip.Arrow className="fill-[#1e293b]" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </span>
                  </div>
                </div>

                {/* Edit + Delete buttons (show on card hover) */}
                <div className="flex items-center gap-[4px] shrink-0">
                  <Tooltip.Provider delayDuration={100}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={onEdit}
                          className="flex items-center justify-center w-[24px] h-[24px] rounded-[4px] cursor-pointer bg-transparent border-none p-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150 hover:bg-[#f1f5f9]"
                          aria-label="Edit product"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.08 1.92a1.5 1.5 0 0 1 2.12 0l.38.38a1.5 1.5 0 0 1 0 2.12L5.25 11.75l-3.5.88.88-3.5L10.08 1.92Z" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8.75 3.25L11.25 5.75" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="rounded-[6px] px-[10px] py-[6px] text-[11px] font-['Figtree',sans-serif] font-medium text-white bg-[#1e293b] shadow-md z-50"
                          sideOffset={5} side="top"
                        >
                          Edit
                          <Tooltip.Arrow className="fill-[#1e293b]" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>

                  <Tooltip.Provider delayDuration={100}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={onRemove}
                          className="flex items-center justify-center w-[24px] h-[24px] rounded-[4px] cursor-pointer bg-transparent border-none p-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150 hover:bg-[#fef2f2]"
                          aria-label="Delete product"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1.75 3.5h10.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.67 3.5V2.33a1.17 1.17 0 0 1 1.16-1.16h2.34a1.17 1.17 0 0 1 1.16 1.16V3.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.08 3.5v8.17a1.17 1.17 0 0 1-1.16 1.16H4.08a1.17 1.17 0 0 1-1.16-1.16V3.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5.83 6.42v3.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8.17 6.42v3.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="rounded-[6px] px-[10px] py-[6px] text-[11px] font-['Figtree',sans-serif] font-medium text-white bg-[#1e293b] shadow-md z-50"
                          sideOffset={5} side="top"
                        >
                          Delete
                          <Tooltip.Arrow className="fill-[#1e293b]" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </div>

              {/* Dot indicators + arrow navigation (only when multiple prices) */}
              {sortedPrices.length > 1 && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[6px] items-center">
                    {sortedPrices.map((price, i) => (
                      <button
                        key={price.id}
                        onClick={() => scrollToIndex(i)}
                        className="p-0 border-none cursor-pointer bg-transparent flex items-center justify-center"
                        aria-label={`Go to ${price.status} price`}
                      >
                        <div
                          className="rounded-full transition-all duration-200"
                          style={{
                            width:           i === activeIndex ? 16 : 6,
                            height:          6,
                            borderRadius:    i === activeIndex ? 3 : '50%',
                            backgroundColor: i === activeIndex ? '#383BCA' : '#cbd5e1',
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-[4px] items-center">
                    <button
                      onClick={() => scroll('left')}
                      disabled={!showLeftArrow}
                      className="w-[24px] h-[24px] rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center cursor-pointer hover:bg-[#f8fafc] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M7.5 9L4.5 6L7.5 3" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => scroll('right')}
                      disabled={!showRightArrow}
                      className="w-[24px] h-[24px] rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center cursor-pointer hover:bg-[#f8fafc] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M4.5 3L7.5 6L4.5 9" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Price cards — horizontal scroll */}
              <div className="relative w-full overflow-hidden">
                {showLeftArrow && activeIndex !== ongoingIndex && sortedPrices.length > 1 && (
                  <div className="absolute left-0 top-0 bottom-0 w-[32px] z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, white 0%, transparent 100%)' }} />
                )}
                <div
                  ref={scrollRef}
                  onScroll={updateArrows}
                  className="flex gap-[12px] items-start overflow-x-auto scroll-smooth snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {sortedPrices.map(price => (
                    <div key={price.id} className="snap-start shrink-0" style={{ width: sortedPrices.length === 1 ? '100%' : '75%' }}>
                      <PriceCard entry={price} />
                    </div>
                  ))}
                  <div className="shrink-0 w-[1px]" aria-hidden="true" />
                </div>
                {showRightArrow && sortedPrices.length > 1 && (
                  <div className="absolute right-0 top-0 bottom-0 w-[32px] z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, white 0%, transparent 100%)' }} />
                )}
              </div>

              {/* View Timeline(s) toggle — show whenever dates are available */}
              {overallStartDate && overallEndDate && (
                <div className="w-full mt-[6px]">
                  <button
                    onClick={() => setTimelinesOpen(!timelinesOpen)}
                    className="flex gap-[8px] items-center h-[17px] bg-transparent border-none p-0 cursor-pointer"
                  >
                    <TriangleIcon rotated={timelinesOpen} />
                    <span className="font-['Figtree',sans-serif] font-normal text-[12px] leading-[16px] text-[#64748b]">
                      View Timeline{sortedPrices.length > 1 ? 's' : ''}
                    </span>
                  </button>

                  <AnimatedCollapse isOpen={timelinesOpen}>
                    <div className="mt-[24px] pb-[4px]">
                      <Timeline prices={sortedPrices} overallStartDate={overallStartDate} overallEndDate={overallEndDate} />
                    </div>
                  </AnimatedCollapse>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      {/* Border overlay */}
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-[-1px] pointer-events-none rounded-[17px]" />
    </div>
  );
}
