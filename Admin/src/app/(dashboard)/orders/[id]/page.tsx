import { DownloadCloud, Printer } from "lucide-react";
import { BsFillHandbagFill } from "react-icons/bs";

import PageTitle from "@/components/shared/PageTitle";
import Typography from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// TODO: Replaced mock data with real API call using useOrder
import { useOrder } from "@/hooks/useOrders";
import { OrderBadgeVariants } from "@/constants/badge";
import { format } from "date-fns";

type PageParams = {
  params: {
    id: string;
  };
};

export default async function Order({ params: { id } }: PageParams) {
  const order = await useOrder({ id });

   const items = [
    { title: "Lettuce", quantity: 5, price: 193.26 },
    { title: "Tomato", quantity: 3, price: 120.0 },
  ];

  return (
    <section>
      <PageTitle>Invoice</PageTitle>

      <Card className="mb-8 text-muted-foreground p-4 lg:p-6">
        {/* ✅ Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-4 gap-y-6">
          <div className="flex flex-col">
            <Typography className="uppercase text-card-foreground mb-1.5 md:text-xl tracking-wide" variant="h2">
              invoice
            </Typography>

            <div className="flex items-center gap-x-2">
              <Typography className="uppercase font-semibold text-xs">status</Typography>
              <Badge
                variant={OrderBadgeVariants[order.status]}
                className="flex-shrink-0 text-xs capitalize"
              >
                {order.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col text-sm gap-y-0.5 md:text-right">
            <div className="flex items-center md:justify-end gap-x-1">
              <BsFillHandbagFill className="size-6 text-primary mb-1.5 flex-shrink-0" />
              <Typography component="span" variant="h2" className="text-card-foreground">Admin</Typography>
            </div>
            <Typography component="p">2 Lawson Avenue, California, United States</Typography>
            <Typography component="p">+1 (212) 456-7890</Typography>
            <Typography component="p" className="break-words">ecommerceadmin@gmail.com</Typography>
            <Typography component="p">ecommerce-admin-board.vercel.app</Typography>
          </div>
        </div>

        <Separator className="my-6" />

        {/* ✅ Invoice Meta Info */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-10">
          <div>
            <Typography variant="p" component="h4" className="font-semibold uppercase text-card-foreground mb-1">
              date
            </Typography>
            <Typography className="text-sm">{format(new Date(order.orderTime), "MMM d, yyyy")}</Typography>
          </div>

          <div>
            <Typography variant="p" component="h4" className="font-semibold uppercase text-card-foreground mb-1">
              invoice no
            </Typography>
            <Typography className="text-sm">#{order.invoiceNo}</Typography>
          </div>

          <div className="md:text-right">
            <Typography variant="p" component="h4" className="font-semibold uppercase text-card-foreground mb-1">
              invoice to
            </Typography>

            <div className="flex flex-col text-sm gap-y-0.5">
              <Typography component="p">{order.customerName}</Typography>
              {/* <Typography component="p" className="break-words">{order.customer.email}</Typography>
              <Typography component="p">{order.customer.phone}</Typography>
              <Typography component="p">{order.customer.addressLine1}</Typography>
              <Typography component="p">{order.customer.addressLine2}</Typography> */}
            </div>
          </div>
        </div>

        {/* ✅ Products Table */}
        <div className="border rounded-md overflow-hidden mb-10">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 dark:bg-transparent">
                <TableHead className="uppercase h-10 whitespace-nowrap">SR.</TableHead>
                <TableHead className="uppercase h-10 whitespace-nowrap">product title</TableHead>
                <TableHead className="uppercase h-10 whitespace-nowrap text-center">quantity</TableHead>
                <TableHead className="uppercase h-10 whitespace-nowrap text-center">item price</TableHead>
                <TableHead className="uppercase h-10 whitespace-nowrap text-right">amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-center">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Summary Details */}
        <div className="bg-background rounded-lg flex flex-col gap-4 md:justify-between md:flex-row p-6 md:px-8 mb-4">
          <div>
            <Typography component="h4" className="font-medium text-sm uppercase mb-1 tracking-wide">
              payment method
            </Typography>
            <Typography className="text-base capitalize font-semibold text-card-foreground tracking-wide">
              {order.method}
            </Typography>
          </div>

          {/* <div>
            <Typography component="h4" className="font-medium text-sm uppercase mb-1 tracking-wide">
              shipping cost
            </Typography>
            <Typography className="text-base capitalize font-semibold text-card-foreground tracking-wide">
              ${order.shipping.toFixed(2)}
            </Typography>
          </div>

          <div>
            <Typography component="h4" className="font-medium text-sm uppercase mb-1 tracking-wide">
              discount
            </Typography>
            <Typography className="text-base capitalize font-semibold text-card-foreground tracking-wide">
              ${order.discount.toFixed(2)}
            </Typography>
          </div> */}

          <div>
            <Typography component="h4" className="font-medium text-sm uppercase mb-1 tracking-wide">
              total amount
            </Typography>
            <Typography className="text-xl capitalize font-semibold tracking-wide text-primary">
              ${order.amount}
            </Typography>
          </div>
        </div>
      </Card>

      {/* ✅ Actions */}
      <div className="flex flex-wrap gap-3 justify-between">
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => window.open(`/orders/${id}/invoice`, '_blank')}
        >
          View Invoice <DownloadCloud className="ml-2 size-4" />
        </Button>
        <Button 
          size="lg"
          onClick={() => window.open(`/orders/${id}/invoice?print=true`, '_blank')}
        >
          Print Invoice <Printer className="ml-2 size-4" />
        </Button>
      </div>
    </section>
  );
}
