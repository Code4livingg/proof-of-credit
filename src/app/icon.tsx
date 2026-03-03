import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#030507",
        }}
      >
        <svg viewBox="0 0 64 64" width="50" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="icon-emerald" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FF88" />
              <stop offset="0.55" stopColor="#00C96B" />
              <stop offset="1" stopColor="#00A65A" />
            </linearGradient>
          </defs>
          <path
            d="M32 6L52 14V30C52 42.4 44.4 53.5 32 58C19.6 53.5 12 42.4 12 30V14L32 6Z"
            stroke="url(#icon-emerald)"
            strokeWidth="4"
          />
          <path d="M22 33L29 40L43 24" stroke="url(#icon-emerald)" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
