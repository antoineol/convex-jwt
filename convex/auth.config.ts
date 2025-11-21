import { AuthConfig } from "convex/server";

const aud = "convex-jwt";
const iss = "http://localhost:3000";

const jwksJson = '{"keys":[{"kty":"RSA","n":"rtDDBUnTfk0XC_GNSl-H-6ry6v1WGxb6U4VDOjrqlkplrDDZUpr_Rk8dB8dj0sSnq6UbLjZvIO2WdP4mSfpxa0fmJNlkGCM74N-Pqv1WwiCSlJHzgTh7o9JP7DdtAVMsri2wO5fFnu6XWpkv_rBhgu6dL66pCyclgCLB-Hv5kwT1wZnEAdHzeUlbEgotGhjNHZ8JPn5pKAuJgY0JvW3zQCvGY6KQPcExMRANgdmMMoQcT2Hwv0TAm0x27dB6LrfZ5k0QhB3PQ33rGHC0Rfe_mFnpD2xTcCeCPmsCpp2b0K-qoyMO-hbtrMGtHTCwJIdttxpMkwURAavpta5IBwIrsQ","e":"AQAB","use":"sig","alg":"RS256","kid":"default"}]}'
const jwksJsonBase64 = btoa(jwksJson);
const jwksDataUrl = `data:text/plain;charset=utf-8;base64,${jwksJsonBase64}`;

export default {
  providers: [
    {
      type: "customJwt",
      applicationID: aud,
      issuer: iss,
      // jwks: "http://localhost:3000/.well-known/jwks.json",
      jwks: jwksDataUrl,
      algorithm: "RS256",
    },
  ]
} satisfies AuthConfig;