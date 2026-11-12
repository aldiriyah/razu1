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
  const [copied, setCopied] = useState(false);

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
    if (step >= 2 && timeLeft > 0) {
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

  const copyLightningInvoice = async () => {
    if (!lightningInvoice) {
      toast.error('Lightning invoice is not generated yet.');
      return;
    }

    try {
      await navigator.clipboard.writeText(lightningInvoice);
      setCopied(true);
      toast.success('Invoice copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy lightning invoice.');
    }
  };

  const handleRecommendedPay = () => {
    copyLightningInvoice();
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

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white font-sans flex flex-col justify-between px-4 py-5">
        <div className="w-full max-w-[390px] mx-auto flex justify-end">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white/80">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Expires in {formatTime(timeLeft)}</span>
          </div>
        </div>

        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[390px] mx-auto py-4 gap-4">
          <p className="text-[11px] font-bold tracking-[0.18em] text-white/60 uppercase text-center">
            HOW TO PAY IN CASH APP
          </p>

          <div className="w-full max-w-[260px] rounded-[28px] border-[3px] border-white/15 bg-black overflow-hidden shadow-2xl">
            <video
              src="/cashapp-howto.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-h-[58vh] object-contain block bg-black"
            />
          </div>

          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full h-12 rounded-full bg-white hover:bg-white/90 text-black font-bold text-[16px] transition active:scale-[0.98] shadow-lg mt-2"
          >
            Got it, next
          </button>
        </main>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white font-sans flex flex-col justify-between px-4 py-5">
        <div className="w-full max-w-[390px] mx-auto flex justify-end">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white/80">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Expires in {formatTime(timeLeft)}</span>
          </div>
        </div>

        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[360px] mx-auto py-4">
          <div className="w-16 h-16 rounded-full bg-[#00D632] flex items-center justify-center text-white text-2xl font-black shadow-lg mb-3">
            {getLogoLetter()}
          </div>

          <h1 className="text-[22px] font-extrabold tracking-tight text-white">
            Pay with Bitcoin
          </h1>
          <p className="text-[38px] font-black tracking-tight text-white tabular-nums leading-tight mt-1 mb-5">
            ${(selectedAmount || 0).toFixed(2)}
          </p>

          {/* QR Code Container */}
          <div className="relative mb-6 w-full max-w-[250px] mx-auto">
            <div className="absolute -inset-4 bg-[#0891b2]/15 blur-3xl rounded-full pointer-events-none" />
            <div className="relative rounded-[20px] border-[3px] border-[#08080a] bg-white p-4 shadow-2xl aspect-square flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&ecc=H&data=${encodeURIComponent(lightningInvoice || '')}`}
                alt="Payment QR"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00D632] w-9 h-9 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-black text-lg select-none">$</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="w-full space-y-3">
            <button
              type="button"
              onClick={handleRecommendedPay}
              className="w-full h-12 rounded-full bg-[#00D632]/20 hover:bg-[#00D632]/30 text-[#00D632] font-bold text-[15px] flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <FaCheck className="text-sm" />
                  <span>Copied</span>
                </>
              ) : (
                <span>Copy invoice</span>
              )}
            </button>

            <a
              href="https://cash.app/launch/bitcoin"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-full bg-white hover:bg-white/90 text-black font-bold text-[15px] flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg"
            >
              <span>Open Cash App</span>
            </a>
          </div>

          <p className="text-xs text-white/60 text-center max-w-[290px] leading-relaxed mt-5">
            Bitcoin payments are final and can&apos;t be reversed. This page isn&apos;t run by Cash App.
          </p>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-3 text-[13px] font-semibold text-white/80 hover:text-white underline underline-offset-4 transition"
          >
            How to pay
          </button>
        </main>
      </div>
    );
  }

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
        {renderTemplate()}
      </main>

      {/* Decorative Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 h-1 opacity-35 bg-gradient-to-r from-transparent via-current to-transparent ${
        isKeypadGreen ? "text-white" : "text-emerald-500"
      }`}></div>
    </div>
  );
}
