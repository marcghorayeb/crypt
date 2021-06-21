import Big from "big.js";
import * as csv from "fast-csv";
import { Asset, Transaction, TransactionType } from "../types";

export type BinanceTransactionRow = {
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

// const isMultiTransaction = () => {
// };

export const binanceTransactionTransform = (row: BinanceTransactionRow): Transaction | Transaction[] => {
    const baseTransaction = {
        date: new Date(row.UTC_Time),
    };

    switch (row.Operation) {
        case "Deposit":
        case "Savings Interest":
        case "Savings Principal redemption":
        case "POS savings interest":
        case "POS savings redemption":
            if (row.Coin.startsWith("LD")) {
                return [];
            }

            return {
                ...baseTransaction,
                type: TransactionType.DEPOSIT,
                to: {
                    asset: row.Coin,
                    quantity: Big(row.Change),
                },
            };

        case "POS savings purchase":
            return {
                ...baseTransaction,
                type: TransactionType.WITHDRAW,
                from: {
                    asset: row.Coin,
                    quantity: Big(row.Change),
                },
            };

        case "Small assets exchange BNB":
        case "Super BNB Mining":
            return [];

        case "Transaction Related":
        case "Fee":
        case "Buy":
        case "Sell":
        case "Savings purchase":
            return [];
    }

    console.error(row);
    throw new Error("UNKNOWN_TRANSACTION");
};

export const binanceTransactionCsvParser = () => {
    return csv
        .parse<BinanceTransactionRow, Transaction>({ headers: true, skipLines: 0 })
        .transform(binanceTransactionTransform);
};
