import "server-only";
import * as jose from "jose";

import { SignJWT, jwtVerify, createRemoteJWKSet } from 'jose';
import { createPrivateKey } from 'crypto';

// Load or parse your RSA private key (PKCS#1 or PKCS#8)
const privateKeyPem = process.env.RSA_PRIVATE_KEY!;
const privateKey = createPrivateKey(privateKeyPem);

const aud = "convex-jwt";
const iss = "http://localhost:3000";

export async function createJWT(payload: Record<string, unknown>) {
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .setAudience(aud)
        .setIssuer(iss)
        .sign(privateKey);

    return jwt;
}

export async function getJWKS() {
    const jwk = await jose.exportJWK(await jose.importSPKI(process.env.RSA_PUBLIC_KEY!.replace(/\\n/g, "\n"), "RS256"));
    return [{ ...jwk, use: "sig", alg: "RS256", kid: jwk.kid || "default" }];
}

// Simulate the JWKS check on Convex
const jwksJson = '{"keys":[{"kty":"RSA","n":"rtDDBUnTfk0XC_GNSl-H-6ry6v1WGxb6U4VDOjrqlkplrDDZUpr_Rk8dB8dj0sSnq6UbLjZvIO2WdP4mSfpxa0fmJNlkGCM74N-Pqv1WwiCSlJHzgTh7o9JP7DdtAVMsri2wO5fFnu6XWpkv_rBhgu6dL66pCyclgCLB-Hv5kwT1wZnEAdHzeUlbEgotGhjNHZ8JPn5pKAuJgY0JvW3zQCvGY6KQPcExMRANgdmMMoQcT2Hwv0TAm0x27dB6LrfZ5k0QhB3PQ33rGHC0Rfe_mFnpD2xTcCeCPmsCpp2b0K-qoyMO-hbtrMGtHTCwJIdttxpMkwURAavpta5IBwIrsQ","e":"AQAB","use":"sig","alg":"RS256","kid":"default"}]}'
const jwksJsonBase64 = btoa(jwksJson);
const jwksUrl = `data:text/plain;charset=utf-8;base64,${jwksJsonBase64}`;
// const jwksUrl = "http://localhost:3000/.well-known/jwks.json";

export async function parseJWT(jwt: string) {
    const JWKS = createRemoteJWKSet(new URL(jwksUrl));

    const { payload } = await jwtVerify(jwt, JWKS, {
        audience: "convex-jwt",
        issuer: "http://localhost:3000",
    });

    return payload;
}
