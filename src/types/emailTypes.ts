export interface EmailOptions<T = Record<string, any>> {
    to: string;
    subject: string;
    templateName: EmailTemplateName;
    templateData: T;
    attachments?: EmailAttachment[];
    from?: string;
    html?: string;  
    text?: string;
}

export interface EmailAttachment {
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
}

export type EmailTemplateName = 
    | 'welcome' 
    | 'orderConfirmation'
    | 'orderShipped'
    | 'receiptEmail';