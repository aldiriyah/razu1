'use client';
import { FaCheck } from 'react-icons/fa';

export default function CashGreen({
  brand,
  displayUsername,
  customAmount,
  fixedVal,
  loading,
  handlePayNow,
  handleKeypadPress,
  getLogoLetter,
  param2
}) {
  return (
    <div className="w-full max-w-[390px] flex flex-col items-center select-none py-2 text-white">
      {/* Header notch line */}
      <div className="w-12 h-1 bg-white/25 rounded-full mb-6"></div>

      {/* Secure Badge & Header Info */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#00D632] text-base font-black shadow-lg">
          {getLogoLetter()}
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="font-extrabold text-sm tracking-wide mb-1">
            {param2 || "Cash Green"}
          </span>
          <span className="flex items-center gap-1 bg-[#00b029] px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-white/20">
            <FaCheck className="text-[8px]" />
            <span>Secure Payment</span>
          </span>
        </div>
        <div className="w-9"></div>
      </div>

      {/* Subtitle card */}
      <div className="w-full bg-white/10 border border-white/15 rounded-3xl p-3.5 flex flex-col items-center text-center mb-6 shadow-lg backdrop-blur-sm">
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#00D632] text-lg font-black mb-1.5">
          $
        </div>
        <span className="font-black text-sm">{brand}</span>
        <span className="text-[8px] text-white/70 font-semibold flex items-center gap-1 mt-0.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
          Instant
        </span>
      </div>

      {/* Dynamic Big Amount Display */}
      <div className="text-center mb-6">
        <h2 className="text-5xl font-black tracking-tight text-white">${customAmount || "0"}</h2>
        <p className="text-[9px] font-bold tracking-widest text-white/75 mt-1 uppercase">
          United States Dollar
        </p>
      </div>

      {/* Keypad selector */}
      {fixedVal !== "Open" ? (
        <div className="w-full text-center py-4 bg-white/10 border border-white/15 rounded-2xl mb-6 shadow backdrop-blur-sm">
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 block mb-1">Fixed checkout amount</span>
          <span className="text-2xl font-black text-white">${parseFloat(fixedVal).toFixed(2)}</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[280px] mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeypadPress(key)}
              className="h-12 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-extrabold text-lg flex items-center justify-center transition border border-white/5"
            >
              {key === "backspace" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.41-6.41A2 2 0 0110.83 5H20a2 2 0 012 2v10a2 2 0 01-2 2h-9.17a2 2 0 01-1.42-.59L3 12z" />
                </svg>
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      )}

      {/* Big Green Pay Button */}
      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full py-3.5 bg-[#009c24] hover:bg-[#00801d] text-white font-extrabold rounded-2xl text-base tracking-wide flex items-center justify-center gap-2 transition active:scale-98 shadow-lg shadow-green-950/20 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Pay"
        )}
      </button>

      <p className="text-center text-[7px] text-white/50 tracking-widest mt-4 uppercase">
        Powered by {brand}
      </p>
    </div>
  );
}
