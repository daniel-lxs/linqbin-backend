import { Entropy, charset64 } from 'entropy-string';

export function generatePasskey() {
  const passkey = new Entropy({ charset: charset64, bits: 32 }).string();
  return passkey;
}
