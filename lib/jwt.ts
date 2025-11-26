import "server-only";

import { SignJWT, jwtVerify, createRemoteJWKSet, exportJWK, importSPKI } from 'jose';
import { createPrivateKey } from 'crypto';

// Load or parse your EC private key (PKCS#8)
const privateKeyPem = process.env.EC_PRIVATE_KEY!;
const privateKey = createPrivateKey(privateKeyPem);

const jwtPromise = exportJWK(await importSPKI(process.env.EC_PUBLIC_KEY!.replace(/\\n/g, "\n"), "ES256"));

const aud = "convex-jwt";
const iss = "http://localhost:3020";

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
            alg: 'ES256',  // Required by Convex
            kid: kid,      // Required by Convex
            typ: 'JWT'     // Required by Convex
        })
        .setIssuedAt()     // Sets 'iat' - expected by Convex clients for token refreshing
        .setExpirationTime('15m')  // Sets 'exp' - required by Convex
        .setIssuer(iss)    // Sets 'iss' - required by Convex
        .setAudience(aud)
        .sign(privateKey);

    return jwt;
}

export async function getJWKS() {
    const jwk = await jwtPromise;
    return [{ ...jwk, use: "sig", alg: "ES256", kid: await getKeyId() }];
}

async function getKeyId() {
    // const jwk = await jwtPromise;
    // return jwk.kid || "default";
    return "default";
}

// Simulate the JWKS check on Convex
const jwksJson = '{"keys":[{"kty":"EC","x":"qVJ7wxptXfCe1D3xX6B4C5xrPSRyFtvIql1hEW7rwHc","y":"IYxRrBrYd9h0hmxmimJsFFqxIFeE-S2yy2zKOYApdXU","crv":"P-256","use":"sig","alg":"ES256","kid":"default"}]}'
const jwksJsonBase64 = btoa(jwksJson);
const jwksUrl = `data:text/plain;charset=utf-8;base64,${jwksJsonBase64}`;
// const jwksUrl = "http://localhost:3020/.well-known/jwks.json";

export async function parseJWT(jwt: string) {
    const JWKS = createRemoteJWKSet(new URL(jwksUrl));

    const { payload } = await jwtVerify(jwt, JWKS, {
        audience: "convex-jwt",
        issuer: "http://localhost:3020",
    });

    return payload;
}
