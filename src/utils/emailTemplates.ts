type TemplateData = Record<string, any>;

export function getEmailTemplate(templateName: string, data: TemplateData): { html: string; text: string } {
    const templates: Record<string, (data: TemplateData) => { html: string; text: string }> = {
    welcome: (data) => ({
        html: `<h1>Welcome, ${data.name}!</h1><p>Thank you for registering with us.</p>`,
        text: `Welcome, ${data.name}!\nThank you for registering with us.`,
    }),
    orderConfirmation: (data) => ({
        html: `<h1>Order Confirmation</h1><p>Your order #${data.orderId} has been received.</p>`,
        text: `Order Confirmation\nYour order #${data.orderId} has been received.`,
    }),
    };

    if (!templates[templateName]) {
    throw new Error(`Template ${templateName} not found`);
    }

    return templates[templateName](data);
}