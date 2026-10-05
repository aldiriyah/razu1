import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Pay on Cash App";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }) {
  const { param2 } = params;

  const name = param2 || "CashApp";
  const firstLetter = name.charAt(0).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#00D632",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 80px 70px 80px",
          boxSizing: "border-box",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {/* Circular Purple Avatar Badge */}
          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "75px",
              backgroundColor: "#7B0F9C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "80px",
                fontWeight: "bold",
                color: "#FFFFFF",
              }}
            >
              {firstLetter}
            </span>
          </div>

          {/* Dollar Sign Box (Fixed) */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              backgroundColor: "#121214",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#00D632",
              }}
            >
              $
            </span>
          </div>
        </div>

        {/* Profile Info Details at Bottom */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
          }}
        >
          {/* Bold Display Name */}
          <span
            style={{
              fontSize: "76px",
              fontWeight: "bold",
              color: "#121214",
              marginBottom: "8px",
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </span>
          {/* Secondary Username (lower opacity) */}
          <span
            style={{
              fontSize: "36px",
              fontWeight: "500",
              color: "#121214",
              opacity: "0.7",
            }}
          >
            {name}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
