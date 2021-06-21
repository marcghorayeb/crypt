import { prompt } from "enquirer";
import * as fs from "fs";
import * as path from "path";
import { Transform } from "stream";
import { binanceOrderCsvParser } from "./parsers/binance-orders";
import { binanceTradeCsvParser } from "./parsers/binance-trades";
import { binanceTransactionCsvParser } from "./parsers/binance-transactions";
import { coinbaseCsvParser } from "./parsers/coinbase";
import { lykkeCsvParser } from "./parsers/lykke";
import { generatePortfolio } from "./portfolio";
import { transactionsFromStream } from "./utils";

// const parserConfigs: Record<Format, csv.ParserOptionsArgs> = {
//     'binance': { headers: true, skipLines: 3 },
//     'coinbase': { headers: true, skipLines: 3 },
//     'lykke': { headers: true }
// }

function getParserStream(filePath: string): Transform | undefined {
    if (filePath.includes("coinbase")) {
        return coinbaseCsvParser();
    } else if (filePath.includes("lykke")) {
        return lykkeCsvParser();
    } else if (filePath.includes("binance-orders")) {
        return binanceOrderCsvParser();
    } else if (filePath.includes("binance-trades")) {
        return binanceTradeCsvParser();
    } else if (filePath.includes("binance-transactions")) {
        return binanceTransactionCsvParser();
    }
    return;
}

function replacer(_key: string, value: unknown) {
    if (value instanceof Map) {
        return Object.fromEntries(value.entries());
    }
    return value;
}

async function main() {
    let filePaths = process.argv[2]?.trim().split(",");

    if (!filePaths) {
        const promptResult = await prompt<{ filePaths: string[] }>({
            type: "list",
            name: "filePaths",
            message: "Input the CSV path",
            required: true,
        });

        filePaths = promptResult.filePaths;
    }

    const transactions = await Promise.all(
        filePaths.map((filePath) => {
            if (!filePath) {
                throw new Error("Invalid file path");
            }

            console.debug(`Parsing ${filePath}`);
            const csvStream = getParserStream(filePath);
            if (!csvStream) {
                throw new Error("INVALID_CSV_STREAM");
            }

            const fileInputStream = fs.createReadStream(path.resolve(filePath));
            const transactionStream = fileInputStream.pipe(csvStream);
            return transactionsFromStream(transactionStream);
        })
    );

    const portfolio = generatePortfolio(transactions.flatMap((t) => t));

    console.log(JSON.stringify(portfolio, replacer, " "));
}

main().then(
    () => {
        console.log("Done importing");
        process.exit(0);
    },
    (error) => {
        console.error(error);
        process.exit(1);
    }
);
