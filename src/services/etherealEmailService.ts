import nodemailer from 'nodemailer';
import { injectable } from 'tsyringe';
import { logger } from '@utils/logger';
import { EmailOptions, EmailAttachment, EmailTemplateName } from '@mytypes/emailTypes';
import { getEmailTemplate } from '@utils/emailTemplates'; // Adjust path if needed

@injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    constructor() {
        const { ETHEREAL_USER, ETHEREAL_PASSWORD, ETHEREAL_HOST, ETHEREAL_PORT, ETHEREAL_SECURE } = process.env;
        if (!ETHEREAL_USER || !ETHEREAL_PASSWORD) {
            throw new Error('Ethereal credentials are not set in environment variables');
        }
        this.transporter = nodemailer.createTransport({
            host: ETHEREAL_HOST || 'smtp.ethereal.email',
            port: parseInt(ETHEREAL_PORT || '587'),
            secure: ETHEREAL_SECURE === 'true',
            auth: {
                user: ETHEREAL_USER,
                pass: ETHEREAL_PASSWORD,
            },
        });
    }

    public async sendEmail<T extends Record<string, any>>(options: EmailOptions<T>): Promise<void> {
        try {
            const { to, subject, templateName, templateData, attachments, from } = options;
            const { html, text } = getEmailTemplate(templateName, templateData);
            const mailOptions: nodemailer.SendMailOptions = {
                from: from || `"E-commerce App" <${process.env.EMAIL_FROM}>`,
                to,
                subject,
                html,
                text,
                attachments,
            };
            await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent to ${to} with template: ${templateName}`);
        } catch (error) {
            logger.error('Error sending email', { error, to: options.to, subject: options.subject });
            throw error;
        }
    }

    public async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            logger.error('Email transporter verification failed', { error });
            return false;
        }
    }
}
