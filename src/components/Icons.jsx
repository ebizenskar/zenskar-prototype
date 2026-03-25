// Centralized icon components — real Figma assets, correct bounding boxes

import logoWhiteSvg        from '../assets/icons/logo-white.svg';
import iconSearchSvg       from '../assets/icons/icon-search.svg';
import iconGenerateInvoicesSvg from '../assets/icons/icon-generate-invoices.svg';
import iconFilterSvg       from '../assets/icons/icon-filter.svg';
import iconColumnAdjustSvg from '../assets/icons/icon-column-adjust.svg';
import iconSortDownSvg     from '../assets/icons/icon-sort-down.svg';
import iconSortUpSvg       from '../assets/icons/icon-sort-up.svg';
import iconDotsMenuSvg     from '../assets/icons/icon-dots-menu.svg';
import iconTimelineSvg     from '../assets/icons/icon-timeline.svg';
import iconFlagSvg         from '../assets/icons/icon-flag.svg';
import iconInsightsSvg     from '../assets/icons/icon-insights.svg';
import iconUsersSvg        from '../assets/icons/icon-users.svg';
import iconContractsFillSvg from '../assets/icons/icon-contracts-fill.svg';
import iconBellSvg         from '../assets/icons/icon-bell.svg';
import iconBellAlertsSvg   from '../assets/icons/icon-bell-alerts.svg';
import iconInvoicesFillSvg from '../assets/icons/icon-invoices-fill.svg';
import iconMoreFrameSvg    from '../assets/icons/icon-more-frame.svg';
import iconUsageSvg        from '../assets/icons/icon-usage.svg';

// ─── Bounding-box helpers ─────────────────────────────────────────────────────
// Each icon in Figma lives inside a 16×16 "Icon" bounding box.
// The actual artwork is positioned at specific insets inside that box.
// We replicate this: a 16×16 flex container centers the artwork at its exact size.

