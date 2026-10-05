'use client';
import { FaCheckCircle, FaLock, FaArrowRight } from 'react-icons/fa';

export default function PayinCash({
  brand,
  customAmount,
  selectedAmount,
  fixedVal,
  minAmount,
  maxAmount,
  loading,
  handlePayNow,
  handleAmountClick,
  handleCustomAmountChange,
  showMore,
  setShowMore,
  getLogoLetter,
  AMOUNTS,
  MORE_AMOUNTS,
  param2
}) {
  return (
    <div className="w-full max-w-[390px] flex flex-col items-center select-none py-2 text-gray-800">
      <div className="w-full bg-white border border-gray-100 shadow-2xl rounded-[36px] p-6 flex flex-col items-center">
        <div className="w-12 h-1 bg-gray-200 rounded-full mb-4"></div>

        <div className="w-12 h-12 bg-[#00D632] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
          {getLogoLetter()}
        </div>

        <h1 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
          {param2 || "Payin Cash"}
        </h1>

        <div className="flex items-center gap-1 bg-emerald-50 text-[#05b875] px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 mb-6">
          <FaCheckCircle className="text-[10px]" />
          <span>Secure Payment</span>
        </div>

        {fixedVal !== "Open" ? (
          <div className="w-full text-center py-4 bg-emerald-50 border border-emerald-100 rounded-2xl mb-4">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Payment Amount</span>
            <span className="text-3xl font-black text-[#05b875]">${parseFloat(fixedVal).toFixed(2)}</span>
          </div>
        ) : (
          <div className="w-full space-y-4 text-left">
            <div className="border border-gray-200 bg-white rounded-2xl p-4 flex items-center justify-center">
              <span className="text-xl font-black text-gray-900">
                {customAmount ? `$${customAmount}` : "Enter amount"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              <span>SELECT AMOUNT</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {AMOUNTS.filter(amt => amt >= minAmount && amt <= maxAmount).map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountClick(amt)}
                  className={`py-2 px-1 rounded-xl border text-xs font-bold transition duration-200 ${
                    selectedAmount === amt
                      ? "border-[#05b875] bg-emerald-50 text-[#05b875]"
                      : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                  }`}
                >
                  ${amt.toFixed(2)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="w-full py-2.5 text-center text-[#05b875] font-bold text-xs bg-emerald-50 border border-emerald-100/50 rounded-xl hover:bg-emerald-100/60 transition"
            >
              {showMore ? "Show less amounts" : "Show more amounts"}
            </button>

            {showMore && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {MORE_AMOUNTS.filter(amt => amt >= minAmount && amt <= maxAmount).map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountClick(amt)}
                    className={`py-2 px-1 rounded-xl border text-xs font-bold transition duration-200 ${
                      selectedAmount === amt
                        ? "border-[#05b875] bg-emerald-50 text-[#05b875]"
                        : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                    }`}
                  >
                    ${amt.toFixed(2)}
                  </button>
                ))}
              </div>
            )}

            <div className="relative">
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-[#05b875] text-gray-700 transition"
                placeholder={`Custom Amount ($${minAmount} - $${maxAmount})`}
                min={minAmount}
                max={maxAmount}
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full mt-6 py-3.5 bg-[#05b875] hover:bg-[#049a62] text-white font-extrabold rounded-2xl text-base flex items-center justify-center gap-2 transition shadow-lg active:scale-98 disabled:opacity-50"
      >
        <FaLock className="text-xs" />
        <span>Pay Now</span>
        <FaArrowRight className="text-xs" />
      </button>
    </div>
  );
}
