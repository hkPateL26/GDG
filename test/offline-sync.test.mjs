import test from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage and window for Node test environment
const mockStorage = new Map();
global.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

global.window = {
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {},
};

try {
  Object.defineProperty(globalThis.navigator, 'onLine', {
    value: true,
    configurable: true,
    writable: true,
  });
} catch {
  // If navigator cannot be redefined, fallback gracefully
}

global.CustomEvent = class CustomEvent {
  constructor(type, eventInitDict) {
    this.type = type;
    this.detail = eventInitDict?.detail;
  }
};

const {
  isOnline,
  getOfflineQueue,
  queueOfflineAction,
  removeFromOfflineQueue,
  clearOfflineQueue,
  processOfflineQueue,
} = await import('../src/lib/offline-sync.ts');

test('Offline Resilience and Background Sync Engine Suite', async (t) => {
  mockStorage.clear();

  await t.test('Reports online status correctly', () => {
    global.navigator.onLine = true;
    assert.equal(isOnline(), true);

    global.navigator.onLine = false;
    assert.equal(isOnline(), false);
    global.navigator.onLine = true;
  });

  await t.test('Queue begins empty', () => {
    mockStorage.clear();
    const queue = getOfflineQueue();
    assert.deepEqual(queue, []);
  });

  await t.test('Queues offline citizen applications with unique IDs', () => {
    mockStorage.clear();
    const item = queueOfflineAction(
      'application_submit',
      { id: 'APP_TEST_101', applicantName: 'Kishan Patel', schemeId: 'ration-card' },
      'OFFLINE_APP_101'
    );

    assert.equal(item.id, 'OFFLINE_APP_101');
    assert.equal(item.type, 'application_submit');
    assert.equal(item.status, 'pending');

    const queue = getOfflineQueue();
    assert.equal(queue.length, 1);
    assert.equal(queue[0].id, 'OFFLINE_APP_101');
  });

  await t.test('Prevents duplicate queue entries with identical custom IDs', () => {
    queueOfflineAction('application_submit', { id: 'APP_TEST_101_UPDATED' }, 'OFFLINE_APP_101');
    const queue = getOfflineQueue();
    assert.equal(queue.length, 1);
    assert.equal(queue[0].payload.id, 'APP_TEST_101_UPDATED');
  });

  await t.test('Removes items from queue by ID', () => {
    queueOfflineAction('status_track', { id: 'APP_TRACK_999' }, 'OFFLINE_TRACK_999');
    assert.equal(getOfflineQueue().length, 2);

    removeFromOfflineQueue('OFFLINE_TRACK_999');
    const queue = getOfflineQueue();
    assert.equal(queue.length, 1);
    assert.equal(queue[0].id, 'OFFLINE_APP_101');
  });

  await t.test('Processes queue and synchronizes applications to persistent store', async () => {
    mockStorage.clear();
    queueOfflineAction(
      'application_submit',
      { id: 'GJ_RATION_789', citizenNameGu: 'હરેશ પટેલ', status: 'Submitted' },
      'OFFLINE_RATION_789'
    );

    assert.equal(getOfflineQueue().length, 1);

    const result = await processOfflineQueue();
    assert.equal(result.synced, 1);
    assert.equal(result.failed, 0);

    // Queue should now be empty
    assert.equal(getOfflineQueue().length, 0);

    // nagrik_user_applications should contain the synced item
    const saved = JSON.parse(mockStorage.get('nagrik_user_applications') || '[]');
    assert.equal(saved.length, 1);
    assert.equal(saved[0].id, 'GJ_RATION_789');
  });

  await t.test('Clears offline queue completely', () => {
    queueOfflineAction('document_upload', { doc: 'aadhaar' });
    queueOfflineAction('document_upload', { doc: 'ration_card' });
    assert.equal(getOfflineQueue().length, 2);

    clearOfflineQueue();
    assert.equal(getOfflineQueue().length, 0);
  });
});
