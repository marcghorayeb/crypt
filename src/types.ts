import { Big } from "big.js";

export type Format = "binance" | "coinbase" | "lykke";

export type Asset = "EUR" | "BTC" | "USD" | "SLR" | "ETH" | "LTC" | "XLM" | "XTZ";

export type AssetQuantity = {
    asset: Asset;
    quantity: Big;
};
export type AssetQuantityMap = Map<Asset, Big>;

export enum TransactionType {
    TRADE = "Trade",
    DEPOSIT = "Deposit",
    WITHDRAW = "Withdraw",
    EARN = "Earn",
}

type AbstractTransaction<T = TransactionType> = {
    date: Date;
    type: T;
    from?: AssetQuantity;
    to?: AssetQuantity;
    spotPrice?: AssetQuantity;
    fees?: AssetQuantity;
    notes?: string;
};

export type TradeTransaction = AbstractTransaction<TransactionType.TRADE> & {
    from: AssetQuantity;
    to: AssetQuantity;
    spotPrice?: AssetQuantity;
    fees?: AssetQuantity;
};

export type WithdrawTransaction = AbstractTransaction<TransactionType.WITHDRAW> & {
    from: AssetQuantity;
    fees?: AssetQuantity;
};

export type DepositTransaction = AbstractTransaction<TransactionType.DEPOSIT> & {
    to: AssetQuantity;
    fees?: AssetQuantity;
};

export type EarnTransaction = AbstractTransaction<TransactionType.EARN> &
    (
        | {
              to: AssetQuantity;
          }
        | { from: AssetQuantity }
    );

export type Transaction = TradeTransaction | WithdrawTransaction | EarnTransaction | DepositTransaction;

export type Portfolio = {
    title: string;
    date: Date;
    ramp: AssetQuantityMap;
    assets: AssetQuantityMap;
    fees: AssetQuantityMap;
};
