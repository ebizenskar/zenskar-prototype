import { useState } from 'react';
import NewContractPane from './components/NewContractPane.jsx';
import ContractDetailsPage from './components/ContractDetailsPage.jsx';

const imgLogoDefault = "http://localhost:3845/assets/63cf715d61b10178ca8be01bcaa8eabc05076200.svg";
const imgLogoWhite = "http://localhost:3845/assets/64d8318013cd87f441f6499b9f181a99084ea928.svg";
const imgImage = "http://localhost:3845/assets/e3d96721b056057ef543b64d2096ad3248dbc9ec.png";
const imgSearch = "http://localhost:3845/assets/4b8426143184063cd0139e5ade375c4ee15d3c2f.svg";
const imgIcon = "http://localhost:3845/assets/fc81007d65a2b56b7fc52188d282991ecd8e41d7.svg";
const imgVector = "http://localhost:3845/assets/97fd4715302d7527f8bced3d498653a52dc5f10a.svg";
const imgVector1 = "http://localhost:3845/assets/391f05c7a96fc929dcad718a55b3cb38e4e96ff1.svg";
const imgVector2 = "http://localhost:3845/assets/da86f44bd7bd7b9c642aa7e44b22ee754a0f4ae4.svg";
const imgGroup103082 = "http://localhost:3845/assets/138c38bcb7568fe71424d0f2ea5fdc58d401214d.svg";
const imgGroup102893 = "http://localhost:3845/assets/c3f6433012324fec1197b1146eecf92040c3942e.svg";
const imgFrame = "http://localhost:3845/assets/2b196c0d54d1a5c6f5136bcffc81e0b950ad5667.svg";
const imgIcon1 = "http://localhost:3845/assets/a2038293b0a3d36dbddfce456b61609ac46cc20b.svg";
const imgIcon2 = "http://localhost:3845/assets/f71c5643999f387cee14bec970fabd75d5e37bd4.svg";
const imgFrame103086 = "http://localhost:3845/assets/f7ca16db09ccf639d27c139dedf4e0635edbe667.svg";
const imgGroup103097 = "http://localhost:3845/assets/dbe10264f108159c313486b7aa131a83a6b12c62.svg";
const imgMaterialSymbolsFlagOutline = "http://localhost:3845/assets/4d957d0ecf7ff721212225e387d7baac0db65fb2.svg";
const imgEllipse126 = "http://localhost:3845/assets/dbcb17a8ef41d664c5553793b8451fb9be06dfa0.svg";
const imgIcon3 = "http://localhost:3845/assets/12ea3492cc072eeb6fe72308a9b338b0aec0448f.svg";
const imgIcon4 = "http://localhost:3845/assets/370ba0ed56f4e243d8b967df657be181ec55232b.svg";
const imgIconFeatherUsers = "http://localhost:3845/assets/6b93bc19abe39b31e2e9d0a6947f802faeeed76e.svg";
const imgVector3 = "http://localhost:3845/assets/c348f43b49b7dda26dbd34a910a6b1f2de831e50.svg";
const imgGroup10464 = "http://localhost:3845/assets/013f2247aab8d7618e200c21de9eb4447c218504.svg";
const imgGroup10465 = "http://localhost:3845/assets/986de808d7ebace1e04ba8295646c5e6348480d1.svg";
const imgBell = "http://localhost:3845/assets/d39a465260bab8457818dbb1732e7a63d086f79a.svg";
const imgMaskGroup10465 = "http://localhost:3845/assets/ad9f5d4904f554ebdb6ad8f11aab65136494548f.svg";
const imgMaskGroup10466 = "http://localhost:3845/assets/b506ff1bf44c3be88d9dbd9d0ca5ab5f4b4d18f1.svg";
const imgFrame1 = "http://localhost:3845/assets/ea938f29564e01fb431e9411310d786f5b1f80d7.svg";
const imgLine6505 = "http://localhost:3845/assets/3dc54d2ae5ff2b944174da61e264765c557856f5.svg";
const imgBell1 = "http://localhost:3845/assets/5673112a66b80c4ef093e8aa0795ff26f7cc1781.svg";

