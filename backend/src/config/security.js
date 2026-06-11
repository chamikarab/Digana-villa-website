import bcrypt from 'bcryptjs';

export const isProduction = process.env.NODE_ENV === 'production';

const BCRYPT_ROUNDS = 12;

function resolveAdminPasswordHash() {
  const hashFromEnv = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (hashFromEnv) {
    if (!/^\$2[aby]\$/.test(hashFromEnv)) {
      throw new Error(
        'ADMIN_PASSWORD_HASH must be a bcrypt hash (e.g. starts with $2a$, $2b$, or $2y$).',
      );
    }
    return hashFromEnv;
  }

  const plain = process.env.ADMIN_PASSWORD ?? (isProduction ? null : 'Admin@1234');
  if (!plain) {
    throw new Error(
      'Set ADMIN_PASSWORD_HASH or ADMIN_PASSWORD for the admin account in production.',
    );
  }

  return bcrypt.hashSync(plain, BCRYPT_ROUNDS);
}

function resolveJwtSecret() {
  const secret =
    process.env.JWT_SECRET ??
    (isProduction ? null : 'dev-only-insecure-jwt-secret-min-32-chars!!');

  if (isProduction) {
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be set and at least 32 characters in production.');
    }
  }

  return secret;
}

function resolveAdminEmail() {
  const email = process.env.ADMIN_EMAIL ?? (isProduction ? null : 'admin@diganavilla.com');
  if (!email?.trim()) {
    throw new Error('ADMIN_EMAIL is required in production.');
  }
  return email.trim();
}

function resolveCorsOrigins() {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (raw) {
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return ['http://localhost:5173', 'http://127.0.0.1:5173'];
}

export const jwtSecret = resolveJwtSecret();
export const adminEmail = resolveAdminEmail();
export const adminPasswordHash = resolveAdminPasswordHash();
export const corsOrigins = resolveCorsOrigins();
