import { useState, useRef } from 'react';

// ─── Assets ───────────────────────────────────────────────────────────────────

const imgClose      = "http://localhost:3845/assets/98e25a857aab2114e770322536f9cafb06034d96.svg";
const imgFileText   = "http://localhost:3845/assets/ce92ad46c7bd46b52eca45963c6f1c6a51cb0d34.svg";
const imgUpV        = "http://localhost:3845/assets/e999562343f61c09c5eda617120f153bab1b69ea.svg";
const imgUpV1       = "http://localhost:3845/assets/7e26af193ad6b893c6a832d7cce757ea65e29f44.svg";
const imgUpV2       = "http://localhost:3845/assets/d5612c6fd3ca5bf8477543fb61fb2a98e3907d23.svg";
const imgDivider    = "http://localhost:3845/assets/023decc02c99771e34ffcbdb84c4956f8d953ec7.svg";
const imgChevronDn  = "http://localhost:3845/assets/46fe61c80f7ce7fb10c63ba4cdbc219c5b218a0e.svg";
const imgChevronAlt = "http://localhost:3845/assets/f432e3311390949df1189e49245a894519c740e9.svg";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CUSTOMER_CURRENCY = {
  'Joe Root':        'INR',
  'Patricia Sanders':'USD',
  'Kurt Bates':      'USD',
  'Iva Ryan':        'EUR',
  'Rhonda Rhodes':   'GBP',
  'Daniel Hamilton': 'USD',
  'Jerry Helfer':    'EUR',
  'Corina McCoy':    'AUD',
  'Kathy Pacheco':   'USD',
  'John Dukes':      'CAD',
};

const CUSTOMERS  = Object.keys(CUSTOMER_CURRENCY);
const CURRENCIES = ['AED', 'AUD', 'CAD', 'EUR', 'GBP', 'INR', 'JPY', 'SGD', 'USD'];

// ─── Date helpers ─────────────────────────────────────────────────────────────

function firstOfMonth(offsetMonths = 0) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
}

function fmtDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toInputDate(d) {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromInputDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// ─── Chevron icon ─────────────────────────────────────────────────────────────

function Chevron({ src = imgChevronDn }) {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
        <div className="absolute inset-[-12.5%_-6.25%]">
          <img alt="" className="block max-w-none size-full" src={src} />
        </div>
      </div>
    </div>
  );
}

// ─── Shared field shell ───────────────────────────────────────────────────────
// Wraps the styled bg-[#f5f7fb] container; children go inside

function FieldShell({ label, valueText, placeholder, showChevron = true, onClick, children }) {
  return (
    <div
      className="bg-[#f5f7fb] flex h-[54px] items-center justify-between px-[12px] py-[10px] rounded-[8px] w-full relative cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-[1_0_0] flex-col gap-[2px] items-start max-w-[300px] min-w-0 pointer-events-none">
        <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#7c8ba1] text-[12px] leading-[normal]">
          {label}
        </p>
        <div className="flex flex-col h-[18px] items-start justify-center py-px w-full">
          <p className={`font-['Figtree:Medium',sans-serif] font-medium text-[14px] leading-[16px] w-full ${valueText ? 'text-[#1e293b]' : 'text-[#94a3b8]'}`}>
            {valueText || placeholder}
          </p>
        </div>
      </div>
      {showChevron && <div className="pointer-events-none"><Chevron /></div>}
      {/* Transparent interactive overlay */}
      {children}
    </div>
  );
}

// ─── Customer dropdown ────────────────────────────────────────────────────────

