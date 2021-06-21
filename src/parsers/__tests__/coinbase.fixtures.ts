import Big from "big.js";
import { Transaction, TransactionType } from "../../types";
import { CoinbaseRow } from "../coinbase";

export const coinbaseCSVFilePath = "/Users/marcghorayeb/Documents/Bank/Crypto/coinbase-trades-2021-07-26-04_29_35.csv";

export const transactions: [string, CoinbaseRow, Transaction | Transaction[]][] = [
    // 2017-12-20T08:27:23Z,Buy,BTC,0.00677166,14263.86,96.59,100.00,3.41,Bought 0.00677166 BTC for €100.00 EUR
    [
        "Buy transaction",
        {
            Timestamp: "2017-12-20T08:27:23Z",
            "Transaction Type": "Buy",
            Asset: "BTC",
            "Quantity Transacted": "0.00677166",
            "EUR Spot Price at Transaction": "14263.86",
            "EUR Subtotal": "96.59",
            "EUR Total (inclusive of fees)": "100.00",
            "EUR Fees": "3.41",
            Notes: "Bought 0.00677166 BTC for €100.00 EUR",
        },
        [
            {
                date: new Date("2017-12-20T08:27:23Z"),
                notes: "Bought 0.00677166 BTC for €100.00 EUR",
                type: TransactionType.DEPOSIT,
                to: {
                    asset: "EUR",
                    quantity: Big("100.00"),
                },
            },
            {
                date: new Date("2017-12-20T08:27:23Z"),
                notes: "Bought 0.00677166 BTC for €100.00 EUR",
                type: TransactionType.TRADE,
                from: {
                    asset: "EUR",
                    quantity: Big("100.00"),
                },
                to: {
                    asset: "BTC",
                    quantity: Big("0.00677166"),
                },
                fees: {
                    asset: "EUR",
                    quantity: Big("3.41"),
                },
                spotPrice: {
                    asset: "EUR",
                    quantity: Big("14263.86"),
                },
            },
        ],
    ],
    // 2020-08-28T21:34:07Z,Send,BTC,0.00858795,9650.45,"","","",Sent 0.00858795 BTC to 1Kp7PRFHJRAVwYA4c9Py8H1i66AYqPLMuz
    [
        "Send transaction",
        {
            Timestamp: "2020-08-28T21:34:07Z",
            "Transaction Type": "Send",
            Asset: "BTC",
            "Quantity Transacted": "0.00858795",
            "EUR Spot Price at Transaction": "9650.45",
            "EUR Subtotal": "",
            "EUR Total (inclusive of fees)": "",
            "EUR Fees": "",
            Notes: "Sent 0.00858795 BTC to 1Kp7PRFHJRAVwYA4c9Py8H1i66AYqPLMuz",
        },
        {
            date: new Date("2020-08-28T21:34:07Z"),
            notes: "Sent 0.00858795 BTC to 1Kp7PRFHJRAVwYA4c9Py8H1i66AYqPLMuz",
            type: TransactionType.WITHDRAW,
            from: {
                asset: "BTC",
                quantity: Big("0.00858795"),
            },
        },
    ],
    // 2020-08-24T15:02:48Z,Convert,LTC,0.3473672,52.31,18.10,18.17,0.070000,Converted 0.3473672 LTC to 0.00181629 BTC
    [
        "Convert transaction",
        {
            Timestamp: "2020-08-24T15:02:48Z",
            "Transaction Type": "Convert",
            Asset: "LTC",
            "Quantity Transacted": "0.00858795",
            "EUR Spot Price at Transaction": "52.31",
            "EUR Subtotal": "18.10",
            "EUR Total (inclusive of fees)": "18.17",
            "EUR Fees": "0.070000",
            Notes: "Converted 0.3473672 LTC to 0.00181629 BTC",
        },
        {
            date: new Date("2020-08-24T15:02:48Z"),
            notes: "Converted 0.3473672 LTC to 0.00181629 BTC",
            type: TransactionType.TRADE,
            from: {
                asset: "LTC",
                quantity: Big("0.3473672"),
            },
            to: {
                asset: "BTC",
                quantity: Big("0.00181629"),
            },
            fees: {
                asset: "EUR",
                quantity: Big("0.070000"),
            },
            spotPrice: {
                asset: "EUR",
                quantity: Big("52.31"),
            },
        },
    ],
    // 2021-04-13T06:38:45Z,Coinbase Earn,XLM,3.3023845,0.510000,1.68,1.68,0.00,Received 3.3023845 XLM from Coinbase Earn
    [
        "Coinbase Earn transaction",
        {
            Timestamp: "2020-08-24T15:02:48Z",
            "Transaction Type": "Coinbase Earn",
            Asset: "XLM",
            "Quantity Transacted": "3.3023845",
            "EUR Spot Price at Transaction": "0.510000",
            "EUR Subtotal": "1.68",
            "EUR Total (inclusive of fees)": "1.68",
            "EUR Fees": "0.00",
            Notes: "Received 3.3023845 XLM from Coinbase Earn",
        },
        {
            date: new Date("2020-08-24T15:02:48Z"),
            notes: "Received 3.3023845 XLM from Coinbase Earn",
            type: TransactionType.EARN,
            to: {
                asset: "XLM",
                quantity: Big("3.3023845"),
            },
        },
    ],
    // 2021-05-15T12:11:00Z,Rewards Income,XTZ,0.000676,5.03,0.00,0.00,0.00,Received 0.000676 XTZ from Coinbase Rewards
    [
        "Coinbase Rewards transaction",
        {
            Timestamp: "2020-08-24T15:02:48Z",
            "Transaction Type": "Rewards Income",
            Asset: "XTZ",
            "Quantity Transacted": "0.000676",
            "EUR Spot Price at Transaction": "5.03",
            "EUR Subtotal": "0.00",
            "EUR Total (inclusive of fees)": "0.00",
            "EUR Fees": "0.00",
            Notes: "Received 0.000676 XTZ from Coinbase Rewards",
        },
        {
            date: new Date("2020-08-24T15:02:48Z"),
            notes: "Received 0.000676 XTZ from Coinbase Rewards",
            type: TransactionType.EARN,
            to: {
                asset: "XTZ",
                quantity: Big("0.000676"),
            },
        },
    ],
];
