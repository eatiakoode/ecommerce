"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useOrder } from "@/hooks/useOrders";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer, Download, Mail } from "lucide-react";
import { format } from "date-fns";

export default function InvoicePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data: order, isLoading, error } = useOrder(orderId);
  const shouldPrint = searchParams.get("print") === "true";
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !error && shouldPrint) {
      setTimeout(() => {
        setIsPrinting(true);
        window.print();
        setTimeout(() => setIsPrinting(false), 1000);
      }, 500);
    }
  }, [isLoading, error, shouldPrint]);

  const handlePrint = () => {
    window.open(`/orders/${orderId}/invoice?print=true`, '_blank');
  };

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    
    setIsDownloading(true);
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `invoice-${order?._id?.slice(-6) || 'order'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print dialog
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmail = () => {
    const subject = `Invoice #${order?._id?.slice(-6)}`;
    const body = `Please find attached invoice for your recent order.`;
    window.open(`mailto:${order?.user?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading invoice...</p>
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="text-center">
        <p className="text-red-500 mb-4">Failed to load order</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    </div>
  );

  const invoiceNumber = order._id?.slice(-6) || 'N/A';
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const totalAmount = order.totalPriceAfterDiscount || order.totalPrice || 0;
  const customerName = order.user?.firstname && order.user?.lastname 
    ? `${order.user.firstname} ${order.user.lastname}`
    : order.user?.email || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header Actions - Hidden when printing */}
      <div className="print:hidden bg-white border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
          
          <div className="flex gap-2">
            <Button onClick={handleEmail} variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              size="sm"
              disabled={isDownloading}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button onClick={handlePrint} size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-4xl mx-auto p-6 print:p-0">
        <Card className="bg-white shadow-lg print:shadow-none print:border-none" ref={invoiceRef}>
          <div className="p-8 print:p-6">
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Store</h1>
                    <p className="text-gray-600">Professional E-commerce Platform</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>123 Business Street</p>
                  <p>New York, NY 10001</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Email: admin@store.com</p>
                  <p>Website: www.adminstore.com</p>
                </div>
              </div>

              <div className="text-right">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                  <Badge 
                    variant={order.orderStatus === 'Delivered' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {order.orderStatus || 'Processing'}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-semibold">Invoice #:</span> {invoiceNumber}</p>
                  <p><span className="font-semibold">Date:</span> {format(orderDate, 'MMM dd, yyyy')}</p>
                  <p><span className="font-semibold">Due Date:</span> {format(orderDate, 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Bill To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{customerName}</p>
                  <p>{order.user?.email || 'N/A'}</p>
                  {order.shippingInfo && (
                    <>
                      <p>{order.shippingInfo.address}</p>
                      <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.pincode}</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Method:</h3>
                <div className="text-sm text-gray-600">
                  <p className="capitalize">{order.paymentInfo?.method || 'Online Payment'}</p>
                  {order.paymentInfo?.razorpayPaymentId && (
                    <p>Payment ID: {order.paymentInfo.razorpayPaymentId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 print:bg-gray-100">
                    <th className="text-left p-3 border-b text-sm font-semibold text-gray-900">Item</th>
                    <th className="text-center p-3 border-b text-sm font-semibold text-gray-900">Quantity</th>
                    <th className="text-right p-3 border-b text-sm font-semibold text-gray-900">Unit Price</th>
                    <th className="text-right p-3 border-b text-sm font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems?.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product?.title || item.product || 'Product'}
                          </p>
                          {item.color && (
                            <p className="text-gray-500 text-xs">Color: {item.color}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center text-sm">{item.quantity}</td>
                      <td className="p-3 text-right text-sm">₹{item.price?.toFixed(2) || '0.00'}</td>
                      <td className="p-3 text-right text-sm font-medium">
                        ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>₹0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t print:border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions:</h4>
                  <p className="text-sm text-gray-600">
                    Payment is due within 30 days. Late payments may incur additional charges.
                    All sales are final. Returns accepted within 14 days of delivery.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Thank You:</h4>
                  <p className="text-sm text-gray-600">
                    Thank you for your business! We appreciate your trust in our products and services.
                    If you have any questions, please don't hesitate to contact us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 