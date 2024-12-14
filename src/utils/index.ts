
import memoize from 'lodash/memoize'
import { Address, checksumAddress } from 'viem'
// returns the checksummed address if the address is valid, otherwise returns undefined
export const safeGetAddress = memoize((value: any): Address | undefined => {
  try {
    let value_ = value
    if (typeof value === 'string' && !value.startsWith('0x')) {
      value_ = `0x${value}`
    }
    return checksumAddress(value_)
  } catch {
    return undefined
  }
})