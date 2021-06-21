import * as fs from "fs";
import { Readable } from "stream";
import { Transaction } from "../../types";
import { lykkeCsvParser, lykkeTransform } from "../lykke";
import { lykkeCSVFilePath, transactions } from "./lykke.fixtures";

describe("Parsers: Lykke", () => {
    describe("Transactions", () => {
        it.each(transactions)("%s", (_useCase, csvTransaction, expectedTransaction) => {
            const transaction = lykkeTransform(csvTransaction);
            expect(transaction).toEqual(expectedTransaction);
        });
    });

    describe("CSV", () => {
        let filestream: Readable;

        beforeAll(async () => {
            filestream = fs.createReadStream(lykkeCSVFilePath, "utf8");
        });

        it("should parse a csv successfully", (done) => {
            const parser = lykkeCsvParser();
            const transactions: Transaction[] = [];

            filestream
                .pipe(parser)
                .on("data", (transaction) => transactions.push(transaction))
                .on("error", done)
                .on("end", () => {
                    expect(transactions).toHaveLength(34);
                    done();
                });
        });
    });
});
