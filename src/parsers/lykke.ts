import Big from "big.js";
import * as csv from "fast-csv";
import { Asset, Transaction, TransactionType } from "../types";

export type LykkeRow = {
    Date: string;
    Type: "Trade" | "CashOut" | "CashIn";
    Exchange: "Lykke";
    "Base Amount": string;
    "Base Currency": Asset;
    "Quote Amount": string;
    "Quote Currency": Asset;
    Fee: string;
    "Fee Currency": Asset;
};

export const lykkeTransform = (row: LykkeRow): Transaction => {
    const baseTransaction = {
        date: new Date(row.Date),
    };

    const quoteAmount = Big(row["Quote Amount"] || 0);
    const baseAmount = Big(row["Base Amount"] || 0);
    const fees = Big(row["Fee"] || 0);

    switch (row["Type"]) {
        case "Trade":
            const from = {
                asset: row["Quote Currency"],
                quantity: quoteAmount.abs(),
            };
            const to = {
                asset: row["Base Currency"],
                quantity: baseAmount.abs(),
            };
            return {
                ...baseTransaction,
                type: TransactionType.TRADE,
                from: quoteAmount.s > 0 ? to : from,
                to: quoteAmount.s > 0 ? from : to,
                spotPrice: {
                    asset: row["Quote Currency"],
                    quantity: quoteAmount.div(baseAmount).abs(),
                },
                ...(fees.toNumber() === 0
                    ? {}
                    : {
                          fees: {
                              asset: row["Fee Currency"],
                              quantity: fees,
                          },
                      }),
            };

        case "CashOut":
            return {
                ...baseTransaction,
                type: TransactionType.WITHDRAW,
                from: {
                    asset: row["Base Currency"],
                    quantity: baseAmount.abs(),
                },
                ...(fees.toNumber() === 0
                    ? {}
                    : {
                          fees: {
                              asset: row["Fee Currency"],
                              quantity: fees,
                          },
                      }),
            };

        case "CashIn":
            return {
                ...baseTransaction,
                type: TransactionType.DEPOSIT,
                to: {
                    asset: row["Base Currency"],
                    quantity: baseAmount,
                },
            };
    }

    throw new Error("UNKNOWN_TRANSACTION");
};

export const lykkeCsvParser = () => {
    return csv.parse<LykkeRow, Transaction>({ headers: true }).transform(lykkeTransform);
};
