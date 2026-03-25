import { useState, useRef } from 'react';

// ─── Icon Components ──────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" className="text-[#94a3b8] hover:text-[#64748b]">
      <path d="M7 7L18 18M7 18L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12 2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7l-5-5z" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2v5h5M7 11h6M7 14h6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 11v3h12v-3M8 2v9M8 2L5 5M8 2l3 3" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CUSTOMER_CURRENCY = {
  'Joe Root': 'INR',
  'Patricia Sanders': 'USD',
  'Kurt Bates': 'USD',
  'Iva Ryan': 'EUR',
  'Rhonda Rhodes': 'GBP',
  'Daniel Hamilton': 'USD',
  'Jerry Helfer': 'EUR',
  'Corina McCoy': 'AUD',
  'Kathy Pacheco': 'USD',
  'John Dukes': 'CAD',
};

const CUSTOMERS = Object.keys(CUSTOMER_CURRENCY);
const CURRENCIES = ['AED', 'AUD', 'CAD', 'EUR', 'GBP', 'INR', 'JPY', 'SGD', 'USD'];

const CADENCE_OPTIONS = [
  { value: 'Day', label: 'Day' },
  { value: 'Week', label: 'Week' },
  { value: 'Month', label: 'Month' },
  { value: 'Quarter', label: 'Quarter' },
  { value: 'Year', label: 'Year' },
];

const OFFSET_OPTIONS = [
  { value: 'Postpaid', label: 'Postpaid' },
  { value: 'Prepaid', label: 'Prepaid' },
];

// ─── Date helpers ─────────────────────────────────────────────────────────────

function firstOfMonth(offsetMonths = 0) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
}

function fmtDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toInputDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromInputDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// ─── Shared field shell ───────────────────────────────────────────────────────

function Chevron() {
  return (
    <div className="text-[#94a3b8]">
      <ChevronDownIcon />
    </div>
  );
}

function FieldShell({ label, valueText, placeholder, showChevron = true, onClick, children }) {
  const isFilled = !!valueText;
  return (
    <div
      className="bg-[#f5f7fb] flex h-[54px] items-center justify-between px-[12px] py-[10px] rounded-[8px] w-full relative cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-[1_0_0] flex-col gap-[2px] items-start max-w-[300px] min-w-0 pointer-events-none">
        <p className={`font-['Figtree:Medium',sans-serif] font-medium text-[12px] leading-[normal] ${isFilled ? 'text-[#7c8ba1]' : 'text-[#1e293b]'}`}>
          {label}
        </p>
        <div className="flex flex-col h-[18px] items-start justify-center py-px w-full">
          <p className={`font-['Figtree:Medium',sans-serif] font-medium text-[14px] leading-[16px] w-full ${isFilled ? 'text-[#1e293b]' : 'text-[#94a3b8]'}`}>
            {valueText || placeholder}
          </p>
        </div>
      </div>
      {showChevron && <div className="pointer-events-none"><Chevron /></div>}
      {children}
    </div>
  );
}

// ─── Radio button ─────────────────────────────────────────────────────────────

