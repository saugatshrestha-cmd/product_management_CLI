export interface EmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, any>;
}

export type EmailTemplateName = 
    | 'welcome' 
    | 'orderConfirmation' ;