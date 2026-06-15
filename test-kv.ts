import { rateLimit } from './lib/ratelimit';
async function test() {
  try {
    const { success } = await rateLimit.standard.limit('127.0.0.1');
    console.log("Rate limit success:", success);
  } catch (e) {
    console.log("Rate limit failed:", e.message);
  }
}
test();
