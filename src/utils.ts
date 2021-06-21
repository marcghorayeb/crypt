import { Readable } from "stream";
import { Transaction } from "./types";

export function transactionsFromStream(transactionsStream: Readable) {
    return new Promise<Transaction[]>((resolve, reject) => {
        const transactions: Transaction[] = [];

        transactionsStream
            .on("error", reject)
            .on("data", (row) => transactions.push(...(Array.isArray(row) ? row : [row])))
            .on("end", () => {
                transactions.sort((tA, tB) => tA.date.getTime() - tB.date.getTime());
                console.log(transactions);
                resolve(transactions);
            });
    });
}
