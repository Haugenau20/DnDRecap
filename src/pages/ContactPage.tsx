// src/pages/ContactPage.tsx
import React from 'react';
import Typography from '../components/core/Typography';
import ContactForm from '../components/features/contact/ContactForm';
import { Mail, MessageSquare, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Typography variant="h1" className="mb-6">
        Contact Us
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Typography color="secondary" className="mb-6">
            Have questions about our D&D Campaign Companion? Want to report a bug or suggest a feature?
            We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
          </Typography>
          
          <ContactForm />
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="text-blue-500" />
              <Typography variant="h4">Get In Touch</Typography>
            </div>
            <Typography color="secondary">
              We welcome your questions, feedback, and suggestions to help improve the D&D Campaign Companion.
            </Typography>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="text-blue-500" />
              <Typography variant="h4">Email</Typography>
            </div>
            <Typography color="secondary">
              Use the form to send us an email. We've protected our email address to prevent spam.
            </Typography>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-blue-500" />
              <Typography variant="h4">Response Time</Typography>
            </div>
            <Typography color="secondary">
              We aim to respond to all inquiries within 1-2 weeks.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;