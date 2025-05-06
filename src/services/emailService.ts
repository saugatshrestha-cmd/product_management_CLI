import nodemailer from 'nodemailer';
import { EmailOptions } from '@mytypes/emailTypes';
import { getEmailTemplate } from '@utils/emailTemplates';
import { injectable } from "tsyringe";


@injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
            this.transporter = nodemailer.createTransport({
                host: process.env.ETHEREAL_HOST || 'smtp.ethereal.email',
                port: parseInt(process.env.ETHEREAL_PORT || '587'),
                secure: process.env.ETHEREAL_SECURE === 'true',
                auth: {
                    user: process.env.ETHEREAL_USER,
                    pass: process.env.ETHEREAL_PASSWORD
                },
            });
    }

    async sendEmail(options: EmailOptions): Promise<void> {
    try {
        const { to, subject, templateName, templateData } = options;
        const { html, text } = getEmailTemplate(templateName, templateData);
        const mailOptions = {
        from: `"E-commerce App" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        text,
        html,
    };

        await this.transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
}
