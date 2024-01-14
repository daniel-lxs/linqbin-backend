import { Entropy, charset64 } from 'entropy-string';

//TODO: Encrypt entries
export function generatePasskey() {
  const passkey = new Entropy({ charset: charset64, bits: 32 }).string();
  return passkey;
}
