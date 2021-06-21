import * as fs from "fs";
import { Readable } from "stream";
import { Transaction } from "../../types";
import { coinbaseCsvParser, coinbaseTransform } from "../coinbase";
import { coinbaseCSVFilePath, transactions } from "./coinbase.fixtures";

describe("Parsers: Coinbase", () => {
    describe("Transactions", () => {
        it.each(transactions)("%s", (_useCase, csvTransaction, expectedTransaction) => {
            const transaction = coinbaseTransform(csvTransaction);
            expect(transaction).toEqual(expectedTransaction);
        });
    });

    describe("CSV", () => {
        let filestream: Readable;

        beforeAll(async () => {
            filestream = fs.createReadStream(coinbaseCSVFilePath, "utf8");
        });

        it("should parse a csv successfully", (done) => {
            const parser = coinbaseCsvParser();
            const transactions: Transaction[] = [];

            filestream
                .pipe(parser)
                .on("data", (transaction) => transactions.push(transaction))
                .on("error", done)
                .on("end", () => {
                    expect(transactions).toHaveLength(71 - 9 + 1);
                    done();
                });
        });
    });
});
