import { valueToWei } from "@aave/contract-helpers";

// generate signature approval a certain threshold above the current balance to account for accrued interest
export const SIGNATURE_AMOUNT_MARGIN = 0.1;

// Calculate aToken amount to request for signature, adding small margin to account for accruing interest
export const calculateSignedAmount = (
  amount: string,
  decimals: number,
  margin?: number,
) => {
  // 10% margin for aToken interest accrual, custom amount for actions where output amount is variable
  const amountWithMargin =
    Number(amount) + Number(amount) * (margin ?? SIGNATURE_AMOUNT_MARGIN); 
  const formattedAmountWithMargin = valueToWei(
    amountWithMargin.toString(),
    decimals,
  );
  return formattedAmountWithMargin;
};
