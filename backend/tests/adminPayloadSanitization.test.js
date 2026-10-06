import test from 'node:test';
import assert from 'node:assert/strict';

import { sanitizeAdminPayload } from '../src/utils/payloadSanitizer.js';

test('sanitizeAdminPayload strips unknown fields and preserves allowed ones', () => {
  const payload = {
    name: 'Digana Villa',
    price: 42000,
    status: 'Available',
    isAdmin: true,
    foo: 'bar',
    id: 999,
  };

  assert.deepEqual(
    sanitizeAdminPayload(payload, ['name', 'price', 'status']),
    {
      name: 'Digana Villa',
      price: 42000,
      status: 'Available',
    },
  );
});
