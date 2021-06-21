import Big from "big.js";
import * as csv from "fast-csv";
import { Asset, Transaction, TransactionType } from "../types";

export type CoinbaseRow = {
    Timestamp: string;
    "Transaction Type": "Buy" | "Send" | "Convert" | "Coinbase Earn" | "Rewards Income";
    Asset: Asset;
    "Quantity Transacted": string;
    "EUR Spot Price at Transaction": string;
    "EUR Subtotal": string;
    "EUR Total (inclusive of fees)": string;
    "EUR Fees": string;
    Notes: string;
};

export const coinbaseTransform = (row: CoinbaseRow): Transaction | Transaction[] => {
    const baseTransaction = {
        date: new Date(row.Timestamp),
        notes: row.Notes,
    };

    switch (row["Transaction Type"]) {
        case "Buy":
            return [
                {
                    ...baseTransaction,
                    type: TransactionType.DEPOSIT,
                    to: {
                        asset: "EUR",
                        quantity: Big(row["EUR Total (inclusive of fees)"]),
                    },
                },
                {
                    ...baseTransaction,
                    type: TransactionType.TRADE,
                    from: {
                        asset: "EUR",
                        quantity: Big(row["EUR Total (inclusive of fees)"]),
                    },
                    to: {
                        asset: row.Asset,
                        quantity: Big(row["Quantity Transacted"]),
                    },
                    fees: {
                        asset: "EUR",
                        quantity: Big(row["EUR Fees"]),
                    },
                    spotPrice: {
                        asset: "EUR",
                        quantity: Big(row["EUR Spot Price at Transaction"]),
                    },
                },
            ];

        case "Convert":
            const regex =
                /Converted (?<fromQuantityStr>\d+.?\d*) (?<fromAsset>\w+) to (?<toQuantityStr>\d+.?\d*) (?<toAsset>\w+)/;
            const regexGroups = regex.exec(row.Notes)?.groups ?? {};
            const { fromQuantityStr, fromAsset, toQuantityStr, toAsset } = regexGroups;

            if (!fromAsset || !fromQuantityStr || !toAsset || !toQuantityStr) {
                throw new Error("MISSING_INFO_FOR_CONVERT_EVENT");
            }

            const fromQuantity = Big(fromQuantityStr);
            const toQuantity = Big(toQuantityStr);

            return {
                ...baseTransaction,
                type: TransactionType.TRADE,
                from: {
                    asset: fromAsset as Asset,
                    quantity: fromQuantity,
                },
                to: {
                    asset: toAsset as Asset,
                    quantity: toQuantity,
                },
                fees: {
                    asset: "EUR",
                    quantity: Big(row["EUR Fees"]),
                },
                spotPrice: {
                    asset: "EUR",
                    quantity: Big(row["EUR Spot Price at Transaction"]),
                },
            };

        case "Coinbase Earn":
            return {
                ...baseTransaction,
                type: TransactionType.EARN,
                to: {
                    asset: row.Asset,
                    quantity: Big(row["Quantity Transacted"]),
                },
            };

        case "Rewards Income":
            return {
                ...baseTransaction,
                type: TransactionType.EARN,
                to: {
                    asset: row.Asset,
                    quantity: Big(row["Quantity Transacted"]),
                },
            };

        case "Send":
            return {
                ...baseTransaction,
                type: TransactionType.WITHDRAW,
                from: {
                    asset: row.Asset,
                    quantity: Big(row["Quantity Transacted"]),
                },
            };
    }

    throw new Error("UNKNOWN_TRANSACTION");
};

export const coinbaseCsvParser = () => {
    return csv.parse<CoinbaseRow, Transaction>({ headers: true, skipLines: 7 }).transform(coinbaseTransform);
};
