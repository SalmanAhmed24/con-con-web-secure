// Server-only helper for app/api/* route handlers.
// Verifies the HS256 JWT issued by the backend's login endpoint, using the same
// JWT_SECRET (set it in this app's environment too; never NEXT_PUBLIC_).
import crypto from "crypto";
import { NextResponse } from "next/server";

const b64urlDecode = (str) =>
  Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64");

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;

  let header;
  let payload;
  try {
    header = JSON.parse(b64urlDecode(headerB64).toString("utf8"));
    payload = JSON.parse(b64urlDecode(payloadB64).toString("utf8"));
  } catch {
    return null;
  }
  // Only accept the algorithm the backend signs with.
  if (!header || header.alg !== "HS256") return null;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest();
  const actual = b64urlDecode(signatureB64);
  if (
    actual.length !== expected.length ||
    !crypto.timingSafeEqual(actual, expected)
  ) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || payload.exp <= now) return null;
  if (typeof payload.nbf === "number" && payload.nbf > now) return null;
  return payload;
};

// Returns a 401 response when the request has no valid token, otherwise null.
export const requireAuth = (request) => {
  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !verifyToken(token)) {
    return NextResponse.json(
      { error: true, message: "Authentication required" },
      { status: 401 }
    );
  }
  return null;
};