function CustomerField({ customer, onChange }) {
  return (
    <FieldShell label="Customer" valueText={customer} placeholder="Select Customer">
      <select
        value={customer}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[1]"
      >
        <option value="">Select Customer</option>
        {CUSTOMERS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </FieldShell>
  );
}

// ─── Currency dropdown ────────────────────────────────────────────────────────

function CurrencyField({ currency, onChange }) {
  return (
    <FieldShell label="Currency" valueText={currency} placeholder="Select Currency">
      <select
        value={currency}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[1]"
      >
        <option value="">Select Currency</option>
        {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </FieldShell>
  );
}

// ─── Date picker field ────────────────────────────────────────────────────────

function DateField({ label, value, onChange }) {
  const ref = useRef(null);
  return (
    <FieldShell
      label={label}
      valueText={fmtDate(value)}
      onClick={() => ref.current?.showPicker?.()}
    >
      <input
        ref={ref}
        type="date"
        value={toInputDate(value)}
        onChange={(e) => { const d = fromInputDate(e.target.value); if (d) onChange(d); }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[1]"
      />
    </FieldShell>
  );
}

// ─── Text input field ─────────────────────────────────────────────────────────

function InputField({ label, value, onChange, placeholder, labelColor = '#7c8ba1' }) {
  return (
    <div className="bg-[#f5f7fb] flex h-[54px] items-center px-[12px] py-[10px] rounded-[8px] w-full cursor-text">
      <div className="flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-0 w-full">
        <label
          className="font-['Figtree:Medium',sans-serif] font-medium text-[12px] leading-[normal] cursor-text"
          style={{ color: labelColor }}
        >
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-['Figtree:Medium',sans-serif] font-medium text-[#1e293b] text-[14px] leading-[16px] w-full bg-transparent border-0 outline-none p-0"
        />
      </div>
    </div>
  );
}

// ─── Textarea field ───────────────────────────────────────────────────────────

function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <div className="bg-[#f5f7fb] flex items-start px-[12px] py-[10px] rounded-[8px] w-full min-h-[54px] cursor-text">
      <div className="flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-0 w-full">
        <label className="font-['Figtree:Medium',sans-serif] font-medium text-[#334155] text-[12px] leading-[normal] cursor-text">
          {label}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="font-['Figtree:Medium',sans-serif] font-medium text-[#1e293b] text-[14px] leading-[16px] w-full bg-transparent border-0 outline-none p-0 resize-none"
        />
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label }) {
  return (
    <div className="flex items-center px-[4px] w-full">
      <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[14px] text-[#1e293b] text-[14px] whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}

function HelperText({ children }) {
  return (
    <div className="flex items-center px-[4px] w-full">
      <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[16px]">
        {children}
      </p>
    </div>
  );
}

// ─── Pane ─────────────────────────────────────────────────────────────────────

export default function NewContractPane({ isOpen, onClose }) {
  const [customer,         setCustomer]         = useState('');
  const [currency,         setCurrency]         = useState('');
  const [startDate,        setStartDate]        = useState(firstOfMonth(0));
  const [endDate,          setEndDate]          = useState(firstOfMonth(12));
  const [billingStartDate, setBillingStartDate] = useState(firstOfMonth(0));
  const [additionalOpen,   setAdditionalOpen]   = useState(false);
  const [contractName,     setContractName]     = useState('');
  const [description,      setDescription]      = useState('');
  const [tags,             setTags]             = useState([]);
  const [tagInput,         setTagInput]         = useState('');
  const [showTagInput,     setShowTagInput]     = useState(false);
  const billingLinked = useRef(true);

  function handleCustomerChange(c) {
    setCustomer(c);
    if (c) setCurrency(CUSTOMER_CURRENCY[c]);
  }

  function handleStartDateChange(d) {
    setStartDate(d);
    if (billingLinked.current) setBillingStartDate(d);
  }

  function handleBillingStartDateChange(d) {
    billingLinked.current = false;
    setBillingStartDate(d);
  }

  function addTag(e) {
    e?.preventDefault();
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
    setShowTagInput(false);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[560px] z-50 flex flex-col shadow-[-4px_0_32px_rgba(0,0,0,0.16)] bg-white rounded-tl-[12px] overflow-hidden">

        {/* ── Top bar ── */}
        <div className="bg-white border-b border-[#e2e8f0] flex h-[57px] items-center justify-between p-[16px] shrink-0">
          <p className="font-['Figtree:SemiBold',sans-serif] font-semibold text-[#334155] text-[14px] leading-[normal]">
            New Contract
          </p>
          <button onClick={onClose} className="flex items-center justify-center cursor-pointer bg-transparent border-0 p-0">
            <div className="h-[25px] w-[25px] relative">
              <img alt="Close" className="absolute block max-w-none size-full" src={imgClose} />
            </div>
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto border-b border-[#e2e8f0]">
          <div className="flex flex-col gap-[24px] items-start px-[36px] py-[24px] w-full">

            {/* Upload card */}
            <div className="bg-[#f9f9f9] border border-[#f1f5f9] flex items-center justify-between p-[16px] rounded-[8px] w-full">
              <div className="flex flex-[1_0_0] gap-[16px] items-center min-w-0">
                <div className="border border-[#e2e8f0] flex items-center justify-center p-[12px] rounded-[6px] shrink-0">
                  <div className="relative shrink-0 size-[20px]">
                    <img alt="" className="absolute block max-w-none size-full" src={imgFileText} />
                  </div>
                </div>
                <div className="flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-0">
                  <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#1e293b] text-[13px] leading-[14px] whitespace-nowrap">
                    Create Contract from a Document
                  </p>
                  <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[16px]">
                    Let AI extract contract details from your file
                  </p>
                </div>
              </div>
              <div className="px-[12px] shrink-0">
                <div className="bg-white border border-[#cbd5e1] flex h-[32px] items-center justify-center px-[16px] rounded-[4px] w-[93px] cursor-pointer">
                  <div className="flex items-center gap-[4px]">
                    <div className="overflow-clip relative shrink-0 size-[15px]">
                      <div className="absolute inset-[62.5%_12.5%_12.5%_12.5%]">
                        <div className="absolute inset-[-27.78%_-9.26%]">
                          <img alt="" className="block max-w-none size-full" src={imgUpV} />
                        </div>
                      </div>
                      <div className="absolute inset-[12.5%_29.17%_66.67%_29.17%]">
                        <div className="absolute inset-[-33.34%_-16.67%]">
                          <img alt="" className="block max-w-none size-full" src={imgUpV1} />
                        </div>
                      </div>
                      <div className="absolute bottom-[37.5%] left-1/2 right-1/2 top-[12.5%]">
                        <div className="absolute inset-[-13.89%_-0.83px]">
                          <img alt="" className="block max-w-none size-full" src={imgUpV2} />
                        </div>
                      </div>
                    </div>
                    <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[12px] tracking-[0.2px] uppercase leading-[12px]">
                      Upload
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Or Create Manually divider */}
            <div className="flex gap-[13px] items-center w-full">
              <div className="flex-[1_0_0] h-0 relative min-w-0">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgDivider} />
                </div>
              </div>
              <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[normal] shrink-0">
                Or Create Manually
              </p>
              <div className="flex-[1_0_0] h-0 relative min-w-0">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgDivider} />
                </div>
              </div>
            </div>

            {/* ── Contract Details ── */}
            <div className="flex flex-col gap-[16px] items-start w-full">
              <SectionHeader label="Contract Details" />
              <div className="flex flex-col gap-[12px] items-start w-full">
                <CustomerField customer={customer} onChange={handleCustomerChange} />
                <div className="flex flex-col gap-[4px] items-start w-full">
                  <CurrencyField currency={currency} onChange={setCurrency} />
                  <HelperText>
                    Only products with pricing in this currency can be added to this contract.
                  </HelperText>
                </div>
              </div>
            </div>

            {/* ── Contract Duration ── */}
            <div className="flex flex-col gap-[16px] items-start w-full">
              <SectionHeader label="Contract Duration" />
              <div className="flex gap-[8px] items-start w-full">
                <div className="flex-[1_0_0] min-w-0">
                  <DateField label="Start Date" value={startDate} onChange={handleStartDateChange} />
                </div>
                <div className="flex-[1_0_0] min-w-0">
                  <DateField label="End Date" value={endDate} onChange={setEndDate} />
                </div>
              </div>
              <div className="flex flex-col gap-[4px] items-start w-full">
                <DateField label="Billing Start Date" value={billingStartDate} onChange={handleBillingStartDateChange} />
                <HelperText>
                  When the first invoice will be generated. Defaults to contract start date.
                </HelperText>
              </div>
            </div>

            {/* ── Additional Details ── */}
            <div className="flex flex-col items-start w-full">
              <button
                onClick={() => setAdditionalOpen((v) => !v)}
                className="flex gap-[10px] items-center px-[4px] w-full bg-transparent border-0 cursor-pointer text-left"
              >
                <p className={`font-['Figtree:SemiBold',sans-serif] font-semibold text-[14px] leading-[14px] whitespace-nowrap ${additionalOpen ? 'text-[#1e293b]' : 'text-[#7c8ba1]'}`}>
                  Additional Details
                </p>
                <div className={`transition-transform ${additionalOpen ? 'rotate-180' : ''}`}>
                  <div className="overflow-clip relative size-[16px]">
                    <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
                      <div className="absolute inset-[-12.5%_-6.25%]">
                        <img alt="" className="block max-w-none size-full" src={imgChevronAlt} />
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {additionalOpen && (
                <div className="flex flex-col gap-[16px] items-start w-full mt-[16px]">
                  {/* Contract Name */}
                  <InputField
                    label="Contract Name"
                    value={contractName}
                    onChange={setContractName}
                    placeholder="Enter contract name..."
                  />

                  {/* Description */}
                  <div className="flex flex-col gap-[4px] items-start w-full">
                    <TextareaField
                      label="Description"
                      value={description}
                      onChange={setDescription}
                      placeholder="Internal notes about this contract..."
                    />
                    <HelperText>
                      Name and description are for internal use and are not visible to customers.
                    </HelperText>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <div className="flex items-center px-[4px] w-full">
                      <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#7c8ba1] text-[12px] leading-[normal]">
                        Tags
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-[8px] items-center">
                      {tags.map((tag) => (
                        <div key={tag} className="bg-[#f1f5f9] border border-[#e2e8f0] flex gap-[4px] items-center px-[8px] py-[6px] rounded-[16px]">
                          <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#334155] text-[12px] leading-[16px]">{tag}</p>
                          <button
                            onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                            className="flex items-center justify-center bg-transparent border-0 cursor-pointer p-0 ml-[2px] text-[#64748b] leading-none text-[14px]"
                          >×</button>
                        </div>
                      ))}
                      {showTagInput ? (
                        <form onSubmit={addTag}>
                          <input
                            autoFocus
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onBlur={addTag}
                            placeholder="Tag name..."
                            className="font-['Figtree:Regular',sans-serif] font-normal text-[#334155] text-[12px] leading-[16px] bg-[#f8fafc] border border-[#e2e8f0] px-[8px] py-[6px] rounded-[16px] outline-none w-[100px]"
                          />
                        </form>
                      ) : (
                        <button
                          onClick={() => setShowTagInput(true)}
                          className="bg-[#f8fafc] border border-[#e2e8f0] border-solid flex gap-[4px] items-center px-[8px] py-[6px] rounded-[16px] cursor-pointer"
                        >
                          <div className="overflow-clip relative shrink-0 size-[12px]">
                            <div className="absolute bg-[#64748b] inset-[45.31%_18.75%] rounded-[1px]" />
                            <div className="absolute flex inset-[18.75%_45.31%] items-center justify-center">
                              <div className="-rotate-90 flex-none h-[1.5px] w-[10px]">
                                <div className="bg-[#64748b] rounded-[1px] size-full" />
                              </div>
                            </div>
                          </div>
                          <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px]">
                            Add Tag
                          </p>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Custom Attributes */}
                  <div className="border border-[#e2e8f0] flex flex-col gap-[16px] items-start p-[16px] rounded-[12px] w-full">
                    <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#7c8ba1] text-[12px] leading-[normal]">
                      Custom Attributes
                    </p>
                    <InputField label="Sales Region" value="" onChange={() => {}} placeholder="e.g. North America" labelColor="#334155" />
                    <InputField label="Contract Type" value="" onChange={() => {}} placeholder="e.g. Enterprise, SMB" labelColor="#334155" />
                    <div className="bg-[#f5f7fb] flex items-start px-[12px] py-[10px] rounded-[8px] w-full min-h-[54px] cursor-text">
                      <div className="flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-0 w-full">
                        <label className="font-['Figtree:Medium',sans-serif] font-medium text-[#334155] text-[12px] leading-[normal] cursor-text">
                          Payment Terms
                        </label>
                        <textarea
                          placeholder="e.g. Net 30, Net 60..."
                          rows={1}
                          className="font-['Figtree:Medium',sans-serif] font-medium text-[#1e293b] text-[14px] leading-[16px] w-full bg-transparent border-0 outline-none p-0 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="bg-white flex gap-[8px] items-center justify-end p-[16px] shrink-0">
          <button
            onClick={onClose}
            className="flex h-[32px] items-center justify-center px-[16px] py-[4px] rounded-[4px] cursor-pointer bg-transparent border-0"
          >
            <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[12px] tracking-[0.2px] uppercase leading-[12px]">
              Cancel
            </p>
          </button>
          <button className="bg-[#ed765e] flex h-[32px] items-center justify-center px-[16px] rounded-[4px] cursor-pointer border-0">
            <p className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[12px] tracking-[0.2px] uppercase leading-[12px]">
              Continue
            </p>
          </button>
        </div>

      </div>
    </>
  );
}
