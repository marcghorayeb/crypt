import Big from "big.js";
import * as csv from "fast-csv";
import { Asset, Transaction, TransactionType } from "../types";

export type BinanceOrderRow = {
    UTC_Time: string;
    Account: "Spot";
    Operation:
        | "Savings purchase"
        | "Savings Interest"
        | "Deposit"
        | "POS savings purchase"
        | "Buy"
        | "Transaction Related"
        | "Fee"
        | "Small assets exchange BNB"
        | "Super BNB Mining"
        | "POS savings interest"
        | "Savings Principal redemption"
        | "POS savings redemption"
        | "Sell";
    Coin: Asset;
    Change: string;
    Remark: string;
};

export const binanceOrderTransform = (row: BinanceOrderRow): Transaction | Transaction[] => {
    const baseTransaction = {
        date: new Date(row.UTC_Time),
    };

    switch (row.Operation) {
        case "Deposit":
        case "Savings Interest":
        case "POS savings interest":
            return {
                ...baseTransaction,
                type: TransactionType.DEPOSIT,
                to: {
                    asset: row.Coin,
                    quantity: Big(row.Change),
                },
            };

        case "Savings purchase":
            return [];
    }

    console.error(row);
    throw new Error("UNKNOWN_TRANSACTION");
};

export const binanceOrderCsvParser = () => {
    return csv.parse<BinanceOrderRow, Transaction>({ headers: true, skipLines: 0 }).transform(binanceOrderTransform);
};
