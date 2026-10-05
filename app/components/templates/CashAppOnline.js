'use client';

export default function CashAppOnline({
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
  param2
}) {
  return (
    <div className="w-full max-w-[390px] flex flex-col items-center select-none py-2 text-gray-800">
      <div className="w-full bg-white border border-gray-100 shadow-xl rounded-[32px] p-6 flex flex-col items-center">
        <div className="w-12 h-1 bg-gray-200 rounded-full mb-4"></div>

        <h1 className="text-lg font-black text-gray-800 tracking-tight mb-2">
          {param2 || `Pay ${brand}`}
        </h1>

        <div className="flex items-center gap-1 bg-[#ccf7e1] text-[#00b0ff] px-3 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100 mb-5">
          <span>OK Secure Payment</span>
        </div>

        {/* Inner logo card */}
        <div className="w-full flex flex-col items-center border border-gray-100 rounded-2xl py-4 mb-4 select-none">
          <div className="bg-[#00D632] w-11 h-11 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-1 shadow-md">
            $
          </div>
          <span className="font-extrabold text-[11px] text-gray-800">{brand}</span>
        </div>

        {fixedVal !== "Open" ? (
          <div className="w-full text-center py-3.5 bg-slate-50 border border-gray-100 rounded-xl mb-4">
            <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Payment Amount</span>
            <span className="text-xl font-black text-gray-800">${parseFloat(fixedVal).toFixed(2)}</span>
          </div>
        ) : (
          <div className="w-full space-y-4 text-left">
            
            <div className="border border-emerald-100 bg-[#f9fbf9] rounded-xl p-3 flex items-center justify-between">
              <span className="text-[#00D632] text-sm font-black">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Enter amount"
                className="bg-transparent text-sm font-bold outline-none w-full border-none text-right placeholder-gray-300 text-gray-800"
                min={minAmount}
                max={maxAmount}
              />
            </div>

            <span className="text-[9px] font-bold text-[#00D632] uppercase tracking-wider block">
              $ QUICK SELECT
            </span>

            {/* Pill options */}
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 30].filter(amt => amt >= minAmount && amt <= maxAmount).map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountClick(amt)}
                  className={`py-2 border rounded-xl text-xs font-bold transition ${
                    selectedAmount === amt
                      ? "border-[#00D632] bg-[#f9fbf9] text-[#00D632]"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  ${amt.toFixed(2)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="w-full py-2 bg-emerald-50/50 text-[#00D632] font-bold text-xs border border-emerald-100/50 rounded-xl text-center"
            >
              {showMore ? "Show less amounts" : "Show more amounts v"}
            </button>

            {showMore && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[50, 100, 200].filter(amt => amt >= minAmount && amt <= maxAmount).map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountClick(amt)}
                    className={`py-2 border rounded-xl text-xs font-bold transition ${
                      selectedAmount === amt
                        ? "border-[#00D632] bg-[#f9fbf9] text-[#00D632]"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    ${amt.toFixed(2)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Big green checkout button */}
      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full mt-6 py-3.5 bg-[#00D632] hover:bg-[#00b029] text-white font-extrabold rounded-2xl text-base flex items-center justify-center gap-2 transition active:scale-98 shadow-lg shadow-green-200 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Pay Now ->"
        )}
      </button>

      <p className="text-center text-[7px] text-gray-400 mt-4 font-semibold">
        Powered by <span className="text-[#00D632] font-bold">{brand}</span> - Trusted by millions.
      </p>
    </div>
  );
}
