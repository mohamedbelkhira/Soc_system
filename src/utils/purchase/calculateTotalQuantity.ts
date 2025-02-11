export const calculateTotalQuantity = (purchase: {
    purchaseItems: Array<{
      quantity: number;
    }>;
  }): number => {
    return purchase.purchaseItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };
  