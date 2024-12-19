import memoize from 'lodash/memoize';
import { Address, checksumAddress } from 'viem';
// returns the checksummed address if the address is valid, otherwise returns undefined
export const safeGetAddress = memoize((value: any): Address | undefined => {
  try {
    let value_ = value;
    if (typeof value === 'string' && !value.startsWith('0x')) {
      value_ = `0x${value}`;
    }
    return checksumAddress(value_);
  } catch {
    return undefined;
  }
});

// add 10%
export function calculateGasMargin(
  value: bigint,
  margin = BigInt(1000),
): bigint {
  return (BigInt(value) * (BigInt('10000') + BigInt(margin))) / BigInt('10000');
}
