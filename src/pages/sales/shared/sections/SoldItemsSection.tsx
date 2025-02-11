import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SaleItemsTable from "@/pages/sales/shared/SaleItemsTable";
import { SaleItem } from "@/types/sales/sale-Item.dto";

export default function SoldItemsSection({
  saleItems,
}: {
  saleItems: SaleItem[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles vendus</CardTitle>{" "}
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <SaleItemsTable mode="view" saleItems={saleItems} />
        </div>
      </CardContent>
    </Card>
  );
}
