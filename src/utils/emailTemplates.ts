import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { convert } from 'html-to-text';

type TemplateData = Record<string, any>;
type CompiledTemplates = Record<string, HandlebarsTemplateDelegate>;

const templateDir = path.join(__dirname, '..', 'templates');
const templateCache: CompiledTemplates = {};

function preloadTemplates(): void {
    const files = fs.readdirSync(templateDir);

    for (const file of files) {
        if (file.endsWith('.html')) {
            const templateName = path.basename(file, '.html');
            const filePath = path.join(templateDir, file);
            const source = fs.readFileSync(filePath, 'utf8');
            const compiled = Handlebars.compile(source);
            templateCache[templateName] = compiled;
        }
    }
}

// Preload templates when this module is imported
preloadTemplates();

export function getEmailTemplate(templateName: string, data: TemplateData): { html: string; text: string } {
    const template = templateCache[templateName];

    if (!template) {
        throw new Error(`Email template "${templateName}" not found.`);
    }

    if (!data || typeof data !== 'object') {
        throw new Error(`Invalid data for template "${templateName}". Expected an object.`);
    }

    const html = template(data);
    const text = convert(html, {
        wordwrap: 130,
        selectors: [
        { selector: 'a', options: { hideLinkHrefIfSameAsText: true } }
        ]
    });

    return { html, text };
}
