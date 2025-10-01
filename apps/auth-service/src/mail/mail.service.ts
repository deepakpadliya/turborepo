import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import emailjs from '@emailjs/nodejs';

@Injectable()
export class MailService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;
  private privateKey: string;

  constructor(
    @Inject(ConfigService) private cs: ConfigService
  ) {
    this.serviceId = this.cs.get('EMAILJS_SERVICE_ID') || '';
    this.templateId = this.cs.get('EMAILJS_TEMPLATE_ID') || '';
    this.publicKey = this.cs.get('EMAILJS_PUBLIC_KEY') || '';
    this.privateKey = this.cs.get('EMAILJS_PRIVATE_KEY') || '';
  }

  async sendResetEmail(to: string, token: string) {
    try {
      const resetUrl = `${this.cs.get('FRONTEND_URL') || 'http://localhost:3000'}/reset-password?token=${token}`;
      
      const templateParams = {
        to_email: to,
        reset_url: resetUrl,
        token: token,
        message: 'Click the link to reset your password. The link expires shortly.',
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams,
        {
          publicKey: this.publicKey,
          privateKey: this.privateKey,
        }
      );

      console.log('Email sent successfully:', response.status, response.text);
      return response;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send reset email');
    }
  }

  async sendWelcomeEmail(to: string, name?: string) {
    try {
      const templateParams = {
        to_email: to,
        user_name: name || 'User',
        message: 'Welcome to our platform! Your account has been created successfully.',
      };

      const response = await emailjs.send(
        this.serviceId,
        this.cs.get('EMAILJS_WELCOME_TEMPLATE_ID') || this.templateId, // Use separate template or fallback
        templateParams,
        {
          publicKey: this.publicKey,
          privateKey: this.privateKey,
        }
      );

      console.log('Welcome email sent successfully:', response.status, response.text);
      return response;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }
}