/** 16×16 bounding box, artwork centered */
function Box16({ children }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {children}
    </span>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

export function Logo({ className }) {
  return (
    <img
      src={logoWhiteSvg}
      alt="Zenskar"
      className={className || 'h-[24px] w-[110px]'}
      style={{ display: 'block' }}
    />
  );
}

// ─── Header / toolbar icons ───────────────────────────────────────────────────

/** Search — 12×12 artwork, inset 12.5% in 16×16 box */
export function SearchIcon() {
  return (
    <Box16>
      <img src={iconSearchSvg} alt="" style={{ display: 'block', width: 12, height: 12 }} />
    </Box16>
  );
}

/** Dropdown chevron — fills 16×16 */
export function DownloadIcon() {
  return (
    <Box16>
      <img src={iconGenerateInvoicesSvg} alt="" style={{ display: 'block', width: 16, height: 16 }} />
    </Box16>
  );
}

// ─── Sidebar nav icons ────────────────────────────────────────────────────────

/** Flag (Getting Started) — fills 16×16 */
export function FlagIcon() {
  return (
    <Box16>
      <img src={iconFlagSvg} alt="" style={{ display: 'block', width: 16, height: 16 }} />
    </Box16>
  );
}

/** Insights / Chart — 10×10 artwork centered in 16×16 (Figma: size-[10px]) */
export function ChartIcon() {
  return (
    <Box16>
      <img src={iconInsightsSvg} alt="" style={{ display: 'block', width: 10, height: 10 }} />
    </Box16>
  );
}

/** Customers / Users — 12×10 artwork in 16×16 */
export function UsersIcon() {
  return (
    <Box16>
      <img src={iconUsersSvg} alt="" style={{ display: 'block', width: 12, height: 10 }} />
    </Box16>
  );
}

/** Usage — 13×12 artwork, inset 12.5%/9.38% in 16×16 */
export function UsageIcon() {
  return (
    <Box16>
      <img src={iconUsageSvg} alt="" style={{ display: 'block', width: 13, height: 12 }} />
    </Box16>
  );
}

/** Contracts — 9×12 artwork, inset 12.5%/21.99% in 16×16 */
export function FileIcon() {
  return (
    <Box16>
      <img src={iconContractsFillSvg} alt="" style={{ display: 'block', width: 9, height: 12 }} />
    </Box16>
  );
}

/** Invoices — 12×12 artwork, inset 12.5% in 16×16 */
export function InvoicesIcon() {
  return (
    <Box16>
      <img src={iconInvoicesFillSvg} alt="" style={{ display: 'block', width: 12, height: 12 }} />
    </Box16>
  );
}

/** Bell — fills 16×16 (artwork viewBox is 32×32, scaled down) */
export function BellIcon() {
  return (
    <Box16>
      <img src={iconBellSvg} alt="" style={{ display: 'block', width: 16, height: 16 }} />
    </Box16>
  );
}

/** Bell Alerts (bottom Alerts row) — fills 16×16 */
export function BellAlertsIcon() {
  return (
    <Box16>
      <img src={iconBellAlertsSvg} alt="" style={{ display: 'block', width: 16, height: 16 }} />
    </Box16>
  );
}

/** More / frame — 6×10 artwork, inset 18.75%/31.25% in 16×16 */
export function MoreIcon() {
  return (
    <Box16>
      <img src={iconMoreFrameSvg} alt="" style={{ display: 'block', width: 6, height: 10 }} />
    </Box16>
  );
}

// ─── Table icons ──────────────────────────────────────────────────────────────

/**
 * Sort — up chevron (top) + down chevron (bottom), each 6×3,
 * arranged in a 6×10 stack centered inside a 16×16 bounding box.
 * Matches Figma column-header sort indicator.
 */
export function SortIcon() {
  return (
    <Box16>
      <span style={{ position: 'relative', width: 6, height: 10, display: 'inline-block' }}>
        {/* Up chevron: rotated 180° so it points upward */}
        <img
          src={iconSortUpSvg}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 6,
            height: 3,
            display: 'block',
            transform: 'rotate(180deg)',
          }}
        />
        {/* Down chevron */}
        <img
          src={iconSortDownSvg}
          alt=""
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 6,
            height: 3,
            display: 'block',
          }}
        />
      </span>
    </Box16>
  );
}

/**
 * Dots menu (⋮) — 3×12 artwork inside 16×16 bounding box.
 * Figma: inset-[6.25%_41.66%] → 1px top, 6.67px sides → ~2.67px wide, 12px tall.
 */
export function DotsMenuIcon() {
  return (
    <Box16>
      <img src={iconDotsMenuSvg} alt="" style={{ display: 'block', width: 3, height: 12 }} />
    </Box16>
  );
}

/** Column adjuster — 17×16 (slightly wider than standard bounding box) */
export function ColumnAdjustIcon() {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 17,
      height: 16,
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      <img src={iconColumnAdjustSvg} alt="" style={{ display: 'block', width: 17, height: 16 }} />
    </span>
  );
}

/**
 * Timeline bar (Contract Period column) — 6×25.
 * Figma: w-[6px] h-[25px] (the actual SVG viewBox is 7×26, very close).
 */
export function TimelineIcon() {
  return (
    <img
      src={iconTimelineSvg}
      alt=""
      style={{ display: 'block', width: 6, height: 25, flexShrink: 0 }}
    />
  );
}

/**
 * Filter chip icon — 8.75×7.5 artwork inside 10×10 bounding box.
 * Figma: size-[10px] container, inset-[18.75%_12.5%] ≈ 1.875px top/bottom, 1.25px sides.
 */
export function FilterIcon() {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 10,
      height: 10,
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      <img src={iconFilterSvg} alt="" style={{ display: 'block', width: 8.75, height: 7.5 }} />
    </span>
  );
}

// ─── Checkbox (drawn inline — no Figma image asset needed) ───────────────────

export function CheckboxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="15" height="15" rx="1.5" stroke="#CBD5E1" fill="white" />
    </svg>
  );
}
