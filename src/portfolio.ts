import Big from "big.js";
import { AssetQuantity, AssetQuantityMap, Portfolio, Transaction, TransactionType } from "./types";

const updateAssetQuantity = (assets: AssetQuantityMap, assetQuantity: AssetQuantity, isCredit = true) => {
    const { asset, quantity } = assetQuantity;
    const currentQuantity = assets.get(asset);
    const totalQuantity = (currentQuantity ?? Big(0)).add(quantity.mul(isCredit ? 1 : -1));
    assets.set(asset, totalQuantity);
};

export const generatePortfolio = (transactions: Transaction[], title = ""): Portfolio => {
    return transactions.reduce<Portfolio>(
        (portfolio, transaction) => {
            switch (transaction.type) {
                case TransactionType.TRADE:
                    updateAssetQuantity(portfolio.assets, transaction.from, false);
                    updateAssetQuantity(portfolio.assets, transaction.to);

                    if (transaction.fees) {
                        updateAssetQuantity(portfolio.fees, transaction.fees, false);
                    }

                    break;

                case TransactionType.DEPOSIT:
                    updateAssetQuantity(portfolio.assets, transaction.to);

                    if (transaction.to.asset === "EUR") {
                        updateAssetQuantity(portfolio.ramp, transaction.to, false);
                    }

                    break;

                case TransactionType.WITHDRAW:
                    updateAssetQuantity(portfolio.assets, transaction.from, false);

                    if (transaction.fees) {
                        updateAssetQuantity(portfolio.fees, transaction.fees, false);
                    }

                    break;

                case TransactionType.EARN:
                    if (transaction.from) {
                        updateAssetQuantity(portfolio.assets, transaction.from);
                    }
                    if (transaction.to) {
                        updateAssetQuantity(portfolio.assets, transaction.to);
                    }
                    break;
            }
            return portfolio;
        },
        {
            title,
            date: new Date(),
            assets: new Map(),
            ramp: new Map(),
            fees: new Map(),
        }
    );
};
