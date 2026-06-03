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
  shippingAddress?: any;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const addr = order.shippingAddress || {};
  const addressText = addr.line1 
    ? `${addr.postal_code} ${addr.state}${addr.city}${addr.line1} ${addr.line2 || ""}`
    : "No address provided (Digital?)";
  
  console.log(`[MAILER] Sending order notification to ${adminEmail}`);
  console.log(`[MAILER] Subject: NEW ORDER - ${order.tier} - ${order.customerName}`);
  console.log(`[MAILER] Content: 
    New Hexa Relation order received.
    
    [Customer]
    - Name: ${order.customerName}
    - Email: ${order.customerEmail}
    
    [Plan]
    - Tier: ${order.tier}
    - Variant: ${order.variant}
    - Total: ${order.price.toLocaleString()} JPY

    [Shipping Address]
    - ${addressText}

    Please access the Central Asset Registry to process:
    ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/registry
    `);

  // To implement Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ ... });
}
