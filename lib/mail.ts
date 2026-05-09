/**
 * Hexa System Notification Service
 * In production, this would use a real provider like Resend or SendGrid.
 */
export async function sendAdminOrderNotification(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  tier: string;
  variant: string;
  price: number;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  
  console.log(`[MAILER] Sending order notification to ${adminEmail}`);
  console.log(`[MAILER] Subject: NEW ORDER - ${order.tier} - ${order.customerName}`);
  console.log(`[MAILER] Content: 
    New Hexa Card order received.
    - Order ID: ${order.id}
    - Customer: ${order.customerName} (${order.customerEmail})
    - Plan: ${order.tier} (${order.variant})
    Total: ${order.price.toLocaleString()} JPY

    Please access the Central Asset Ledger to process:
    ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/ledger
    `);

  // To implement Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ ... });
}