// ─── Table data ──────────────────────────────────────────────────────────────

const contracts = [
  { id: 1, name: 'Contract 1', customer: 'Patricia Sanders', start: 'Oct 5, 2023',  end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 12,000.00'  },
  { id: 2, name: 'Contract 2', customer: 'Kurt Bates',       start: 'Sep 24, 2023', end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 15,500.00*' },
  { id: 3, name: 'Contract 3', customer: 'Iva Ryan',         start: 'Oct 7, 2023',  end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 9,750.00*'  },
  { id: 4, name: 'Contract 4', customer: 'Rhonda Rhodes',    start: 'Sep 21, 2023', end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 22,300.00'  },
  { id: 5, name: 'Contract 5', customer: 'Daniel Hamilton',  start: 'Oct 4, 2023',  end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 18,650.00'  },
  { id: 6, name: 'Contract 6', customer: 'Jerry Helfer',     start: 'Oct 12, 2023', end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 25,000.00*' },
  { id: 7, name: 'Contract 7', customer: 'Corina McCoy',     start: 'Sep 25, 2023', end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 30,750.00*' },
  { id: 8, name: 'Contract 8', customer: 'Kathy Pacheco',    start: 'Oct 1, 2023',  end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 5,500.00*'  },
  { id: 9, name: 'Contract 9', customer: 'John Dukes',       start: 'Oct 6, 2023',  end: 'Oct 16, 2023', createdAt: 'Sep 16, 2025 11:32 PM', value: '$ 19,900.00'  },
];

// Grid column template — checkbox | name | customer | period | created | value | actions
const COLS = '52px 1.5fr 1.5fr 2fr 1.75fr 1.5fr 40px';

// ─── Small reusable pieces ────────────────────────────────────────────────────

function Logo({ className, logo = 'Default' }) {
  const isWhite = logo === 'white';
  return (
    <div className={className || 'h-[24.006px] relative w-[109.159px]'}>
      <img alt="" className="absolute block max-w-none size-full" src={isWhite ? imgLogoWhite : imgLogoDefault} />
    </div>
  );
}

function CheckBox({ className }) {
  return (
    <div className={className || 'relative size-[16px]'}>
      <div className="absolute bg-white border border-[#cbd5e1] border-solid inset-0 rounded-[2px]" />
    </div>
  );
}

function SortIcon() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <div className="absolute inset-[62.5%_31.25%_18.75%_31.25%]">
        <div className="absolute inset-[-25%_-12.5%]">
          <img alt="" className="block max-w-none size-full" src={imgIcon1} />
        </div>
      </div>
      <div className="absolute flex inset-[18.75%_31.25%_62.5%_31.25%] items-center justify-center">
        <div className="flex-none h-[3px] rotate-180 w-[6px]">
          <div className="relative size-full">
            <div className="absolute inset-[-25%_-12.5%]">
              <img alt="" className="block max-w-none size-full" src={imgIcon2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColHeader({ label, align = 'left', showSort = true }) {
  return (
    <div className={`flex gap-[4px] items-center ${align === 'right' ? 'justify-end' : ''}`}>
      <div className="overflow-clip relative shrink-0 size-[16px]">
        <div className="absolute inset-[18.75%_31.25%]">
          <img alt="" className="absolute block max-w-none size-full" src={imgFrame} />
        </div>
      </div>
      <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-end leading-[0] text-[#94a3b8] text-[13px] whitespace-nowrap">
        <p className="leading-[13px]">{label}</p>
      </div>
      {showSort && <SortIcon />}
    </div>
  );
}

function DotsMenu() {
  return (
    <div className="overflow-clip relative size-[16px] shrink-0">
      <div className="absolute inset-[6.25%_41.66%] flex items-start overflow-clip py-px">
        <div className="h-[12px] relative shrink-0 w-[2.67px]">
          <img alt="" className="absolute block max-w-none size-full" src={imgFrame103086} />
        </div>
      </div>
    </div>
  );
}

// ─── Contracts table ──────────────────────────────────────────────────────────

function ContractsTable({ onRowClick }) {
  return (
    <div className="overflow-auto flex-1 min-h-0">
      <div style={{ minWidth: '640px' }}>

        {/* Header row */}
        <div
          className="bg-[#f1f5f9] h-[48px] rounded-tl-[8px] items-center"
          style={{ display: 'grid', gridTemplateColumns: COLS }}
        >
          {/* Checkbox */}
          <div className="flex items-center pl-[24px]">
            <CheckBox />
          </div>
          {/* Contract Name */}
          <div className="flex items-center">
            <ColHeader label="Contract Name" />
          </div>
          {/* Customer */}
          <div className="flex items-center">
            <ColHeader label="Customer" />
          </div>
          {/* Contract Period */}
          <div className="flex items-center">
            <ColHeader label="Contract Period" showSort={false} />
          </div>
          {/* Created at */}
          <div className="flex items-center">
            <ColHeader label="Created at" />
          </div>
          {/* Total Contract Value */}
          <div className="flex items-center justify-end pr-[16px]">
            <ColHeader label="Total Contract Value" align="right" />
          </div>
          {/* Column adjuster */}
          <div className="flex items-center justify-center">
            <img alt="" className="h-[16px] w-[17px]" src={imgGroup102893} />
          </div>
        </div>

        {/* Data rows */}
        {contracts.map((c) => (
          <div
            key={c.id}
            className="items-center border-b border-[#e2e8f0] cursor-pointer hover:bg-[#f8fafc]"
            style={{ display: 'grid', gridTemplateColumns: COLS, height: '56px' }}
            onClick={() => onRowClick && onRowClick(c)}
          >
            {/* Checkbox */}
            <div className="flex items-center pl-[24px]">
              <CheckBox />
            </div>

            {/* Contract Name */}
            <div className="flex items-center pr-[8px]">
              <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[13px] leading-[13px] truncate">
                {c.name}
              </span>
            </div>

            {/* Customer */}
            <div className="flex items-center pr-[8px]">
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#1145bc] text-[12px] leading-[12px] truncate">
                {c.customer}
              </span>
            </div>

            {/* Contract Period */}
            <div className="flex items-center gap-[12px] pr-[8px]">
              <div className="h-[25px] relative shrink-0 w-[6px]">
                <div className="absolute inset-[-2%_-8.33%]">
                  <img alt="" className="block max-w-none size-full" src={imgGroup103097} />
                </div>
              </div>
              <div className="flex flex-col gap-[8px] font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px]">
                <span className="leading-[12px]">{c.start}</span>
                <span className="leading-[12px]">{c.end}</span>
              </div>
            </div>

            {/* Created at */}
            <div className="flex items-center pr-[8px]">
              <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[12px] whitespace-nowrap">
                {c.createdAt}
              </span>
            </div>

            {/* Total Contract Value */}
            <div className="flex items-center justify-end pr-[16px]">
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#475569] text-[13px] leading-[16px] text-right whitespace-nowrap">
                {c.value}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center">
              <DotsMenu />
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <div className="bg-[#1d2235] flex flex-col gap-[21px] h-screen items-start pb-[28px] pt-[16px] px-[16px] w-[240px] shrink-0">
      <div className="flex flex-col items-start p-[12px] relative shrink-0 w-full">
        <Logo className="h-[24.006px] relative shrink-0 w-[110.076px]" logo="white" />
      </div>
      <div className="flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px min-w-px relative w-full">
        <div className="flex flex-col items-start relative shrink-0 w-full">
          <div className="flex gap-[17px] items-center px-[8px] py-[6px] relative shrink-0 w-full">
            <div className="relative shrink-0 size-[16px]">
              <img alt="" className="absolute block max-w-none size-full" src={imgMaterialSymbolsFlagOutline} />
            </div>
            <div className="inline-grid grid-cols-[max-content] grid-rows-[max-content] leading-[0] place-items-start relative shrink-0">
              <div className="col-1 flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end ml-0 mt-0 relative row-1 text-[#f1f5f9] text-[14px] whitespace-nowrap">
                <p className="leading-[13px]">Getting Started</p>
              </div>
            </div>
          </div>
        </div>
        <div className="inline-grid grid-cols-[max-content] grid-rows-[max-content] leading-[0] place-items-start relative shrink-0">
          <div className="col-1 flex flex-col gap-[8px] items-start ml-0 mt-[22px] relative row-1">
            {/* Insights */}
            <div className="h-[30px] relative shrink-0 w-[208px]">
              <div className="absolute inset-[30%_3.78%_30%_89.08%] overflow-clip">
                <div className="absolute inset-[-300%_325%_325%_-300%]">
                  <img alt="" className="absolute block max-w-none size-full" src={imgEllipse126} />
                </div>
                <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
                  <div className="absolute inset-[-25%_-10.1%]">
                    <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                  </div>
                </div>
              </div>
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-45px)] top-1/2 w-[102px]">
                <div className="absolute left-0 overflow-clip size-[16px] top-0">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[10px] top-1/2">
                    <div className="absolute inset-[-6.5%]">
                      <img alt="" className="block max-w-none size-full" src={imgIcon4} />
                    </div>
                  </div>
                </div>
                <div className="-translate-y-full absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] left-[31px] text-[#f1f5f9] text-[14px] top-[14.5px] whitespace-nowrap">
                  <p className="leading-[13px]">Insights</p>
                </div>
              </div>
            </div>
            {/* Customers */}
            <div className="h-[30px] relative shrink-0 w-[208px]">
              <div className="absolute inset-[30%_3.78%_30%_89.08%] overflow-clip">
                <div className="absolute inset-[-300%_325%_325%_-300%]">
                  <img alt="" className="absolute block max-w-none size-full" src={imgEllipse126} />
                </div>
                <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
                  <div className="absolute inset-[-25%_-10.1%]">
                    <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                  </div>
                </div>
              </div>
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-45px)] top-1/2 w-[102px]">
                <div className="absolute left-0 overflow-clip size-[16px] top-0">
                  <div className="absolute inset-0 overflow-clip">
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[10.052px] left-1/2 top-[calc(50%+0.03px)] w-[12px]">
                      <div className="absolute inset-[5.58%_4.29%_5.12%_4.29%]">
                        <div className="absolute inset-[-6.68%_-5.47%]">
                          <img alt="" className="block max-w-none size-full" src={imgIconFeatherUsers} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="-translate-y-full absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] left-[31px] text-[#f1f5f9] text-[14px] top-[14.5px] whitespace-nowrap">
                  <p className="leading-[13px]">Customers</p>
                </div>
              </div>
            </div>
            {/* Usage */}
            <div className="h-[30px] relative shrink-0 w-[208px]">
              <div className="absolute inset-[30%_3.78%_30%_89.08%] overflow-clip">
                <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
                  <div className="absolute inset-[-25%_-10.1%]">
                    <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                  </div>
                </div>
              </div>
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-45px)] top-1/2 w-[102px]">
                <div className="absolute left-0 size-[16px] top-0">
                  <div className="absolute inset-[12.5%_9.38%_14.96%_9.38%]">
                    <img alt="" className="absolute block max-w-none size-full" src={imgVector3} />
                  </div>
                </div>
                <div className="-translate-y-full absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] left-[31px] text-[#f1f5f9] text-[14px] top-[14.5px] whitespace-nowrap">
                  <p className="leading-[13px]">Usage</p>
                </div>
              </div>
            </div>
            {/* Contracts (parent) */}
            <div className="h-[30px] relative shrink-0 w-[208px]">
              <div className="absolute flex inset-[30%_3.78%_30%_89.08%] items-center justify-center">
                <div className="flex-none h-[12px] rotate-180 w-[14.857px]">
                  <div className="overflow-clip relative size-full">
                    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
                      <div className="absolute inset-[-25%_-10.1%]">
                        <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-45px)] top-1/2 w-[102px]">
                <div className="absolute left-0 overflow-clip size-[16px] top-0">
                  <div className="absolute inset-[12.5%_21.99%_12.5%_21.88%] overflow-clip">
                    <div className="absolute inset-[0_-0.01%_0_-0.07%]" style={{ maskImage: `url('${imgGroup10464}')`, maskMode: 'alpha', maskComposite: 'intersect', maskClip: 'no-clip', maskRepeat: 'no-repeat', maskSize: '8.981px 12px' }}>
                      <img alt="" className="absolute block max-w-none size-full" src={imgGroup10465} />
                    </div>
                  </div>
                </div>
                <div className="-translate-y-full absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] left-[31px] text-[#f1f5f9] text-[14px] top-[14.5px] whitespace-nowrap">
                  <p className="leading-[13px]">Contracts</p>
                </div>
              </div>
            </div>
            {/* Contracts active item (highlighted) */}
            <div className="border border-[rgba(137,175,211,0.88)] border-solid flex h-[32px] items-center justify-between px-[8px] py-[7px] relative rounded-[8px] shrink-0 w-full" style={{ backgroundImage: 'linear-gradient(116.305deg, rgba(99, 150, 195, 0.22) 60.556%, rgba(13, 29, 66, 0.25) 108.74%)' }}>
              <div className="flex gap-[16px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[16px]">
                  <img alt="" className="absolute block max-w-none size-full" src={imgBell} />
                </div>
                <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] relative shrink-0 text-[#f1f5f9] text-[13px] whitespace-nowrap">
                  <p className="leading-[13px]">Contracts</p>
                </div>
              </div>
              <div className="bg-[#d98b06] flex flex-col items-center justify-center opacity-0 overflow-clip px-[6px] py-[3px] relative rounded-[20px] shrink-0">
                <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[#f1f5f9] text-[10px] whitespace-nowrap">
                  <p className="leading-[10px]">17</p>
                </div>
              </div>
            </div>
            {/* Plans */}
            <div className="h-[30px] relative shrink-0 w-[208px]">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-45px)] top-1/2 w-[102px]">
                <div className="-translate-y-full absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] left-[31px] text-[#f1f5f9] text-[14px] top-[14.5px] whitespace-nowrap">
                  <p className="leading-[13px]">Plans</p>
                </div>
              </div>
            </div>
            {/* Products */}
            <div className="h-[30px] relative shrink-0 w-[208px]">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-45px)] top-1/2 w-[102px]">
                <div className="-translate-y-full absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] left-[31px] text-[#f1f5f9] text-[14px] top-[14.5px] whitespace-nowrap">
                  <p className="leading-[13px]">Products</p>
                </div>
              </div>
            </div>
            {/* Invoices */}
            <div className="h-[30px] relative shrink-0 w-[208px]">
              <div className="absolute flex inset-[30%_3.78%_30%_89.08%] items-center justify-center">
                <div className="flex-none h-[12px] rotate-180 w-[14.857px]">
                  <div className="overflow-clip relative size-full">
                    <div className="absolute inset-[-300%_325%_325%_-300%]">
                      <img alt="" className="absolute block max-w-none size-full" src={imgEllipse126} />
                    </div>
                    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
                      <div className="absolute inset-[-25%_-10.1%]">
                        <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-45px)] top-1/2 w-[102px]">
                <div className="absolute left-0 overflow-clip size-[16px] top-0">
                  <div className="absolute inset-[12.5%_12.5%_12.49%_12.5%] overflow-clip" style={{ maskImage: `url('${imgMaskGroup10465}')`, maskMode: 'alpha', maskComposite: 'intersect', maskClip: 'no-clip', maskRepeat: 'no-repeat', maskSize: '12px 12px' }}>
                    <img alt="" className="absolute block max-w-none size-full" src={imgMaskGroup10466} />
                  </div>
                </div>
                <div className="-translate-y-full absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] left-[31px] text-[#f1f5f9] text-[14px] top-[14.5px] whitespace-nowrap">
                  <p className="leading-[13px]">Invoices</p>
                </div>
              </div>
            </div>
            {/* Accounting */}
            <div className="h-[30px] relative shrink-0 w-[208px]">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-45px)] top-1/2 w-[102px]">
                <div className="-translate-y-full absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] left-[31px] text-[#f1f5f9] text-[14px] top-[14.5px] whitespace-nowrap">
                  <p className="leading-[13px]">Accounting</p>
                </div>
              </div>
            </div>
            {/* More */}
            <div className="h-[30px] relative shrink-0 w-[208px]">
              <div className="absolute flex inset-[30%_3.78%_30%_89.08%] items-center justify-center">
                <div className="flex-none h-[12px] rotate-180 w-[14.857px]">
                  <div className="overflow-clip relative size-full">
                    <div className="absolute inset-[-300%_325%_325%_-300%]">
                      <img alt="" className="absolute block max-w-none size-full" src={imgEllipse126} />
                    </div>
                    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
                      <div className="absolute inset-[-25%_-10.1%]">
                        <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-45px)] top-1/2 w-[102px]">
                <div className="absolute left-0 overflow-clip size-[16px] top-0">
                  <div className="absolute inset-[18.75%_31.25%]">
                    <img alt="" className="absolute block max-w-none size-full" src={imgFrame1} />
                  </div>
                </div>
                <div className="-translate-y-full absolute flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] left-[31px] text-[#f1f5f9] text-[14px] top-[14.5px] whitespace-nowrap">
                  <p className="leading-[13px]">More</p>
                </div>
              </div>
            </div>
          </div>
          {/* Platform label */}
          <div className="col-1 flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end ml-[8px] mt-0 relative row-1 text-[#b3c0cd] text-[13px] whitespace-nowrap">
            <p className="leading-[13px]">Platform</p>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="h-0 relative shrink-0 w-[208px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgLine6505} />
        </div>
      </div>
      {/* Bottom section */}
      <div className="flex flex-col gap-[16px] items-start relative shrink-0 w-full">
        <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          {/* Alerts */}
          <div className="border border-[rgba(137,175,211,0.88)] border-solid flex h-[32px] items-center justify-between px-[8px] py-[7px] relative rounded-[8px] shrink-0 w-full" style={{ backgroundImage: 'linear-gradient(116.305deg, rgba(99, 150, 195, 0.22) 60.556%, rgba(13, 29, 66, 0.25) 108.74%)' }}>
            <div className="flex gap-[16px] items-center relative shrink-0">
              <div className="relative shrink-0 size-[16px]">
                <img alt="" className="absolute block max-w-none size-full" src={imgBell1} />
              </div>
              <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] relative shrink-0 text-[#f1f5f9] text-[13px] whitespace-nowrap">
                <p className="leading-[13px]">Alerts</p>
              </div>
            </div>
            <div className="bg-[#d98b06] flex flex-col items-center justify-center overflow-clip px-[6px] py-[3px] relative rounded-[20px] shrink-0">
              <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[#f1f5f9] text-[10px] whitespace-nowrap">
                <p className="leading-[10px]">17</p>
              </div>
            </div>
          </div>
          {/* Help & information */}
          <div className="flex h-[32px] items-center justify-between px-[8px] py-[7px] relative rounded-[8px] shrink-0 w-full">
            <div className="flex gap-[16px] items-center relative shrink-0">
              <div className="overflow-clip relative shrink-0 size-[16px]">
                <div className="absolute inset-0 overflow-clip">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[10.052px] left-1/2 top-[calc(50%+0.03px)] w-[12px]">
                    <div className="absolute inset-[5.58%_4.29%_5.12%_4.29%]">
                      <div className="absolute inset-[-6.68%_-5.47%]">
                        <img alt="" className="block max-w-none size-full" src={imgIconFeatherUsers} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] relative shrink-0 text-[#f1f5f9] text-[13px] whitespace-nowrap">
                <p className="leading-[13px]">{`Help & information`}</p>
              </div>
            </div>
            <div className="bg-[#35b25f] flex flex-col items-center justify-center overflow-clip px-[6px] py-[3px] relative rounded-[20px] shrink-0">
              <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[#f1f5f9] text-[10px] whitespace-nowrap">
                <p className="leading-[10px]">3</p>
              </div>
            </div>
          </div>
        </div>
        {/* Profile card */}
        <div className="backdrop-blur-[2px] border border-[rgba(137,175,211,0.88)] border-solid flex items-center justify-between pl-[16px] pr-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[208px]" style={{ backgroundImage: 'linear-gradient(105.774deg, rgba(45, 60, 84, 0.9) 60.556%, rgba(31, 41, 65, 0.9) 108.74%)' }}>
          <div className="flex gap-[8px] items-center relative shrink-0">
            <div className="relative shrink-0 size-[40px]">
              <img alt="" className="absolute block max-w-none size-full" height="40" src={imgImage} width="40" />
            </div>
            <div className="flex flex-col gap-[5px] items-start leading-[0] relative shrink-0 whitespace-nowrap">
              <div className="flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-end relative shrink-0 text-[#f8fafc] text-[13px]">
                <p className="leading-[13px]">John Doe</p>
              </div>
              <div className="flex flex-col font-['Figtree:Regular',sans-serif] font-normal justify-end relative shrink-0 text-[#cbd5e1] text-[10px]">
                <p className="leading-[10px]">Sales manager</p>
              </div>
            </div>
          </div>
          <div className="relative shrink-0 size-[16px]">
            <div className="absolute inset-[62.5%_31.25%_18.75%_31.25%]">
              <div className="absolute inset-[-25%_-12.5%]">
                <img alt="" className="block max-w-none size-full" src={imgIcon1} />
              </div>
            </div>
            <div className="absolute flex inset-[18.75%_31.25%_62.5%_31.25%] items-center justify-center">
              <div className="flex-none h-[3px] rotate-180 w-[6px]">
                <div className="relative size-full">
                  <div className="absolute inset-[-25%_-12.5%]">
                    <img alt="" className="block max-w-none size-full" src={imgIcon2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [paneOpen, setPaneOpen] = useState(false);
  const [view, setView] = useState('list');
  const [selectedContract, setSelectedContract] = useState(null);

  function handleRowClick(contract) {
    setSelectedContract(contract);
    setView('detail');
  }

  if (view === 'detail' && selectedContract) {
    return (
      <div className="flex h-screen bg-[#1d2235] overflow-hidden">
        <Sidebar />
        <ContractDetailsPage contract={selectedContract} onBack={() => setView('list')} />
      </div>
    );
  }

  return (
    <>
    <div className="flex h-screen bg-[#1d2235] overflow-hidden">

      {/* Sidebar — fixed 240 px */}
      <Sidebar />

      {/* Right side — fills remaining width */}
      <div className="flex flex-col flex-1 min-w-0 pt-[11px]">

        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center h-[30px] px-0 shrink-0">
          <div className="flex items-center">
            <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-end leading-[0] text-[#94a3b8] text-[13px] whitespace-nowrap">
              <p className="leading-[16px] whitespace-pre">{`Home  / `}</p>
            </div>
          </div>
          <div className="bg-[#334155] flex items-center justify-center p-[4px] relative rounded-[4px] shrink-0">
            <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-end leading-[0] text-[13px] text-white whitespace-nowrap">
              <p className="leading-[13px]">Contract</p>
            </div>
          </div>
        </div>

        {/* White content card — fills remaining height */}
        <div className="bg-white rounded-tl-[8px] flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* Card header */}
          <div className="flex items-center justify-between overflow-clip px-[20px] py-[24px] shrink-0">
            <div className="flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-end leading-[0] text-[#1e293b] text-[24px] tracking-[-0.24px] whitespace-nowrap">
              <p className="leading-[24px]">Contracts</p>
            </div>
            <div className="flex gap-[8px] items-center justify-end">
              {/* Search */}
              <div className="bg-white border border-[#e2e8f0] border-solid flex h-[32px] items-center pl-[8px] pr-[6px] rounded-[4px] shrink-0 w-[305px]">
                <div className="flex gap-[7px] items-center">
                  <div className="relative shrink-0 size-[16px]">
                    <div className="absolute inset-[12.5%]">
                      <img alt="" className="absolute block max-w-none size-full" src={imgSearch} />
                    </div>
                  </div>
                  <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium justify-center leading-[0] text-[#94a3b8] text-[13px] whitespace-nowrap">
                    <p className="leading-[13px]">Customers</p>
                  </div>
                </div>
              </div>
              {/* Generate Invoices */}
              <div className="bg-white border border-[#cbd5e1] border-solid flex gap-[8px] h-[32px] items-center justify-end pl-[12px] pr-[8px] rounded-[4px] shrink-0">
                <div className="flex items-center">
                  <div className="flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-end leading-[0] text-[#334155] text-[13px] text-right tracking-[0.2px] uppercase whitespace-nowrap">
                    <p className="leading-[14px]">GENERATE INVOICES</p>
                  </div>
                </div>
                <div className="bg-[#cbd5e1] h-[12px] rounded-[2px] shrink-0 w-px" />
                <div className="relative shrink-0 size-[16px]">
                  <img alt="" className="absolute block max-w-none size-full" src={imgIcon} />
                </div>
              </div>
              {/* Export */}
              <div className="bg-white border border-[#cbd5e1] border-solid flex gap-[8px] h-[32px] items-center justify-end px-[12px] rounded-[4px] shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]">
                  <div className="absolute inset-[62.5%_12.5%_12.5%_12.5%]">
                    <div className="absolute inset-[-18.75%_-6.25%]">
                      <img alt="" className="block max-w-none size-full" src={imgVector} />
                    </div>
                  </div>
                  <div className="absolute inset-[41.67%_29.17%_37.5%_29.17%]">
                    <div className="absolute inset-[-22.5%_-11.25%]">
                      <img alt="" className="block max-w-none size-full" src={imgVector1} />
                    </div>
                  </div>
                  <div className="absolute bottom-[37.5%] left-1/2 right-1/2 top-[12.5%]">
                    <div className="absolute inset-[-9.38%_-0.75px]">
                      <img alt="" className="block max-w-none size-full" src={imgVector2} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-end leading-[0] text-[#334155] text-[13px] text-right tracking-[0.2px] uppercase whitespace-nowrap">
                  <p className="leading-[14px]">Export</p>
                </div>
              </div>
              {/* Add New Contract */}
              <div
                className="bg-[#ed765e] flex h-[32px] items-center justify-center px-[16px] rounded-[4px] shrink-0 cursor-pointer"
                onClick={() => setPaneOpen(true)}
              >
                <div className="flex flex-col font-['Figtree:Bold',sans-serif] font-bold justify-end leading-[0] text-[12px] text-right text-white tracking-[0.2px] uppercase whitespace-nowrap">
                  <p className="leading-[12px]">ADD NEW CONTRACT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter row */}
          <div className="px-[20px] pb-[20px] shrink-0">
            <div className="border-[#cbd5e1] border-[0.8px] border-solid flex gap-[10px] h-[32px] items-center px-[12px] py-[8px] rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.15)] inline-flex">
              <div className="overflow-clip relative shrink-0 size-[10px]">
                <div className="absolute inset-[18.75%_12.5%]">
                  <div className="absolute inset-[-10%_-8.33%]">
                    <img alt="" className="block max-w-none size-full" src={imgGroup103082} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-center leading-[0] text-[#475569] text-[12px] whitespace-nowrap">
                <p className="leading-[12px]">Filter</p>
              </div>
            </div>
          </div>

          {/* Table — scrollable, fills remaining space */}
          <ContractsTable onRowClick={handleRowClick} />

        </div>
      </div>
    </div>

    <NewContractPane isOpen={paneOpen} onClose={() => setPaneOpen(false)} />
    </>
  );
}