function RadioButton({ label, checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className="flex gap-[7px] items-center bg-transparent border-0 cursor-pointer p-0"
    >
      <div className={`w-[16px] h-[16px] rounded-full flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-[2px] border-[#ed765e]' : 'border border-[#cbd5e1]'
        }`}>
        {checked && <div className="w-[7px] h-[7px] rounded-full bg-[#ed765e]" />}
      </div>
      <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#334155] text-[13px] leading-[16px] whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

// ─── Select field ─────────────────────────────────────────────────────────────

function SelectField({ label, value, onChange, options }) {
  const displayLabel = options.find(o => o.value === value)?.label || value;
  return (
    <FieldShell label={label} valueText={displayLabel}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[1]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </FieldShell>
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

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  const isFilled = !!value;
  return (
    <div className="bg-[#f5f7fb] flex h-[54px] items-center px-[12px] py-[10px] rounded-[8px] w-full cursor-text">
      <div className="flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-0 w-full">
        <label className={`font-['Figtree:Medium',sans-serif] font-medium text-[12px] leading-[normal] cursor-text ${isFilled ? 'text-[#7c8ba1]' : 'text-[#1e293b]'}`}>
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-['Figtree:Medium',sans-serif] font-medium text-[#1e293b] text-[14px] leading-[16px] w-full bg-transparent border-0 outline-none p-0 placeholder:text-[#94a3b8]"
        />
      </div>
    </div>
  );
}

// ─── Textarea field ───────────────────────────────────────────────────────────

function TextareaField({ label, value, onChange, placeholder }) {
  const isFilled = !!value;
  return (
    <div className="bg-[#f5f7fb] flex items-start px-[12px] py-[10px] rounded-[8px] w-full min-h-[54px] cursor-text">
      <div className="flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-0 w-full">
        <label className={`font-['Figtree:Medium',sans-serif] font-medium text-[12px] leading-[normal] cursor-text ${isFilled ? 'text-[#7c8ba1]' : 'text-[#1e293b]'}`}>
          {label}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="font-['Figtree:Medium',sans-serif] font-medium text-[#1e293b] text-[14px] leading-[16px] w-full bg-transparent border-0 outline-none p-0 resize-none placeholder:text-[#94a3b8]"
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

// ─── Sub-section label ────────────────────────────────────────────────────────

function SubLabel({ children }) {
  return (
    <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#7c8ba1] text-[12px] leading-[normal]">
      {children}
    </p>
  );
}

// ─── Pane ─────────────────────────────────────────────────────────────────────

export default function NewContractPane({ isOpen, onClose, onCreate }) {
  const [customer, setCustomer] = useState('');
  const [currency, setCurrency] = useState('');
  const [startDate, setStartDate] = useState(firstOfMonth(0));
  const [endDate, setEndDate] = useState(firstOfMonth(12));
  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [contractName, setContractName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // ── Billing start date (defaults to contract start date, syncs when start date changes)
  const [billingStartDate, setBillingStartDate] = useState(firstOfMonth(0));

  // ── Default billing cadence (optional)
  const [cadenceType, setCadenceType] = useState(''); // '' | 'recurring' | 'one-time'
  const [billingOffset, setBillingOffset] = useState('Postpaid');
  const [billingEvery, setBillingEvery] = useState('1');
  const [billingCadence, setBillingCadence] = useState('Month');

  // The effective contract name: custom override, or auto-generated from customer
  const effectiveName = contractName.trim() || (customer ? customer : '');

  const canContinue = !!customer && !!currency;

  // When start date changes, keep billing start date in sync if not manually overridden
  function handleStartDateChange(d) {
    if (billingStartDate.getTime() === startDate.getTime()) {
      setBillingStartDate(d);
    }
    setStartDate(d);
  }

  function handleCustomerChange(c) {
    setCustomer(c);
    if (c) setCurrency(CUSTOMER_CURRENCY[c]);
    setContractName('');
  }

  function addTag(e) {
    e?.preventDefault();
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
    setShowTagInput(false);
  }

  function handleContinue() {
    if (!canContinue) return;
    const name = effectiveName || `Contract_${Date.now()}`;
    onCreate?.({
      name,
      customer,
      currency,
      startDate,
      endDate,
      billingStartDate,
      defaultBillingCadence: cadenceType
        ? { type: cadenceType, offset: billingOffset, every: billingEvery, cadence: billingCadence }
        : null,
    });
    // reset state
    setCustomer('');
    setCurrency('');
    setStartDate(firstOfMonth(0));
    setEndDate(firstOfMonth(12));
    setContractName('');
    setDescription('');
    setTags([]);
    setAdditionalOpen(false);
    setBillingStartDate(firstOfMonth(0));
    setCadenceType('');
    setBillingOffset('Postpaid');
    setBillingEvery('1');
    setBillingCadence('Month');
    onClose();
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
            <CloseIcon />
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto border-b border-[#e2e8f0]">
          <div className="flex flex-col gap-[24px] items-start px-[36px] py-[24px] w-full">

            {/* Upload card */}
            <div className="bg-[#f9f9f9] border border-[#f1f5f9] flex items-center justify-between p-[16px] rounded-[8px] w-full">
              <div className="flex flex-[1_0_0] gap-[16px] items-center min-w-0">
                <div className="border border-[#e2e8f0] flex items-center justify-center p-[12px] rounded-[6px] shrink-0">
                  <FileTextIcon />
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
                    <UploadIcon />
                    <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#334155] text-[12px] tracking-[0.2px] uppercase leading-[12px]">
                      Upload
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Or Create Manually divider */}
            <div className="flex gap-[13px] items-center w-full">
              <div className="flex-[1_0_0] h-px bg-[#e2e8f0]" />
              <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#7c8ba1] text-[12px] leading-[normal] shrink-0">
                Or Create Manually
              </p>
              <div className="flex-[1_0_0] h-px bg-[#e2e8f0]" />
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

            {/* ── Contract Period ── */}
            <div className="flex flex-col gap-[12px] items-start w-full">
              <SectionHeader label="Contract Period" />
              <div className="flex gap-[8px] items-start w-full">
                <div className="flex-[1_0_0] min-w-0">
                  <DateField label="Contract Start Date" value={startDate} onChange={handleStartDateChange} />
                </div>
                <div className="flex-[1_0_0] min-w-0">
                  <DateField label="Contract End Date" value={endDate} onChange={setEndDate} />
                </div>
              </div>
              <div className="flex flex-col gap-[4px] items-start w-full">
                <DateField
                  label="Billing Start Date"
                  value={billingStartDate}
                  onChange={setBillingStartDate}
                />
                <HelperText>The date from which billing begins. Defaults to the contract start date.</HelperText>
              </div>
            </div>

            {/* ── Default Billing Cadence ── */}
            <div className="flex flex-col gap-[12px] items-start w-full">
              <SectionHeader label="Default Billing Cadence" />

              {/* Radio buttons */}
              <div className="flex gap-[16px] items-center px-[4px]">
                <RadioButton
                  label="Recurring"
                  checked={cadenceType === 'recurring'}
                  onChange={() => setCadenceType(cadenceType === 'recurring' ? '' : 'recurring')}
                />
                <RadioButton
                  label="One time"
                  checked={cadenceType === 'one-time'}
                  onChange={() => setCadenceType(cadenceType === 'one-time' ? '' : 'one-time')}
                />
              </div>

              {/* Empty state helper */}
              {!cadenceType && (
                <HelperText>Optional. Products without a billing cadence will use this default billing cadence.</HelperText>
              )}

              {/* Recurring: Offset + Every + Cadence */}
              {cadenceType === 'recurring' && (
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex-[1_0_0] min-w-0">
                    <SelectField
                      label="Offset"
                      value={billingOffset}
                      onChange={setBillingOffset}
                      options={OFFSET_OPTIONS}
                    />
                  </div>
                  <div className="flex-[1_0_0] min-w-0">
                    <InputField
                      label="Every"
                      value={billingEvery}
                      onChange={setBillingEvery}
                      type="number"
                      placeholder="e.g. 1"
                    />
                  </div>
                  <div className="flex-[1_0_0] min-w-0">
                    <SelectField
                      label="Cadence"
                      value={billingCadence}
                      onChange={setBillingCadence}
                      options={CADENCE_OPTIONS}
                    />
                  </div>
                </div>
              )}

              {/* One-time: Offset only */}
              {cadenceType === 'one-time' && (
                <SelectField
                  label="Offset"
                  value={billingOffset}
                  onChange={setBillingOffset}
                  options={OFFSET_OPTIONS}
                />
              )}

              {/* Filled state helper */}
              {cadenceType && (
                <HelperText>Products without a billing cadence will inherit this. You can still override it per product.</HelperText>
              )}
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
                <div className={`transition-transform ${additionalOpen ? 'rotate-180' : ''} ${additionalOpen ? 'text-[#1e293b]' : 'text-[#7c8ba1]'}`}>
                  <ChevronDownIcon />
                </div>
              </button>

              {additionalOpen && (
                <div className="flex flex-col gap-[20px] items-start w-full mt-[16px]">

                  {/* ── Contract Name, Description, Tags ── */}
                  <div className="flex flex-col gap-[16px] items-start w-full">
                    {/* Contract Name — pre-filled with customer name */}
                    <InputField
                      label="Contract Name"
                      value={contractName || customer}
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
                        <SubLabel>Tags</SubLabel>
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
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M5 1V9M1 5H9" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[16px]">
                              Add Tag
                            </p>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Custom Attributes ── */}
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <div className="flex items-center px-[4px] w-full">
                      <SubLabel>Custom Attributes</SubLabel>
                    </div>
                    <div className="flex flex-col gap-[12px] items-start w-full">
                      <InputField label="Sales Region" value="" onChange={() => { }} placeholder="e.g. North America" />
                      <InputField label="Contract Type" value="" onChange={() => { }} placeholder="e.g. Enterprise, SMB" />
                      <div className="bg-[#f5f7fb] flex items-start px-[12px] py-[10px] rounded-[8px] w-full min-h-[54px] cursor-text">
                        <div className="flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-0 w-full">
                          <label className="font-['Figtree:Medium',sans-serif] font-medium text-[#1e293b] text-[12px] leading-[normal] cursor-text">
                            Payment Terms
                          </label>
                          <textarea
                            placeholder="e.g. Net 30, Net 60..."
                            rows={1}
                            className="font-['Figtree:Medium',sans-serif] font-medium text-[#1e293b] text-[14px] leading-[16px] w-full bg-transparent border-0 outline-none p-0 resize-none placeholder:text-[#94a3b8]"
                          />
                        </div>
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
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`flex h-[32px] items-center justify-center px-[16px] rounded-[4px] border-0 transition-colors ${canContinue
                ? 'bg-[#ed765e] cursor-pointer hover:bg-[#e56a52]'
                : 'bg-[#f1f5f9] cursor-not-allowed'
              }`}
          >
            <p className={`font-['Figtree:Bold',sans-serif] font-bold text-[12px] tracking-[0.2px] uppercase leading-[12px] ${canContinue ? 'text-white' : 'text-[#b0bac6]'}`}>
              Continue
            </p>
          </button>
        </div>

      </div>
    </>
  );
}
