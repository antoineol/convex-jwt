import { AuthConfig } from "convex/server";

const aud = "convex-jwt";
const iss = "http://localhost:3020";

const jwksJson = '{"keys":[{"kty":"EC","x":"qVJ7wxptXfCe1D3xX6B4C5xrPSRyFtvIql1hEW7rwHc","y":"IYxRrBrYd9h0hmxmimJsFFqxIFeE-S2yy2zKOYApdXU","crv":"P-256","use":"sig","alg":"ES256","kid":"default"}]}'
const jwksJsonBase64 = btoa(jwksJson);
const jwksDataUrl = `data:text/plain;charset=utf-8;base64,${jwksJsonBase64}`;

export default {
  providers: [
    {
      type: "customJwt",
      applicationID: aud,
      issuer: iss,
      // jwks: "http://localhost:3020/.well-known/jwks.json",
      jwks: jwksDataUrl,
      algorithm: "ES256",
    },
  ]
} satisfies AuthConfig;