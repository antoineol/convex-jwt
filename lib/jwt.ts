import "server-only";

import { SignJWT, jwtVerify, createRemoteJWKSet, exportJWK, importSPKI } from 'jose';
import { createPrivateKey } from 'crypto';

// Load or parse your RSA private key (PKCS#1 or PKCS#8)
const privateKeyPem = process.env.RSA_PRIVATE_KEY!;
const privateKey = createPrivateKey(privateKeyPem);

const jwtPromise = exportJWK(await importSPKI(process.env.RSA_PUBLIC_KEY!.replace(/\\n/g, "\n"), "RS256"));

const aud = "convex-jwt";
const iss = "http://localhost:3000";

/**
 * Creates a JWT token that meets Convex requirements:
 * - Header: kid, alg, typ
 * - Payload: sub, iss, exp, iat
 */
export async function createJWT(payload: Record<string, unknown>) {
    // Ensure required payload fields are present
    if (!payload.sub) {
        throw new Error("JWT payload must include 'sub' (subject) field");
    }

    const kid = await getKeyId();

    const jwt = await new SignJWT(payload)
        .setProtectedHeader({
            alg: 'RS256',  // Required by Convex
            kid: kid,      // Required by Convex
            typ: 'JWT'     // Required by Convex
        })
        .setIssuedAt()     // Sets 'iat' - expected by Convex clients for token refreshing
        .setExpirationTime('1h')  // Sets 'exp' - required by Convex
        .setIssuer(iss)    // Sets 'iss' - required by Convex
        .setAudience(aud)
        .sign(privateKey);

    return jwt;
}

export async function getJWKS() {
    const jwk = await jwtPromise;
    return [{ ...jwk, use: "sig", alg: "RS256", kid: await getKeyId() }];
}

async function getKeyId() {
    // const jwk = await jwtPromise;
    // return jwk.kid || "default";
    return "default";
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
