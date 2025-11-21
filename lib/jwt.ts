import * as jose from "jose";

import { SignJWT } from 'jose';
import { createPrivateKey } from 'crypto';

// Load or parse your RSA private key (PKCS#1 or PKCS#8)
const privateKeyPem = process.env.RSA_PRIVATE_KEY!;

const privateKey = createPrivateKey(privateKeyPem);

export async function createJWT(payload: Record<string, unknown>) {
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .setAudience("convex-jwt")
        .setIssuer("http://localhost:3000")
        .sign(privateKey);

    return jwt;
}

export async function getJWKS() {
    const jwk = await jose.exportJWK(await jose.importSPKI(process.env.RSA_PUBLIC_KEY!.replace(/\\n/g, "\n"), "RS256"));
    return [{ ...jwk, use: "sig", alg: "RS256", kid: jwk.kid || "default" }];
}
