# Add Product to Contract — Feature Documentation

## Overview

The "Add Product to Contract" feature allows users to browse a product catalog, select products with specific pricing options, and add them to a contract. It lives on the **Contract Details Page** under the Summary tab.

---

## Files Involved

| File | Role |
|------|------|
| `src/components/AddProductModal.jsx` | The main slide-in panel (right drawer) for browsing & selecting products |
| `src/components/ProductCard.jsx` | Card component rendered on the contract page for each added product |
| `src/components/ContractDetailsPage.jsx` | Host page — manages product list state, opens/closes modal, renders cards |

---

## User Flow

1. User is on the **Contract Details Page**, Summary tab.
2. User clicks **"+ ADD PRODUCT"** button (orange text link, bottom of products section).
3. A **560px right-side drawer** slides in with a dark overlay.
4. User can:
   - Click **"CREATE NEW PRODUCT"** button (full-width, bordered) — placeholder, no action yet.
   - Search products via the search bar.
   - Expand a product to see its pricing options.
   - Select a price by clicking the checkbox circle — product moves to the "Added" section.
   - Deselect by clicking the checkbox again.
5. Footer shows count badge + "X products added" / "No products added yet".
6. Click **"Done"** to commit selections → new ProductCards appear on the page.
7. Click **"Cancel"** or the backdrop to close without changes.

---

## Data Model

### PRODUCT_CATALOG (exported from AddProductModal.jsx)

```js
[
  {
    id: 'user-seats',           // unique catalog ID
    name: 'User Seats',
    type: 'Period of time',     // | 'Point in time'
    metric: 'Quantity',         // | 'Flat fee'
    prices: [
      { id: 'us-p1', model: 'Per Unit Price', amount: '$20.00', unit: '/seat/month' },
      { id: 'us-p2', model: 'Per Unit Price', amount: '$200.00', unit: '/seat/year' },
    ],
  },
  // ... more products
]
```

**Price shapes:**
- **Simple price**: `{ id, model, amount, unit }`
- **Volume/tiered price**: `{ id, model, unit, tiers: [{ from, to, price }] }` (no `amount`)

**All catalog products:**

| ID | Name | Type | Metric | # Prices |
|----|------|------|--------|----------|
| `user-seats` | User Seats | Period of time | Quantity | 2 |
| `storage` | Storage | Period of time | Quantity | 1 |
| `premium-support` | Premium Support | Period of time | Flat fee | 2 |
| `data-exports` | Data Exports | Point in time | Quantity | 1 |
| `api-calls` | API Calls | Point in time | Quantity | 2 (1 tiered) |
| `hd-plan` | HD Plan | Point in time | Quantity | 1 |
| `email-notifications` | Email Notifications | Point in time | Quantity | 2 (1 tiered) |
| `feature-access` | Feature Access | Period of time | Flat fee | 2 |

### Contract Product Shape (after adding)

When `handleAdd()` fires, it maps selections → this shape:

```js
{
  id:          'added-user-seats-1234-0.56',  // generated unique ID
  catalogId:   'user-seats',                  // reference to catalog
  name:        'User Seats',
  type:        'Period of time',
  metric:      'Quantity',
  period:      'Mar 01, 2026 → Mar 01, 2027', // auto-generated: current month → +1 year
  billingDate: 'Mar 01, 2026',
  phases: [
    {
      status:           'ONGOING',
      range:            'Product Start →',
      perUnitPrice:     '$20.00',              // or 'Volume (3 tiers)' for tiered
      quantityIncluded: '—',
      billingCadence:   'Postpaid - Every Month', // or 'Prepaid - Every Month' for Flat Fee
    },
  ],
}
```

---

## Component Breakdown

### AddProductModal

**Props:**
```js
{
  isOpen: bool,
  onClose: fn,
  onAdd: fn(newProducts[]),      // called with array of contract-product objects
  existingProductIds: string[]   // catalog IDs already on the contract (filtered out)
}
```

**State:**
```js
search      // string — filters unselected products by name
selections  // { [productId]: priceId } — single price selected per product
expanded    // Set<productId> — which products show full price list (default: all)
```

**Layout (560px fixed right drawer):**
```
┌─────────────────────────────┐
│ Header: "Add Products" + X  │  px-[24px] py-[18px], border-b
├─────────────────────────────┤
│ [CREATE NEW PRODUCT] btn    │  h-[44px], full-width, border-[#cbd5e1]
│ ────────── OR ──────────    │  divider
│ [🔍 Search products...]     │  h-[44px], bg-[#f8fafc]
├─────────────────────────────┤
│ Scrollable list:            │  px-[24px], gap-[16px]
│   ADDED (N)                 │  — section label (only when selections exist)
│   ProductItem               │
│   ─────── (separator) ───── │  — between products
│   ════════════════════════  │  FullSeparator: -mx-[24px] full-width line
│   AVAILABLE PRODUCTS        │  — always shown
│   ProductItem               │
│   ─────── (separator) ───── │
│   ...                       │
├─────────────────────────────┤
│ Footer: count + Cancel/Done │  border-t
└─────────────────────────────┘
```

