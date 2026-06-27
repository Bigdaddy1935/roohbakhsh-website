import OrderPaymentPage from "@/components/features/payment/OrderPaymentPage";

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <OrderPaymentPage orderId={orderId} />;
}
