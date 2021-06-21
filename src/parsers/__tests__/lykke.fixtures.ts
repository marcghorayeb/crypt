import Big from "big.js";
import { Asset, Transaction, TransactionType } from "../../types";
import { LykkeRow } from "../lykke";

export const lykkeCSVFilePath = "/Users/marcghorayeb/Documents/Bank/Crypto/lykke-trades-2020-08-28-2021-04-15.csv";

export const transactions: [string, LykkeRow, Transaction][] = [
    // 04/15/2021 01:48:26,Trade,Lykke,-2,SLR,0.05,EUR,0,
    [
        "Trade transaction, no fees",
        {
            Date: "04/15/2021 01:48:26",
            Type: "Trade",
            Exchange: "Lykke",
            "Base Amount": "-2",
            "Base Currency": "SLR",
            "Quote Amount": "0.05",
            "Quote Currency": "EUR",
            Fee: "0",
            "Fee Currency": "" as unknown as Asset,
        },
        {
            date: new Date("04/15/2021 01:48:26"),
            type: TransactionType.TRADE,
            from: {
                asset: "SLR",
                quantity: Big(2),
            },
            to: {
                asset: "EUR",
                quantity: Big(0.05),
            },
            spotPrice: {
                asset: "EUR",
                quantity: Big(0.025),
            },
        },
    ],
    // 04/13/2021 08:10:01,CashOut,Lykke,-0.00212378,BTC,,,0.0005,BTC
    [
        "Cash out, with fees",
        {
            Date: "04/13/2021 08:10:01",
            Type: "CashOut",
            Exchange: "Lykke",
            "Base Amount": "-0.00212378",
            "Base Currency": "BTC",
            "Quote Amount": "",
            "Quote Currency": "" as unknown as Asset,
            Fee: "0.0005",
            "Fee Currency": "BTC",
        },
        {
            date: new Date("04/13/2021 08:10:01"),
            type: TransactionType.WITHDRAW,
            from: {
                asset: "BTC",
                quantity: Big(0.00212378),
            },
            fees: {
                asset: "BTC",
                quantity: Big(0.0005),
            },
        },
    ],
    // 08/28/2020 22:24:03,CashIn,Lykke,0.00826855,BTC,,,0,
    [
        "Cash in, no fees",
        {
            Date: "08/28/2020 22:24:03",
            Type: "CashIn",
            Exchange: "Lykke",
            "Base Amount": "0.00826855",
            "Base Currency": "BTC",
            "Quote Amount": "",
            "Quote Currency": "" as unknown as Asset,
            Fee: "",
            "Fee Currency": "" as unknown as Asset,
        },
        {
            date: new Date("08/28/2020 22:24:03"),
            type: TransactionType.DEPOSIT,
            to: {
                asset: "BTC",
                quantity: Big(0.00826855),
            },
        },
    ],
];
