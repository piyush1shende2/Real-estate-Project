import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, 
  ArrowLeft,
  Info,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  Percent,
  Coins,
  ShieldCheck,
  Sparkles,
  Phone,
  User,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { dispatchXPAward } from '../lib/gamification';
import { trackAction } from '../lib/vts';
// @ts-ignore
import handHoldingHouseImg from '../assets/images/hand_holding_house_1779780057192.png';

interface CalculatorViewProps {
  onBackToHome: () => void;
}

// Helper to format currency in space-bracketed Indian Rupees, e.g. "₹ 50,00,000"
function formatIndianRupees(val: number): string {
  const formattedNum = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(val);
  return `₹ ${formattedNum}`;
}

// Simple cleaner to extract only digits from written input string
function parseRawNumbers(val: string): number {
  const cleaned = val.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

// Cleaner for floating point inputs (Rate of Interest)
function parseRawFloat(val: string): number {
  const cleaned = val.replace(/[^0-9.]/g, '');
  // Prevent multiple double decimal dots
  const parts = cleaned.split('.');
  const safeStr = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
  const parsed = parseFloat(safeStr);
  return isNaN(parsed) ? 0 : parsed;
}

export default function CalculatorView({ onBackToHome }: CalculatorViewProps) {
  // Award XP for utilizing calculators (gamification Phase 1 & 3)
  useEffect(() => {
    dispatchXPAward('use_calculator');
    trackAction('Calculator Opened', 'User opened the Mortgage & Affordability Calculator');
  }, []);

  // --- CHOOSE ACTIVE CALCULATOR TAB ---
  const [activeTab, setActiveTab] = useState<'emi' | 'affordability'>('emi');

  useEffect(() => {
    trackAction('Calculator Tab Switched', `User switched to: ${activeTab === 'emi' ? 'Home Loan EMI Calculator' : 'Affordability Calculator'}`);
  }, [activeTab]);

  // --- STATE FOR MAGICLOANS AD OFFER POPUP ---
  const [showMagicLoansModal, setShowMagicLoansModal] = useState(false);
  const [modalMode, setModalMode] = useState<'main' | 'eligibility' | 'results' | 'allOffers'>('main');
  const [eligSalary, setEligSalary] = useState(120000);
  const [eligProfession, setEligProfession] = useState('Salaried Employee');
  const [eligExistingEmi, setEligExistingEmi] = useState(15000);
  const [eligName, setEligName] = useState('');
  const [eligPhone, setEligPhone] = useState('');
  const [eligSubmitted, setEligSubmitted] = useState(false);
  const [eligStep, setEligStep] = useState(1);
  const [eligCallbackBooked, setEligCallbackBooked] = useState(false);

  // --- STATE FOR HOME LOAN EMI CALCULATOR ---
  const [emiBank, setEmiBank] = useState('');
  const [emiLoanAmount, setEmiLoanAmount] = useState(5000000); // Default: 50 Lakhs
  const [emiTenure, setEmiTenure] = useState(10);          // Default: 10 Years
  const [emiRate, setEmiRate] = useState(9.0);             // Default: 9%
  const [emiFeesRate, setEmiFeesRate] = useState(0.5);     // Default: 0.5%

  // Synced string representations for direct numeric typing
  const [typeEmiLoan, setTypeEmiLoan] = useState('50,00,000');
  const [typeEmiTenure, setTypeEmiTenure] = useState('10');
  const [typeEmiRate, setTypeEmiRate] = useState('9');
  const [typeEmiFeesRate, setTypeEmiFeesRate] = useState('0.5');

  // --- STATE FOR AFFORDABILITY CALCULATOR ---
  const [affordBank, setAffordBank] = useState('');
  const [affordDownPayment, setAffordDownPayment] = useState(1500000); // Default: 15 L
  const [affordTenure, setAffordTenure] = useState(20);               // Default: 20 Years
  const [affordRate, setAffordRate] = useState(8.5);                 // Default: 8.5%
  const [affordFeesRate, setAffordFeesRate] = useState(0.5);         // Default: 0.5%
  const [affordMonthlySalary, setAffordMonthlySalary] = useState(150000); // Default: 1.5 L
  const [affordOtherEmis, setAffordOtherEmis] = useState(20000);       // Default: 20 K

  // Synced string representations for direct numeric typing (Affordability)
  const [typeAffordDown, setTypeAffordDown] = useState('15,00,000');
  const [typeAffordTenure, setTypeAffordTenure] = useState('20');
  const [typeAffordRate, setTypeAffordRate] = useState('8.5');
  const [typeAffordFeesRate, setTypeAffordFeesRate] = useState('0.5');
  const [typeAffordSalary, setTypeAffordSalary] = useState('1,50,000');
  const [typeAffordOther, setTypeAffordOther] = useState('20,000');

  // --- SYNC STRINGS FROM SLIDER ACTIONS gracefully ---
  useEffect(() => {
    setTypeEmiLoan(new Intl.NumberFormat('en-IN').format(emiLoanAmount));
  }, [emiLoanAmount]);

  useEffect(() => {
    setTypeEmiTenure(emiTenure.toString());
  }, [emiTenure]);

  useEffect(() => {
    setTypeEmiRate(emiRate.toString());
  }, [emiRate]);

  useEffect(() => {
    setTypeEmiFeesRate(emiFeesRate.toString());
  }, [emiFeesRate]);

  useEffect(() => {
    setTypeAffordDown(new Intl.NumberFormat('en-IN').format(affordDownPayment));
  }, [affordDownPayment]);

  useEffect(() => {
    setTypeAffordTenure(affordTenure.toString());
  }, [affordTenure]);

  useEffect(() => {
    setTypeAffordRate(affordRate.toString());
  }, [affordRate]);

  useEffect(() => {
    setTypeAffordFeesRate(affordFeesRate.toString());
  }, [affordFeesRate]);

  useEffect(() => {
    setTypeAffordSalary(new Intl.NumberFormat('en-IN').format(affordMonthlySalary));
  }, [affordMonthlySalary]);

  useEffect(() => {
    setTypeAffordOther(new Intl.NumberFormat('en-IN').format(affordOtherEmis));
  }, [affordOtherEmis]);


  // --- CALCULATE EMI ---
  const emiCalculated = useMemo(() => {
    const P = emiLoanAmount;
    const r = (emiRate / 12) / 100;
    const n = emiTenure * 12;
    
    // Monthly EMI formula
    let monthlyEmiValue = 0;
    if (r > 0) {
      monthlyEmiValue = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      if (n > 0) monthlyEmiValue = P / n;
    }

    if (isNaN(monthlyEmiValue) || !isFinite(monthlyEmiValue)) {
      monthlyEmiValue = 0;
    }

    const totalRepayment = monthlyEmiValue * n;
    const totalInterestPayable = Math.floor(Math.max(0, totalRepayment - P));
    
    // Processing fees - based on selectable or typed percentage rate
    const processingFees = Math.round(P * (emiFeesRate / 100));

    // Percent proportions
    const totalSum = P + totalInterestPayable + processingFees;
    const pctLoanAmount = totalSum > 0 ? (P / totalSum) * 100 : 0;
    const pctInterest = totalSum > 0 ? (totalInterestPayable / totalSum) * 100 : 0;
    const pctFees = totalSum > 0 ? (processingFees / totalSum) * 100 : 0;

    return {
      monthlyEmi: Math.round(monthlyEmiValue),
      totalRepayment: Math.round(totalRepayment),
      totalInterest: totalInterestPayable,
      processingFees,
      pctLoanAmount,
      pctInterest,
      pctFees,
      totalSum
    };
  }, [emiLoanAmount, emiTenure, emiRate, emiFeesRate]);


  // --- CALCULATE HOME BUYING AFFORDABILITY ---
  const affordabilityCalculated = useMemo(() => {
    // Max monthly allowance is standard 50% of monthly salary minus existing EMIs
    const allowedMonthlyEmi = Math.max(0, (affordMonthlySalary * 0.50) - affordOtherEmis);
    
    const r = (affordRate / 12) / 100;
    const n = affordTenure * 12;

    let affordableLoanAmount = 0;
    if (r > 0) {
      affordableLoanAmount = allowedMonthlyEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    } else {
      affordableLoanAmount = allowedMonthlyEmi * n;
    }

    if (isNaN(affordableLoanAmount) || !isFinite(affordableLoanAmount)) {
      affordableLoanAmount = 0;
    }

    // Affording capacity = Loan Amount + Down Payment
    const maxAffordability = Math.round(affordableLoanAmount + affordDownPayment);

    // Amortizations for that affordable loan
    const totalRepay = allowedMonthlyEmi * n;
    const totalInterest = Math.max(0, totalRepay - affordableLoanAmount);
    const processingFees = Math.round(affordableLoanAmount * (affordFeesRate / 100));

    const totalCalculatedCost = affordableLoanAmount + totalInterest + processingFees + affordDownPayment;

    return {
      maxAffordability,
      affordableLoanAmount: Math.round(affordableLoanAmount),
      totalInterest: Math.round(totalInterest),
      processingFees: Math.round(processingFees),
      allowedMonthlyEmi: Math.round(allowedMonthlyEmi),
      pctLoan: totalCalculatedCost > 0 ? (affordableLoanAmount / totalCalculatedCost) * 100 : 0,
      pctInterest: totalCalculatedCost > 0 ? (totalInterest / totalCalculatedCost) * 100 : 0,
      pctFees: totalCalculatedCost > 0 ? (processingFees / totalCalculatedCost) * 100 : 0,
      pctDown: totalCalculatedCost > 0 ? (affordDownPayment / totalCalculatedCost) * 100 : 0,
      totalCalculatedCost
    };
  }, [affordDownPayment, affordTenure, affordRate, affordMonthlySalary, affordOtherEmis, affordFeesRate]);


  // --- CALCULATE DYNAMIC SLIDER FILL GRADIENTS ---
  // Fill is left-side deep teal [#004C5C] and right-side slot-thin gray-[#E2E8F0]
  const getSliderBg = (val: number, min: number, max: number) => {
    const percentage = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    return {
      background: `linear-gradient(to right, #004C5C 0%, #004C5C ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`
    };
  };

  // --- RENDER DYNAMIC SOLID EMI PIE CHART ---
  // Pie slices are colored:
  // - Total Interest: Brand Deep Teal (#004C5C)
  // - Loan Amount: Brand Deep Navy (#0E1F35)
  // - Processing Fees: Brand Orange (#F97316)
  // Since strokeWidth is equal to radius*2, it creates full solid pie wedges with zero center hole!
  //
  // NOTE: Standard processing fees are ~0.3% - 0.5% of the total sum, which produces a segment too small to render clearly
  // on standard screens. We apply a visual minimum of 4% if processing fees exist, so the orange wedge is beautifully visible
  // and perfectly presented.
  const emiPieSvgCircles = useMemo(() => {
    const radius = 25;
    const circumference = 2 * Math.PI * radius; // ~157.08
    
    const pctLoan = emiCalculated.pctLoanAmount;
    const pctInterest = emiCalculated.pctInterest;
    const pctFees = emiCalculated.pctFees;

    let visualPctFees = 0;
    if (pctFees > 0) {
      // Starts at a base of 3.5% and grows dynamically based on actual fee percentage
      visualPctFees = 3.5 + (pctFees * 3.5);
    }
    
    let visualPctLoan = pctLoan;
    let visualPctInterest = pctInterest;

    const difference = visualPctFees - pctFees;
    const otherSum = pctLoan + pctInterest;
    if (otherSum > 0 && difference > 0) {
      visualPctLoan = Math.max(0, pctLoan - (difference * (pctLoan / otherSum)));
      visualPctInterest = Math.max(0, pctInterest - (difference * (pctInterest / otherSum)));
    }

    const loanStrokeLength = (visualPctLoan * circumference) / 100;
    const interestStrokeLength = (visualPctInterest * circumference) / 100;
    const feesStrokeLength = (visualPctFees * circumference) / 100;

    return (
      <>
        {/* Loan Amount Portion */}
        {visualPctLoan > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#0E1F35"
            strokeWidth="50"
            strokeDasharray={`${loanStrokeLength} ${circumference}`}
            strokeDashoffset={0}
          />
        )}
        {/* Total Interest Portion */}
        {visualPctInterest > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#004C5C"
            strokeWidth="50"
            strokeDasharray={`${interestStrokeLength} ${circumference}`}
            strokeDashoffset={-loanStrokeLength}
          />
        )}
        {/* Processing Fees Portion (Amber/Yellow section to reflect changes instantly) */}
        {visualPctFees > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="50"
            strokeDasharray={`${feesStrokeLength} ${circumference}`}
            strokeDashoffset={-(loanStrokeLength + interestStrokeLength)}
          />
        )}
      </>
    );
  }, [emiCalculated]);


  // --- RENDER DYNAMIC SOLID AFFORDABILITY PIE CHART ---
  const affordPieSvgCircles = useMemo(() => {
    const radius = 25;
    const circumference = 2 * Math.PI * radius; // ~157.08
    
    const pctLoan = affordabilityCalculated.pctLoan;
    const pctInterest = affordabilityCalculated.pctInterest;
    const pctFees = affordabilityCalculated.pctFees;
    const pctDown = affordabilityCalculated.pctDown;

    let visualPctFees = 0;
    if (pctFees > 0) {
      // Starts at a base of 3.5% and grows dynamically based on actual fee percentage
      visualPctFees = 3.5 + (pctFees * 3.5);
    }

    let visualPctLoan = pctLoan;
    let visualPctInterest = pctInterest;
    let visualPctDown = pctDown;

    const difference = visualPctFees - pctFees;
    const otherSum = pctLoan + pctInterest + pctDown;
    if (otherSum > 0 && difference > 0) {
      visualPctLoan = Math.max(0, pctLoan - (difference * (pctLoan / otherSum)));
      visualPctInterest = Math.max(0, pctInterest - (difference * (pctInterest / otherSum)));
      visualPctDown = Math.max(0, pctDown - (difference * (pctDown / otherSum)));
    }

    const loanStroke = (visualPctLoan * circumference) / 100;
    const interestStroke = (visualPctInterest * circumference) / 100;
    const downStroke = (visualPctDown * circumference) / 100;
    const feesStroke = (visualPctFees * circumference) / 100;

    return (
      <>
        {/* Affordable Loan */}
        {visualPctLoan > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#0E1F35"
            strokeWidth="50"
            strokeDasharray={`${loanStroke} ${circumference}`}
            strokeDashoffset={0}
          />
        )}
        {/* Interest portion */}
        {visualPctInterest > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#004C5C"
            strokeWidth="50"
            strokeDasharray={`${interestStroke} ${circumference}`}
            strokeDashoffset={-loanStroke}
          />
        )}
        {/* Down Payment portion */}
        {visualPctDown > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#B38330"
            strokeWidth="50"
            strokeDasharray={`${downStroke} ${circumference}`}
            strokeDashoffset={-(loanStroke + interestStroke)}
          />
        )}
        {/* Fees portion (Amber/Yellow section to reflect changes instantly) */}
        {visualPctFees > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="50"
            strokeDasharray={`${feesStroke} ${circumference}`}
            strokeDashoffset={-(loanStroke + interestStroke + downStroke)}
          />
        )}
      </>
    );
  }, [affordabilityCalculated]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      
      {/* HEADER NAVIGATION ROW */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-6">
        <button 
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#004C5C] transition-all cursor-pointer"
          id="btn-back-home"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home Page
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 space-y-8">
        
        {/* LANDING INFO HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0E1F35] tracking-tight">
            Smart Mortgage Calculators
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed">
            Drag the range sliders dynamically or type your precise numeric parameters straight into the underlined fields below to guarantee absolute calculations parity instantly.
          </p>
        </div>

        {/* PILL CHOICE NAV TABS */}
        <div className="flex justify-center">
          <div className="bg-white p-1 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-1">
            <button
              onClick={() => setActiveTab('emi')}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === 'emi' 
                ? 'bg-[#0E1F35] text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
              }`}
              id="tab-emi-calculator"
            >
              Home Loan EMI Calculator
            </button>
            <button
              onClick={() => setActiveTab('affordability')}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === 'affordability' 
                ? 'bg-[#0E1F35] text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
              }`}
              id="tab-affordability-calculator"
            >
              Housing Affordability Capacity
            </button>
          </div>
        </div>


        {/* ============================================================== */}
        {/* TAB 1: HOME LOAN EMI CALCULATOR                                */}
        {/* ============================================================== */}
        {activeTab === 'emi' && (
          <div 
            className="bg-white rounded-[24px] overflow-hidden border border-gray-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0"
            id="emi-card-root"
          >
            
            {/* Left Column Input Panel */}
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-8 bg-white">
              
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#0e1f35] tracking-tight">
                  Home Loan EMI Calculator
                </h2>
              </div>

              {/* Minimal Dropdown select bank option */}
              <div className="relative border-b border-gray-200 pb-1.5 pt-1">
                <select 
                  value={emiBank}
                  onChange={(e) => setEmiBank(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-gray-400 py-2.5 pr-10 appearance-none focus:outline-none cursor-pointer"
                  id="select-emi-bank"
                >
                  <option value="">Select Bank (Optional)</option>
                  <option value="partner">Urban Nest Partner Advantage Bank (9.0% Default)</option>
                  <option value="state">Indian Federal Trust Mortgage (8.8% Special)</option>
                  <option value="coop">Royal Housing Credential Vault (9.25% Gold)</option>
                </select>
                <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Sliders and text value layout row components */}
              <div className="space-y-8">
                
                {/* Block 1: Loan Amount */}
                <div className="space-y-2">
                  <label htmlFor="input-emi-loan" className="text-[15px] font-extrabold text-[#0E1F35] tracking-wide block">
                    Loan Amount (₹)
                  </label>
                  
                  {/* Slider Control */}
                  <input 
                    type="range"
                    min={100000}      // 1 Lakh
                    max={50000000}    // 5 Crore
                    step={10000}
                    value={Math.min(50000000, Math.max(100000, emiLoanAmount))}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEmiLoanAmount(val);
                    }}
                    style={getSliderBg(emiLoanAmount, 100000, 50000000)}
                    className="w-full h-1 bg-transparent appearance-none rounded-lg cursor-pointer focus:outline-none 
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#004C5C] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
                               [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#004C5C] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                    id="slider-emi-loan"
                  />

                  {/* Dynamic Limits directly below ends of track */}
                  <div className="flex justify-between text-[11px] font-black text-slate-400 mt-1 uppercase">
                    <span>1L</span>
                    <span>5Cr</span>
                  </div>

                  {/* Underlined Numeric Input */}
                  <div className="border-b border-gray-200 focus-within:border-[#004C5C] transition-colors py-1 mt-1">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-[#0E1F35] mr-1.5">₹</span>
                      <input
                        type="text"
                        value={typeEmiLoan}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTypeEmiLoan(val);
                          const parsed = parseRawNumbers(val);
                          setEmiLoanAmount(parsed);
                        }}
                        onBlur={() => {
                          setTypeEmiLoan(new Intl.NumberFormat('en-IN').format(emiLoanAmount));
                        }}
                        className="w-full text-xl font-extrabold text-[#0E1F35] bg-transparent focus:outline-none placeholder-slate-300"
                        placeholder="0"
                        id="input-emi-loan"
                      />
                    </div>
                  </div>
                </div>

                {/* Block 2: Tenure */}
                <div className="space-y-2">
                  <label htmlFor="input-emi-tenure" className="text-[15px] font-extrabold text-[#0E1F35] tracking-wide block">
                    Tenure (Years)
                  </label>

                  <input 
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.min(100, Math.max(0, emiTenure))}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEmiTenure(val);
                    }}
                    style={getSliderBg(emiTenure, 0, 100)}
                    className="w-full h-1 bg-transparent appearance-none rounded-lg cursor-pointer focus:outline-none 
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#004C5C] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
                               [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#004C5C] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                    id="slider-emi-tenure"
                  />

                  <div className="flex justify-between text-[11px] font-black text-slate-400 mt-1">
                    <span>0</span>
                    <span>100</span>
                  </div>

                  {/* Underlined Direct Editable Input */}
                  <div className="border-b border-gray-200 focus-within:border-[#004C5C] transition-colors py-1 mt-1">
                    <input
                      type="text"
                      value={typeEmiTenure}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTypeEmiTenure(val);
                        const parsed = parseRawNumbers(val);
                        setEmiTenure(parsed);
                      }}
                      onBlur={() => {
                        const clamped = Math.min(100, Math.max(0, emiTenure));
                        setEmiTenure(clamped);
                        setTypeEmiTenure(clamped.toString());
                      }}
                      className="w-full text-xl font-extrabold text-[#0E1F35] bg-transparent focus:outline-none placeholder-slate-300"
                      placeholder="0"
                      id="input-emi-tenure"
                    />
                  </div>
                </div>

                {/* Block 3: Rate of Interest */}
                <div className="space-y-2">
                  <label htmlFor="input-emi-rate" className="text-[15px] font-extrabold text-[#0E1F35] tracking-wide block">
                    Rate of Interest (%)
                  </label>

                  <input 
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={Math.min(100, Math.max(0, emiRate))}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEmiRate(val);
                    }}
                    style={getSliderBg(emiRate, 0, 100)}
                    className="w-full h-1 bg-transparent appearance-none rounded-lg cursor-pointer focus:outline-none 
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#004C5C] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
                               [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#004C5C] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                    id="slider-emi-rate"
                  />

                  <div className="flex justify-between text-[11px] font-black text-slate-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>

                  {/* Underlined Direct Editable Input */}
                  <div className="border-b border-gray-200 focus-within:border-[#004C5C] transition-colors py-1 mt-1">
                    <input
                      type="text"
                      value={typeEmiRate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTypeEmiRate(val);
                        const parsed = parseRawFloat(val);
                        setEmiRate(parsed);
                      }}
                      onBlur={() => {
                        const clamped = Math.min(100, Math.max(0, emiRate));
                        setEmiRate(clamped);
                        setTypeEmiRate(clamped.toString());
                      }}
                      className="w-full text-xl font-extrabold text-[#0E1F35] bg-transparent focus:outline-none placeholder-slate-300"
                      placeholder="0"
                      id="input-emi-rate"
                    />
                  </div>
                </div>

                {/* Block 4: Processing Fees (%) */}
                <div className="space-y-2">
                  <label htmlFor="input-emi-fees-rate" className="text-[15px] font-extrabold text-[#0E1F35] tracking-wide block">
                    Processing Fees (%)
                  </label>

                  <input 
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={Math.min(5, Math.max(0, emiFeesRate))}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEmiFeesRate(val);
                    }}
                    style={getSliderBg(emiFeesRate, 0, 5)}
                    className="w-full h-1 bg-transparent appearance-none rounded-lg cursor-pointer focus:outline-none 
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#004C5C] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
                               [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#004C5C] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                    id="slider-emi-fees-rate"
                  />

                  <div className="flex justify-between text-[11px] font-black text-slate-400 mt-1">
                    <span>0%</span>
                    <span>5%</span>
                  </div>

                  {/* Underlined Direct Editable Input */}
                  <div className="border-b border-gray-200 focus-within:border-[#004C5C] transition-colors py-1 mt-1">
                    <input
                      type="text"
                      value={typeEmiFeesRate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTypeEmiFeesRate(val);
                        const parsed = parseRawFloat(val);
                        setEmiFeesRate(parsed);
                      }}
                      onBlur={() => {
                        const clamped = Math.min(5, Math.max(0, emiFeesRate));
                        setEmiFeesRate(clamped);
                        setTypeEmiFeesRate(clamped.toString());
                      }}
                      className="w-full text-xl font-extrabold text-[#0E1F35] bg-transparent focus:outline-none placeholder-slate-300"
                      placeholder="0"
                      id="input-emi-fees-rate"
                    />
                  </div>
                </div>

              </div>

              {/* Informative advice note regarding Indian home mortgage structures */}
              <div className="flex gap-3 bg-[#004C5C]/5 p-4 rounded-xl border border-[#004C5C]/10 text-xs text-[#004C5C] font-semibold">
                <Info className="w-5 h-5 text-[#004C5C] shrink-0" />
                <p className="leading-relaxed">
                  Formula conforms mathematically to standard amortizations. Type figures natively inside underline slots or sliders to calculate changes immediately.
                </p>
              </div>
            </div>

            {/* Right Column: Visual Summary and Pie Chart Representation */}
            <div className="lg:col-span-5 bg-white p-8 sm:p-12 lg:border-l lg:border-gray-100 flex flex-col justify-between space-y-6">
              
              <div className="space-y-8 flex-1 flex flex-col justify-center">
                
                {/* Result Block: EMI Header */}
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Your EMI Per Month
                  </p>
                  <h3 
                    className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight"
                    id="emi-big-display"
                  >
                    {formatIndianRupees(emiCalculated.monthlyEmi)}
                  </h3>
                </div>

                {/* Styled Solid Pie Chart Illustration */}
                <div className="flex justify-center my-6">
                  <div className="relative w-56 h-56 transition-transform duration-300 hover:scale-105">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {emiPieSvgCircles}
                    </svg>
                  </div>
                </div>

                {/* Legends Grid as Shown in UI Screenshot */}
                <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-xs text-slate-500 font-bold max-w-sm mx-auto w-full">
                  
                  {/* Total Interest paid */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#004C5C] shrink-0" />
                      <span>Total Interest</span>
                    </div>
                    <p className="text-base font-extrabold text-[#0E1F35]" id="emi-legend-interest">
                      {formatIndianRupees(emiCalculated.totalInterest)}
                    </p>
                  </div>
                  
                  {/* Processing charges */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#F59E0B] shrink-0" />
                      <span>Processing Fees</span>
                    </div>
                    <p className="text-base font-extrabold text-[#0E1F35]" id="emi-legend-fees">
                      {formatIndianRupees(emiCalculated.processingFees)}
                    </p>
                  </div>

                  {/* Loan Amount */}
                  <div className="col-span-2 space-y-1 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#0E1F35] shrink-0" />
                      <span>Loan Amount</span>
                    </div>
                    <p className="text-lg font-black text-[#0E1F35]" id="emi-legend-principal">
                      {formatIndianRupees(emiLoanAmount)}
                    </p>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <button 
                onClick={() => {
                  setModalMode('main');
                  setEligStep(1);
                  setEligSubmitted(false);
                  setEligCallbackBooked(false);
                  setShowMagicLoansModal(true);
                }}
                className="w-full bg-[#004C5C] hover:bg-[#0E1F35] text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl shadow-md cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2"
                id="btn-apply-emi-loan"
              >
                <Sparkles className="w-4 h-4 text-[#B38330] animate-pulse" />
                <span>Inquire Loan Advantage</span>
              </button>
            </div>

          </div>
        )}


        {/* ============================================================== */}
        {/* TAB 2: AFFORDABILITY CALCULATOR                                */}
        {/* ============================================================== */}
        {activeTab === 'affordability' && (
          <div 
            className="bg-white rounded-[24px] overflow-hidden border border-gray-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0"
            id="afford-card-root"
          >
            
            {/* Left Column Controls */}
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-8 bg-white">
              
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#0e1f35] tracking-tight">
                  Purchase Affordability Calculator
                </h2>
              </div>

              {/* Minimal Dropdown */}
              <div className="relative border-b border-gray-200 pb-1.5 pt-1">
                <select 
                  value={affordBank}
                  onChange={(e) => setAffordBank(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-gray-400 py-2.5 pr-10 appearance-none focus:outline-none cursor-pointer"
                  id="select-afford-bank"
                >
                  <option value="">Select Partner Bank (Optional)</option>
                  <option value="partner">Indian Sovereign Housing Fund</option>
                  <option value="commercial">Industrial Corporate Realty Credit</option>
                </select>
                <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Sliders Grid layout */}
              <div className="space-y-8">
                
                {/* Parameter 1: Down Payment */}
                <div className="space-y-2">
                  <label htmlFor="input-afford-downpayment" className="text-[15px] font-extrabold text-[#0E1F35] tracking-wide block">
                    Down Payment (₹)
                  </label>

                  <input 
                    type="range"
                    min={100000}       // 1L
                    max={20000000}     // 2Cr
                    step={10000}
                    value={Math.min(20000000, Math.max(100000, affordDownPayment))}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAffordDownPayment(val);
                    }}
                    style={getSliderBg(affordDownPayment, 100000, 20000000)}
                    className="w-full h-1 bg-transparent appearance-none rounded-lg cursor-pointer focus:outline-none 
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#004C5C] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
                               [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#004C5C] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                    id="slider-afford-downpayment"
                  />

                  <div className="flex justify-between text-[11px] font-black text-slate-400 mt-1 uppercase">
                    <span>1L</span>
                    <span>2Cr</span>
                  </div>

                  {/* Underlined Direct Editable Input */}
                  <div className="border-b border-gray-200 focus-within:border-[#004C5C] transition-colors py-1 mt-1">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-[#0E1F35] mr-1.5">₹</span>
                      <input
                        type="text"
                        value={typeAffordDown}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTypeAffordDown(val);
                          const parsed = parseRawNumbers(val);
                          setAffordDownPayment(parsed);
                        }}
                        onBlur={() => {
                          setTypeAffordDown(new Intl.NumberFormat('en-IN').format(affordDownPayment));
                        }}
                        className="w-full text-xl font-extrabold text-[#0E1F35] bg-transparent focus:outline-none placeholder-slate-300"
                        placeholder="0"
                        id="input-afford-downpayment"
                      />
                    </div>
                  </div>
                </div>

                {/* Parameter 2: Monthly Salary */}
                <div className="space-y-2">
                  <label htmlFor="input-afford-salary" className="text-[15px] font-extrabold text-[#0E1F35] tracking-wide block">
                    Your Monthly Salary (₹)
                  </label>

                  <input 
                    type="range"
                    min={10000}
                    max={2000000} // 20L per month max
                    step={5000}
                    value={Math.min(2000000, Math.max(10000, affordMonthlySalary))}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAffordMonthlySalary(val);
                    }}
                    style={getSliderBg(affordMonthlySalary, 10000, 2000000)}
                    className="w-full h-1 bg-transparent appearance-none rounded-lg cursor-pointer focus:outline-none 
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#004C5C] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
                               [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#004C5C] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                    id="slider-afford-salary"
                  />

                  <div className="flex justify-between text-[11px] font-black text-slate-400 mt-1 uppercase">
                    <span>10K</span>
                    <span>20L</span>
                  </div>

                  {/* Underlined Direct Input */}
                  <div className="border-b border-gray-200 focus-within:border-[#004C5C] transition-colors py-1 mt-1">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-[#0E1F35] mr-1.5">₹</span>
                      <input
                        type="text"
                        value={typeAffordSalary}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTypeAffordSalary(val);
                          const parsed = parseRawNumbers(val);
                          setAffordMonthlySalary(parsed);
                        }}
                        onBlur={() => {
                          setTypeAffordSalary(new Intl.NumberFormat('en-IN').format(affordMonthlySalary));
                        }}
                        className="w-full text-xl font-extrabold text-[#0E1F35] bg-transparent focus:outline-none placeholder-slate-300"
                        placeholder="0"
                        id="input-afford-salary"
                      />
                    </div>
                  </div>
                </div>

                {/* Parameter 3: Other Existing EMIs */}
                <div className="space-y-2">
                  <label htmlFor="input-afford-other-emis" className="text-[15px] font-extrabold text-[#0E1F35] tracking-wide block">
                    Other Existing EMIs (₹)
                  </label>

                  <input 
                    type="range"
                    min={0}
                    max={1000000} // 10L Max EMIs
                    step={2000}
                    value={Math.min(1000000, Math.max(0, affordOtherEmis))}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAffordOtherEmis(val);
                    }}
                    style={getSliderBg(affordOtherEmis, 0, 1000000)}
                    className="w-full h-1 bg-transparent appearance-none rounded-lg cursor-pointer focus:outline-none 
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#004C5C] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
                               [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#004C5C] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                    id="slider-afford-other-emis"
                  />

                  <div className="flex justify-between text-[11px] font-black text-slate-400 mt-1 uppercase">
                    <span>0</span>
                    <span>10L</span>
                  </div>

                  {/* Underlined Direct Input */}
                  <div className="border-b border-gray-200 focus-within:border-[#004C5C] transition-colors py-1 mt-1">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-[#0E1F35] mr-1.5">₹</span>
                      <input
                        type="text"
                        value={typeAffordOther}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTypeAffordOther(val);
                          const parsed = parseRawNumbers(val);
                          setAffordOtherEmis(parsed);
                        }}
                        onBlur={() => {
                          setTypeAffordOther(new Intl.NumberFormat('en-IN').format(affordOtherEmis));
                        }}
                        className="w-full text-xl font-extrabold text-[#0E1F35] bg-transparent focus:outline-none placeholder-slate-300"
                        placeholder="0"
                        id="input-afford-other-emis"
                      />
                    </div>
                  </div>
                </div>

                {/* Grid row for remaining details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-2">
                  
                  {/* Parameter 4: Tenure */}
                  <div className="space-y-2">
                    <label htmlFor="small-input-afford-tenure" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Tenure (Years)
                    </label>
                    <input 
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={Math.min(100, Math.max(0, affordTenure))}
                      onChange={(e) => setAffordTenure(Number(e.target.value))}
                      style={getSliderBg(affordTenure, 0, 100)}
                      className="w-full h-1 bg-transparent appearance-none rounded-lg cursor-pointer focus:outline-none 
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#004C5C]
                                 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#004C5C] [&::-moz-range-thumb]:border-0"
                      id="small-slider-afford-tenure"
                    />
                    <div className="border-b border-gray-200 focus-within:border-[#004C5C] transition-colors py-1 mt-1">
                      <input
                        type="text"
                        value={typeAffordTenure}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTypeAffordTenure(val);
                          const parsed = parseRawNumbers(val);
                          setAffordTenure(parsed);
                        }}
                        onBlur={() => {
                          const clamped = Math.min(100, Math.max(0, affordTenure));
                          setAffordTenure(clamped);
                          setTypeAffordTenure(clamped.toString());
                        }}
                        className="w-full text-base font-extrabold text-slate-900 bg-transparent focus:outline-none"
                        id="small-input-afford-tenure"
                      />
                    </div>
                  </div>

                  {/* Parameter 5: Rate */}
                  <div className="space-y-2">
                    <label htmlFor="small-input-afford-rate" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Interest Rate (%)
                    </label>
                    <input 
                      type="range"
                      min={0}
                      max={100}
                      step={0.1}
                      value={Math.min(100, Math.max(0, affordRate))}
                      onChange={(e) => setAffordRate(Number(e.target.value))}
                      style={getSliderBg(affordRate, 0, 100)}
                      className="w-full h-1 bg-transparent appearance-none rounded-lg cursor-pointer focus:outline-none 
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#004C5C]
                                 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#004C5C] [&::-moz-range-thumb]:border-0"
                      id="small-slider-afford-rate"
                    />
                    <div className="border-b border-gray-200 focus-within:border-[#004C5C] transition-colors py-1 mt-1">
                      <input
                        type="text"
                        value={typeAffordRate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTypeAffordRate(val);
                          const parsed = parseRawFloat(val);
                          setAffordRate(parsed);
                        }}
                        onBlur={() => {
                          const clamped = Math.min(100, Math.max(0, affordRate));
                          setAffordRate(clamped);
                          setTypeAffordRate(clamped.toString());
                        }}
                        className="w-full text-base font-extrabold text-slate-900 bg-transparent focus:outline-none"
                        id="small-input-afford-rate"
                      />
                    </div>
                  </div>

                  {/* Parameter 6: Processing Fees Rate */}
                  <div className="space-y-2">
                    <label htmlFor="small-input-afford-fees" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Processing Fees (%)
                    </label>
                    <input 
                      type="range"
                      min={0}
                      max={5}
                      step={0.1}
                      value={Math.min(5, Math.max(0, affordFeesRate))}
                      onChange={(e) => setAffordFeesRate(Number(e.target.value))}
                      style={getSliderBg(affordFeesRate, 0, 5)}
                      className="w-full h-1 bg-transparent appearance-none rounded-lg cursor-pointer focus:outline-none 
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#004C5C]
                                 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#004C5C] [&::-moz-range-thumb]:border-0"
                      id="small-slider-afford-fees"
                    />
                    <div className="border-b border-gray-200 focus-within:border-[#004C5C] transition-colors py-1 mt-1">
                      <input
                        type="text"
                        value={typeAffordFeesRate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTypeAffordFeesRate(val);
                          const parsed = parseRawFloat(val);
                          setAffordFeesRate(parsed);
                        }}
                        onBlur={() => {
                          const clamped = Math.min(5, Math.max(0, affordFeesRate));
                          setAffordFeesRate(clamped);
                          setTypeAffordFeesRate(clamped.toString());
                        }}
                        className="w-full text-base font-extrabold text-slate-900 bg-transparent focus:outline-none"
                        id="small-input-afford-fees"
                      />
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Right Column: Visual Summary and Solid Pie Chart */}
            <div className="lg:col-span-5 bg-white p-8 sm:p-12 lg:border-l lg:border-gray-100 flex flex-col justify-between space-y-6">
              
              <div className="space-y-8 flex-1 flex flex-col justify-center">
                
                {/* Result Block: Affordability Head */}
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Your True Purchasing Power
                  </p>
                  <h3 
                    className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight"
                    id="afford-big-display"
                  >
                    {formatIndianRupees(affordabilityCalculated.maxAffordability)}
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-extrabold uppercase tracking-wide">
                    Allowed Monthly E.M.I Cap: {formatIndianRupees(affordabilityCalculated.allowedMonthlyEmi)} / mo
                  </p>
                </div>

                {/* Solid Pie Chart */}
                <div className="flex justify-center my-6">
                  <div className="relative w-56 h-56 transition-transform duration-300 hover:scale-105">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {affordPieSvgCircles}
                    </svg>
                  </div>
                </div>

                {/* Legends Grid of Budget Allocation */}
                <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-xs text-slate-500 font-bold max-w-sm mx-auto w-full">
                  
                  {/* Affordable Loan */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#0E1F35] shrink-0" />
                      <span>Affordable Loan</span>
                    </div>
                    <p className="text-base font-extrabold text-[#0E1F35]" id="afford-legend-loan">
                      {formatIndianRupees(affordabilityCalculated.affordableLoanAmount)}
                    </p>
                  </div>

                  {/* Down Payment */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#B38330] shrink-0" />
                      <span>Down Payment</span>
                    </div>
                    <p className="text-base font-extrabold text-[#0E1F35]" id="afford-legend-down">
                      {formatIndianRupees(affordDownPayment)}
                    </p>
                  </div>

                  {/* Projected Interest */}
                  <div className="space-y-1 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#004C5C] shrink-0" />
                      <span>Projected Interest</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#0E1F35]" id="afford-legend-interest">
                      {formatIndianRupees(affordabilityCalculated.totalInterest)}
                    </p>
                  </div>

                  {/* Processing charges */}
                  <div className="space-y-1 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#F59E0B] shrink-0" />
                      <span>Processing Fees</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#0E1F35]" id="afford-legend-fees">
                      {formatIndianRupees(affordabilityCalculated.processingFees)}
                    </p>
                  </div>
                </div>

              </div>

              {/* Action query button */}
              <button 
                onClick={() => alert(`Opening listings tailored to your calculated ₹ ${affordabilityCalculated.maxAffordability.toLocaleString()} purchasing power budget.`)}
                className="w-full bg-[#004C5C] hover:bg-[#0E1F35] text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
                id="btn-apply-afford"
              >
                Browse Qualifying Properties
              </button>

            </div>

          </div>
        )}

        {/* REGULATORY COMPLIANCE FOOTER DISCLAIMER */}
        <p className="text-[10px] text-slate-400 leading-relaxed font-bold text-justify uppercase tracking-wide bg-white/50 p-5 rounded-2xl border border-gray-200/50 max-w-4xl mx-auto">
          * Terms and criteria determined by individual housing registry authorities in accordance with applicable municipal revenue acts. The calculations shown above are mathematically consistent representations of standard amortization rates and should serve as preliminary financial guidelines.
        </p>

      </div>

      {/* magicloans Modal */}
      <AnimatePresence>
        {showMagicLoansModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
            {/* Modal Overlay Close */}
            <div className="absolute inset-0 cursor-default" onClick={() => setShowMagicLoansModal(false)} />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-white rounded-3xl border-2 border-[#0E1F35]/10 shadow-2xl overflow-hidden z-10 my-8"
              id="magicloans-modal-card"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowMagicLoansModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-xs border border-gray-100 transition-colors z-20 cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Promo View */}
              {modalMode === 'main' && (
                <div className="p-6 sm:p-10 md:pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Left content area */}
                    <div className="md:col-span-8 text-left space-y-6">
                      
                      {/* Logo structure carefully matching design */}
                      <div className="flex items-center gap-1.5" id="magicloans-logo-row">
                        <span className="text-3xl font-extrabold text-[#0E1F35] tracking-tight">magic</span>
                        <div className="relative inline-flex items-center pt-1" id="magicloans-coin-wrapper">
                          <span className="text-3xl font-extrabold text-[#0E1F35] tracking-tight">l</span>
                          {/* Rupee gold coin design replacing 'o' */}
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-[#B38330] border border-[#B38330] flex items-center justify-center shadow-xs mx-0.5 animate-pulse shrink-0">
                            <span className="text-white text-xs font-black select-none">₹</span>
                          </div>
                          <span className="text-3xl font-extrabold text-[#004C5C] tracking-tight">loans</span>
                        </div>
                      </div>

                      {/* Headline */}
                      <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl md:text-3.5xl font-black text-[#0D1F34] leading-tight tracking-tight">
                          Compare Home Loan Offers from 40+ Banks
                        </h2>
                        
                        {/* Subheading highlights */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-1 text-slate-700 font-bold text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center p-0.5 shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span>
                              Rates starting from <strong className="text-emerald-600 font-extrabold">7.1%</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center p-0.5 shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span>
                              <strong className="text-[#004C5C] font-extrabold">0%*</strong> Processing Fee
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* OUR BANKING PARTNERS Row */}
                      <div className="space-y-3 pt-2">
                        <p className="text-[10px] tracking-widest font-extrabold text-slate-400 uppercase" id="partners-title">
                          OUR BANKING PARTNERS
                        </p>
                        
                        {/* Horizontal Scroll / Stack Grid for partners */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                          {/* HDFC */}
                          <div className="bg-white rounded-xl p-3 border border-gray-150/50 shadow-2xs text-center flex flex-col justify-between h-[85px] hover:border-[#004C5C] transition-colors">
                            <div className="flex justify-center items-center h-8">
                              <span className="text-xs font-black text-[#1C3B65] tracking-tight">HDFC <span className="text-[#004C5C]">HOME LOANS</span></span>
                            </div>
                            <div className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 rounded py-0.5 px-1.5 self-center">
                              Starts at 7.25%
                            </div>
                          </div>

                          {/* BAJAJ */}
                          <div className="bg-white rounded-xl p-3 border border-gray-150/50 shadow-2xs text-center flex flex-col justify-between h-[85px] hover:border-[#004C5C] transition-colors">
                            <div className="flex justify-center items-center h-8">
                              <span className="text-[9px] font-black tracking-tighter text-blue-900 uppercase">BAJAJ HOUSING</span>
                            </div>
                            <div className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 rounded py-0.5 px-1.5 self-center">
                              Starts at 7.15%
                            </div>
                          </div>

                          {/* L&T */}
                          <div className="bg-white rounded-xl p-3 border border-gray-150/50 shadow-2xs text-center flex flex-col justify-between h-[85px] hover:border-[#004C5C] transition-colors">
                            <div className="flex justify-center items-center h-8">
                              <span className="text-[10px] font-black text-[#B38330]">L&T Finance</span>
                            </div>
                            <div className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 rounded py-0.5 px-1.5 self-center">
                              Starts at 7.8%
                            </div>
                          </div>

                          {/* SBI */}
                          <div className="bg-white rounded-xl p-3 border border-gray-150/50 shadow-2xs text-center flex flex-col justify-between h-[85px] hover:border-[#004C5C] transition-colors">
                            <div className="flex justify-center items-center h-8 gap-1">
                              <div className="w-3 h-3 rounded-full bg-cyan-500 shrink-0" />
                              <span className="text-xs font-black text-blue-900">SBI</span>
                            </div>
                            <div className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 rounded py-0.5 px-1.5 self-center">
                              Starts at 7.25%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer CTA Buttons Row */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 pt-3">
                        <button 
                          onClick={() => setModalMode('allOffers')}
                          className="text-[#004C5C] hover:text-[#0E1F35] font-black text-sm flex items-center gap-1.5 transition-colors cursor-pointer group py-2"
                          id="link-explore-bank"
                        >
                          <span>Explore Bank Offers</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 duration-200" />
                        </button>

                        <button 
                          onClick={() => {
                            setModalMode('eligibility');
                            setEligStep(1);
                          }}
                          className="bg-[#004C5C] hover:bg-[#0E1F35] text-white font-extrabold px-8 py-3.5 rounded-full shadow-md hover:shadow-teal-600/10 hover:scale-103 duration-200 text-xs sm:text-sm tracking-wider uppercase cursor-pointer"
                          id="btn-check-eligibility-promo"
                        >
                          Check Your Eligibility
                        </button>
                      </div>

                    </div>

                    {/* Right column: Generated PNG house illustration */}
                    <div className="md:col-span-4 hidden md:block relative self-end">
                      <div className="translate-y-4 max-w-[240px] mx-auto filter drop-shadow-xl select-none" id="house-img-container">
                        <img 
                          src={handHoldingHouseImg} 
                          alt="Hand holding a miniature suburban model house" 
                          className="w-full h-auto object-contain rounded-2xl"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Step-by-Step Eligibility Form View */}
              {modalMode === 'eligibility' && (
                <div className="p-6 sm:p-10 text-left">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                    <div>
                      <h3 className="text-lg font-black text-[#0D1F34]">Check Home Loan Eligibility</h3>
                      <p className="text-xs text-slate-400">Discover matching bank interest quotes in 30 seconds</p>
                    </div>
                    {/* Step indicator */}
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase">
                      Step {eligStep} of 3
                    </span>
                  </div>

                  {/* Step 1: Net Monthly income */}
                  {eligStep === 1 && (
                    <div className="space-y-6 py-2">
                      <div className="space-y-2">
                        <label className="block text-[15px] font-extrabold text-[#0D1F34]">
                          What is your Net Monthly Income? (₹)
                        </label>
                        <p className="text-xs text-slate-400">Enter your post-tax take-home monthly salary amount.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-8">
                          <input 
                            type="range"
                            min={20000}
                            max={500000}
                            step={5000}
                            value={eligSalary}
                            onChange={(e) => setEligSalary(Number(e.target.value))}
                            className="w-full accent-[#004C5C] h-2 bg-gray-200 rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[11px] text-slate-400 font-bold pt-2">
                            <span>₹ 20,000</span>
                            <span>₹ 2,50,000</span>
                            <span>₹ 5,00,000+</span>
                          </div>
                        </div>

                        <div className="md:col-span-4">
                          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-2xs flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400">Salary</span>
                            <span className="text-base font-black text-[#004C5C]">
                              ₹ {eligSalary.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-6 border-t border-gray-150">
                        <button 
                          onClick={() => setModalMode('main')}
                          className="text-gray-500 hover:text-black text-xs font-bold uppercase py-2.5 px-4 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => setEligStep(2)}
                          className="bg-[#004C5C] hover:bg-[#0E1F35] text-white font-extrabold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1"
                        >
                          <span>Next Question</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Profession */}
                  {eligStep === 2 && (
                    <div className="space-y-6 py-2">
                      <div className="space-y-1">
                        <label className="block text-[15px] font-extrabold text-[#0D1F34]">
                          Choose your Current Profession
                        </label>
                        <p className="text-xs text-slate-400">Assists registries in selecting appropriate bank rate portfolios for you.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {[
                          'Salaried Employee', 
                          'Self-Employed Professional', 
                          'Business Owner', 
                          'Freelancer / Consultant'
                        ].map((prof) => (
                          <div 
                            key={prof}
                            onClick={() => setEligProfession(prof)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between select-none ${
                              eligProfession === prof 
                                ? 'border-[#004C5C] bg-[#004C5C]/5' 
                                : 'border-gray-200/70 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className="text-xs font-extrabold text-slate-700">{prof}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              eligProfession === prof ? 'border-[#004C5C] bg-[#004C5C]' : 'border-gray-300'
                            }`}>
                              {eligProfession === prof && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between pt-6 border-t border-gray-150">
                        <button 
                          onClick={() => setEligStep(1)}
                          className="text-gray-500 hover:text-black text-xs font-bold uppercase py-2.5 px-4 cursor-pointer"
                        >
                          Back
                        </button>
                        <button 
                          onClick={() => setEligStep(3)}
                          className="bg-[#004C5C] hover:bg-[#0E1F35] text-white font-extrabold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1"
                        >
                          <span>Next Question</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Other EMIs and Contact Info */}
                  {eligStep === 3 && (
                    <div className="space-y-6 py-2">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="block text-[15px] font-extrabold text-[#0D1F34]">
                            Do you have any existing Monthly EMIs? (₹)
                          </label>
                          <input 
                            type="range"
                            min={0}
                            max={200000}
                            step={2500}
                            value={eligExistingEmi}
                            onChange={(e) => setEligExistingEmi(Number(e.target.value))}
                            className="w-full accent-[#004C5C] h-2 bg-gray-200 rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[11px] text-slate-400 font-bold pt-1">
                            <span>₹ 0 (No EMIs)</span>
                            <span className="text-[#004C5C] font-extrabold">Active EMI: ₹ {eligExistingEmi.toLocaleString('en-IN')}</span>
                            <span>₹ 2,00,000</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <label className="block text-xs font-black text-slate-600 uppercase">Your Name</label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                              <input 
                                type="text"
                                value={eligName}
                                onChange={(e) => setEligName(e.target.value)}
                                placeholder="your legal name"
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#004C5C]/50 focus:border-[#004C5C]"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-black text-slate-600 uppercase">Phone Number</label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                              <input 
                                type="tel"
                                value={eligPhone}
                                onChange={(e) => setEligPhone(e.target.value)}
                                placeholder="+91 **********"
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#004C5C]/50 focus:border-[#004C5C]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-6 border-t border-gray-150">
                        <button 
                          onClick={() => setEligStep(2)}
                          className="text-gray-500 hover:text-black text-xs font-bold uppercase py-2.5 px-4 cursor-pointer"
                        >
                          Back
                        </button>
                        <button 
                          onClick={() => {
                            if (!eligName || !eligPhone) {
                              alert("Please fill your Name and Phone Number to see your pre-approved loans.");
                              return;
                            }
                            setModalMode('results');
                            setEligSubmitted(true);
                          }}
                          className="bg-[#004C5C] hover:bg-[#0E1F35] text-white font-extrabold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-4 h-4 text-[#B38330] animate-pulse" />
                          <span>Generate Loan eligibility</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Eligibility Results View */}
              {modalMode === 'results' && (() => {
                const maxEmiCapability = Math.max(2000, (eligSalary * 0.5) - eligExistingEmi);
                const rateFactor = (7.15 / 12) / 100; // starts low
                const totalMonths = 25 * 12; // 25 years tenure
                const rawEligLoan = maxEmiCapability * (Math.pow(1 + rateFactor, totalMonths) - 1) / (rateFactor * Math.pow(1 + rateFactor, totalMonths));
                const eligibleAmount = isFinite(rawEligLoan) && rawEligLoan > 0 ? Math.round(rawEligLoan) : 3500000;
                
                return (
                  <div className="p-6 sm:p-10 text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                      <ShieldCheck className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest">
                        PRE-APPROVAL STATUS: GENERATED
                      </p>
                      <h3 className="text-2xl sm:text-3.5xl font-black text-[#0D1F34]">
                        Congratulations, {eligName || 'user'}!
                      </h3>
                      <p className="text-slate-500 font-semibold text-sm max-w-md mx-auto leading-relaxed">
                        Based on your profile as a <strong className="text-slate-800">{eligProfession}</strong> with ₹ {eligSalary.toLocaleString('en-IN')}/mo salary, you qualify for high-tier loans:
                      </p>
                    </div>

                    {/* Eligible Amount Badge */}
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block max-w-lg mx-auto">
                      <span className="text-[10px] text-slate-500 font-black tracking-wider uppercase block mb-1">
                        YOUR MAXIMUM ELIGIBLE HOME LOAN LIMIT
                      </span>
                      <p className="text-3xl sm:text-4xl font-black text-[#004C5C]">
                        ₹ {new Intl.NumberFormat('en-IN').format(eligibleAmount)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1">
                        Starting Interest Rate: 7.15% p.a. • Up to 25 Years Tenure Range
                      </p>
                    </div>

                    {/* Matched Banks Offer details */}
                    <div className="space-y-3 pt-2 font-sans">
                      <p className="text-left text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                        MATCHED BANK OFFERS (PRE-QUALIFIED)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        <div className="p-4 bg-white rounded-xl border border-gray-200 flex justify-between items-center shadow-2xs">
                          <div>
                            <p className="text-xs font-black text-[#0D1F34]">BAJAJ Housing Finance</p>
                            <p className="text-[10.5px] font-bold text-slate-400">Monthly EMI: ≈ ₹ {Math.round(maxEmiCapability * 0.95).toLocaleString('en-IN')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-extrabold text-emerald-600">7.15% Interest</p>
                            <p className="text-[9px] font-bold text-emerald-600">0% Processing Fee</p>
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-gray-200 flex justify-between items-center shadow-2xs">
                          <div>
                            <p className="text-xs font-black text-[#0D1F34]">HDFC HOME LOANS</p>
                            <p className="text-[10.5px] font-bold text-slate-400">Monthly EMI: ≈ ₹ {Math.round(maxEmiCapability * 0.96).toLocaleString('en-IN')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-extrabold text-[#004C5C]">7.25% Interest</p>
                            <p className="text-[9px] font-bold text-slate-400">Flat ₹ 1,999 Fees</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Callback Action / Finished indicator */}
                    <div className="border-t border-gray-150 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {eligCallbackBooked ? (
                        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-200 text-xs font-extrabold flex items-center gap-2 w-full justify-center">
                          <Check className="w-4 h-4" />
                          <span>CALLBACK BOOKED! Our Senior Finance Officer will phone you at {eligPhone} within 15 minutes.</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-slate-400 text-xs font-bold sm:text-left text-center">
                            Our executive can assist with documentation and secure this interest rate quote.
                          </p>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => setModalMode('main')}
                              className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-gray-50 cursor-pointer"
                            >
                              Go Back
                            </button>
                            <button 
                              onClick={() => setEligCallbackBooked(true)}
                              className="px-6 py-2.5 bg-[#004C5C] hover:bg-[#0E1F35] text-white text-xs font-extrabold rounded-lg uppercase cursor-pointer"
                            >
                              Call Me Back Instantly
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* All Offers Detailed Tab */}
              {modalMode === 'allOffers' && (
                <div className="p-6 sm:p-10 text-left space-y-6">
                  <div className="border-b border-gray-100 pb-4 flex justify-between items-center bg-[#FFF]">
                    <div>
                      <h3 className="text-xl font-black text-[#0D1F34]">All Bank Home Loan Offers</h3>
                      <p className="text-xs text-slate-400">Interactive live list of 40+ nationalized banking and NBFC partner rates</p>
                    </div>
                    <button 
                      onClick={() => setModalMode('main')}
                      className="text-xs font-black text-[#004C5C] bg-[#004C5C]/5 hover:bg-[#004C5C]/10 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      ← Back to Promo
                    </button>
                  </div>

                  {/* List/Table */}
                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-200 text-slate-400 font-extrabold uppercase">
                          <th className="p-4">Bank Name</th>
                          <th className="p-4">Starting Rate</th>
                          <th className="p-4">Max Tenure</th>
                          <th className="p-4">Processing Fee</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-bold text-slate-700">
                        {[
                          { name: 'BAJAJ Housing Finance Limited', rate: '7.15% - 8.40%', tenure: '30 Years', fee: '0%* Processing Fee', color: 'hover:bg-blue-50/10' },
                          { name: 'HDFC Home Loans', rate: '7.25% - 8.65%', tenure: '30 Years', fee: 'Flat ₹ 1,999/- only', color: '' },
                          { name: 'State Bank of India (SBI)', rate: '7.25% - 8.75%', tenure: '30 Years', fee: '0.15% of loan amount', color: '' },
                          { name: 'L&T Financial Services', rate: '7.80% - 9.10%', tenure: '25 Years', fee: '0.25% (No hidden cost)', color: '' },
                          { name: 'ICICI Bank Home Loans', rate: '7.20% - 8.85%', tenure: '30 Years', fee: 'Flat ₹ 3,000/- onwards', color: '' },
                          { name: 'Axis Bank Loans', rate: '7.25% - 8.90%', tenure: '30 Years', fee: '0% for women profiles', color: '' },
                          { name: 'IDFC First Bank', rate: '7.30% - 9.05%', tenure: '25 Years', fee: 'No charges on pre-payment', color: '' },
                        ].map((bank) => (
                          <tr key={bank.name} className={`hover:bg-[#004C5C]/5 transition-colors ${bank.color}`}>
                            <td className="p-4 font-black text-slate-800">{bank.name}</td>
                            <td className="p-4 text-emerald-600 font-extrabold">{bank.rate}</td>
                            <td className="p-4">{bank.tenure}</td>
                            <td className="p-4">{bank.fee}</td>
                            <td className="p-4 text-center">
                              <button 
                                onClick={() => {
                                  setModalMode('eligibility');
                                  setEligStep(1);
                                }}
                                className="px-3 py-1 bg-[#004C5C] hover:bg-[#0E1F35] text-white rounded-md text-[10px] uppercase font-black tracking-wider cursor-pointer transition-colors"
                              >
                                Apply
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => {
                        setModalMode('eligibility');
                        setEligStep(1);
                      }}
                      className="bg-[#004C5C] hover:bg-[#0E1F35] text-white font-extrabold px-6 py-3 rounded-xl shadow-md text-xs tracking-wider uppercase cursor-pointer"
                    >
                      Instant Check Main Eligibility Limit
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
