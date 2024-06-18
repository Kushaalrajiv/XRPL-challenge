import { describe, it, expect } from 'vitest';
import { main } from '../send-xrp.js';

describe('sendXrp', () => {
  it('should send XRP successfully', async () => {
    let error;
    try {
      await main();
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  }, 20000); 
});