**Sub-components inside AddProductModal:**
- `CheckCircle` — 18px circle, orange when checked, gray border when not
- `TypeTag` — colored badge: `bg-[#d8edff]` for "Point in time", `bg-[#eef]` for "Period of time"
- `PriceContent` — renders either simple amount or tier chips
- `PriceRow` — checkbox + PriceContent, shown when product is expanded
- `CollapsedPrice` — checkbox (checked) + summary string, shown when product has a selection and is collapsed
- `ProductItem` — header row (name + TypeTag + chevron) + prices below
- `Separator` — 1px `bg-[#e2e8f0]` line (within padding)
- `FullSeparator` — same but `-mx-[24px]` to bleed edge-to-edge between sections

**Price selection behavior:**
- Clicking a price when unchecked → selects it, collapses the product
- Clicking the checked price again → deselects it, expands the product

**Footer copy:**
- Count badge: orange circle with number (only shown when count > 0)
- Status text: `"X products added"` or `"No products added yet"`
- "Done" button: orange (`bg-[#ed765e]`) when count > 0, gray + disabled when 0

---

### ProductCard

**Props:** `{ product }` — the contract product shape (see above)

**Layout:**
```
┌──────────────────────────────────────────────┐
│ Name  [Period of time]  [Quantity]            │  + 3-dot menu
│ Jan 01, 2026 → Jun 31, 2026  |  Jan 01, 2026 │
│ ● ● ●  [◁] [▷]                               │  phase dots + nav arrows
│ ┌──────────────┐ ┌──────────────┐            │
│ │ ONGOING      │ │ UPCOMING     │            │  phase columns
│ │ date range   │ │ date range   │            │
│ │ Per Unit Prc │ │ Per Unit Prc │            │
│ │ Qty Included │ │ Qty Included │            │
│ │ Bill Cadence │ │ Bill Cadence │            │
│ │ ↑ Details    │ │ ↑ Details    │            │
│ └──────────────┘ └──────────────┘            │
└──────────────────────────────────────────────┘
```

Phase columns: `bg-[#f8fafc] rounded-[12px]`, flex-1 each, scrollable horizontally if >2 phases.

Phase status badges:
- `ONGOING`: `bg-[#e0f5fe]` blue pill
- `UPCOMING`: `bg-[#e2e8f0]` gray dashed-border pill

---

### ContractDetailsPage (host)

**State:**
```js
activeTab     // 'summary' | 'invoices' | 'accounting' | 'logs'
products      // array of contract-product objects
addModalOpen  // bool
```

**Initial products (mock data):** 2 products — "API Calls" and "HD Plan", each with 2 phases (ONGOING + UPCOMING).

**`existingProductIds`** passed to modal is derived from `products.map(p => p.catalogId)` — prevents already-added products from showing in the Available section.

**`handleProductsAdded(newProducts)`** — appends to `products` state, closes modal.

---

## Design Details (Figma node 54-3113)

- Drawer width: `560px`
- Header padding: `px-[24px] py-[18px]`
- Controls section padding: `px-[24px] pt-[24px] pb-[20px]`, gap `20px`
- List padding: `px-[24px] pb-[24px]`, gap between items `16px`
- Product header padding: `py-[8px]`
- "Create New Product" button: `h-[44px]`, `border-[#cbd5e1]`, `rounded-[6px]`
- Search bar: `h-[44px]`, `bg-[#f8fafc]`, `border-[#e2e8f0]`, `rounded-[6px]`
- Chevron icon: inline SVG (`10x6`, path `M1 1L5 5L9 1`)
- Check circle: `w-[18px] h-[18px]`, orange `#ed765e` when checked
- Footer: `px-[24px] py-[14px]`, `border-t border-[#e2e8f0]`

---

## Known Issues

### Broken icon images

All `localhost:3845/assets/...` URLs are **session-specific** — they go stale when Figma is restarted. The following files have stale icon URLs that need to be refreshed from the Figma MCP:

| File | Stale Variables |
|------|----------------|
| `AddProductModal.jsx` | `imgClose` (close button in header) |
| `ProductCard.jsx` | `imgArrowLeft`, `imgArrowRight`, `imgUpArrow` |
| `ContractDetailsPage.jsx` | `imgUsFlag` (USD badge flag) |
| `NewContractPane.jsx` | `imgClose`, `imgFileText`, `imgUpV`, `imgUpV1`, `imgUpV2`, `imgDivider`, `imgChevronDn`, `imgChevronAlt` |
| `App.jsx` | Logo, sidebar icons, profile image, table icons (30+ URLs) |

**To fix:** Open the relevant Figma designs in Figma desktop so nodes become accessible, then fetch fresh URLs via `mcp__figma__get_design_context`. AddProductModal's search, chevron, and + icon are already inline SVGs (not affected).

---

## Colors Reference

| Token | Hex | Usage |
|-------|-----|-------|
| Primary accent | `#ed765e` | CTA buttons, selected checkboxes, active tab |
| Body text | `#1e293b` | Product names, primary values |
| Secondary text | `#64748b` | Labels, section headers |
| Muted text | `#94a3b8` | Placeholder, units, subtle labels |
| Border | `#e2e8f0` | Card borders, separators |
| Light bg | `#f8fafc` | Phase columns, search bar bg |
| Period tag bg | `#eef` | "Period of time" TypeTag |
| Point tag bg | `#d8edff` | "Point in time" TypeTag |
| ONGOING badge | `#e0f5fe` / `#0370a1` | Phase status |
| UPCOMING badge | `#e2e8f0` / `#64748b` | Phase status |
