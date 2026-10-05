'use client';
import { FaLock, FaBolt, FaArrowRight } from 'react-icons/fa';

export default function PayCashApp({
  brand,
  displayUsername,
  customAmount,
  selectedAmount,
  fixedVal,
  minAmount,
  maxAmount,
  loading,
  handlePayNow,
  handleAmountClick,
  handleCustomAmountChange,
  getLogoLetter,
  param2
}) {
  return (
    <div className="w-full max-w-[390px] flex flex-col items-center select-none py-2 text-gray-800">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 bg-[#00D632] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
          {getLogoLetter()}
        </div>
        <h2 className="text-base font-black text-gray-900">
          {param2 || `@${displayUsername || "theme-preview-pay-cash-app"}`}
        </h2>
        <p className="text-[10px] text-gray-400 font-bold max-w-[240px] mt-1 leading-normal">
          Do not send Cash App to this name.<br />Tap Pay now below to pay.
        </p>
      </div>

      <div className="w-full bg-white border border-gray-100 shadow-xl rounded-3xl p-5 flex flex-col items-center">
        {/* Step indicators */}
        <div className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-full p-1.5 mb-5 scale-95">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full font-bold text-xs text-gray-800">
            <span className="w-4 h-4 bg-[#00D632] text-white rounded-full flex items-center justify-center text-[10px]">1</span>
            <span>Amount</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 font-bold text-xs text-gray-400 mr-2">
            <span className="w-4 h-4 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-[10px]">2</span>
            <span>Pay</span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center border border-gray-100 rounded-2xl py-4 mb-4 select-none">
          <div className="bg-[#00D632] w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-1.5 shadow-md">
            $
          </div>
          <span className="font-extrabold text-xs tracking-wide text-gray-800">Instant</span>
        </div>

        {fixedVal !== "Open" ? (
          <div className="w-full text-center py-4 bg-slate-50 border border-gray-100 rounded-xl mb-4">
            <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Payment Amount</span>
            <span className="text-2xl font-black text-gray-900">${parseFloat(fixedVal).toFixed(2)}</span>
          </div>
        ) : (
          <div className="w-full space-y-4 text-left">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">SELECT AMOUNT</span>
            
            <div className="border border-gray-100 bg-slate-50 rounded-xl p-3.5 flex items-center gap-2">
              <span className="text-emerald-500 text-xl font-bold">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="0.00"
                className="bg-transparent text-xl font-extrabold outline-none w-full border-none placeholder-gray-300 text-gray-800"
                min={minAmount}
                max={maxAmount}
              />
            </div>
            <span className="text-[10px] font-semibold text-gray-400 block -mt-2">
              Between {minAmount} and {maxAmount} USD.
            </span>

            {/* Quick amounts pills */}
            <div className="space-y-1.5">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Quick amounts</p>
              <div className="flex flex-wrap gap-2">
                {[10, 15, 20, 25].filter(amt => amt >= minAmount && amt <= maxAmount).map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountClick(amt)}
                    className={`py-1.5 px-4 rounded-full border text-xs font-bold transition duration-200 ${
                      selectedAmount === amt
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-sm"
                        : "border-gray-150 bg-white text-gray-600 hover:border-gray-200 shadow-sm"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="w-full flex items-center justify-between border-t border-gray-100 pt-3 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-emerald-500"><FaLock className="text-[9px]" /> Secure</span>
          <span className="flex items-center gap-1 text-emerald-500"><FaBolt className="text-[9px]" /> Instant</span>
        </div>
      </div>

      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full mt-6 py-3.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-extrabold rounded-2xl text-base flex items-center justify-center gap-2 transition shadow-lg active:scale-98 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <span>Continue to payment</span>
            <FaArrowRight className="text-xs" />
          </>
        )}
      </button>
    </div>
  );
}
