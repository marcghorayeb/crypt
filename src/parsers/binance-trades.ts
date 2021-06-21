import Big from "big.js";
import * as csv from "fast-csv";
import { Asset, AssetQuantity, Transaction, TransactionType } from "../types";

export type BinanceTradeRow = {
    "Date(UTC)": string;
    Pair: `${Asset}${Asset}`;
    Side: "BUY" | "SELL";
    Price: string;
    Executed: string;
    Amount: string;
    Fee: string;
};

const assetQuantityRegexp = /(?<quantity>\d+(\.\d+)?)(?<asset>\w+)/;

const parseAssetQuantity = (assetQuantityStr: string): AssetQuantity => {
    const results = assetQuantityRegexp.exec(assetQuantityStr.replace(",", ""));
    if (!results?.groups) {
        throw new Error("FAILED_AMOUNT_AND_ASSET_PARSING");
    }
    const { asset, quantity } = results.groups as { asset: Asset; quantity: string };
    return {
        asset,
        quantity: Big(quantity),
    };
};

export const binanceTradeTransform = (row: BinanceTradeRow): Transaction | Transaction[] => {
    const baseTransaction = {
        date: new Date(row["Date(UTC)"]),
    };

    switch (row.Side) {
        case "BUY":
            return {
                ...baseTransaction,
                type: TransactionType.TRADE,
                from: parseAssetQuantity(row.Amount),
                to: parseAssetQuantity(row.Executed),
                fees: parseAssetQuantity(row.Fee),
            };

        case "SELL":
            return {
                ...baseTransaction,
                type: TransactionType.TRADE,
                from: parseAssetQuantity(row.Executed),
                to: parseAssetQuantity(row.Amount),
                fees: parseAssetQuantity(row.Fee),
            };
    }

    console.error(row);
    throw new Error("UNKNOWN_TRANSACTION");
};

export const binanceTradeCsvParser = () => {
    return csv.parse<BinanceTradeRow, Transaction>({ headers: true, skipLines: 0 }).transform(binanceTradeTransform);
};
