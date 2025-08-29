import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { create } from '@react-email/components';
import { Text, Button, Container, Head, Body, Heading, Hr, Preview, Section } from '@react-email/components';
import { useTheme } from '../../context/ThemeContext';
import { use3DAnimation } from '../../hooks/use3DAnimation';

// Define the validation schema using Yup
const contactSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  message: yup.string().required('Message is required'),
}).required();

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const ContactSlice = () => {
  const { theme } = useTheme();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormValues) => {
    setSubmissionError(null);

    try {
      // 1. Create React Email
      const compiledEmail = create().compile(
        React.createElement(
          EmailTemplate, { ...data }
        )
      );
      // 2. Send Email using react-email
      // TODO: Replace with actual email sending logic (e.g., Resend, Nodemailer)

      //   await fetch('/api/send', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       to: 'your-email@example.com', // Replace with your email
      //       subject: `New Contact Form Submission from ${data.name}`,
      //       html: compiledEmail,
      //     }),
      //   });

      // Simulate success for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      reset();
    } catch (error: any) {
      console.error('Email sending failed:', error);
      setSubmissionError('Failed to send message. Please try again.');
    }
  };

  return (
    <section className="bg-gray-100 py-12 dark:bg-gray-800 transition-colors">
      <Container className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 transition-colors">Contact Us</h2>
        {submissionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{submissionError}</span>
          </div>
        )}
        {isSubmitSuccessful && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">Your message has been sent. We'll get back to you soon!</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Name</label>
            <div className="mt-1">
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-colors ${errors.name ? 'border-red-500' : ''}`}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400 transition-colors">{errors.name.message}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Email</label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-colors ${errors.email ? 'border-red-500' : ''}`}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400 transition-colors">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Message</label>
            <div className="mt-1">
              <textarea
                id="message"
                rows={4}
                {...register("message")}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-colors ${errors.message ? 'border-red-500' : ''}`}
                aria-invalid={errors.message ? "true" : "false"}
              />
              {errors.message && <p className="mt-2 text-sm text-red-600 dark:text-red-400 transition-colors">{errors.message.message}</p>}
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </Container>
    </section>
  );
};

export default ContactSlice;

const EmailTemplate = ({ name, email, message }: ContactFormValues) => (
  <React.Fragment>
    <Head>
      <title>Contact Form Submission</title>
    </Head>
    <Preview>New Contact Form Submission</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Contact Form Submission</Heading>
        <Section>
          <Text style={paragraph}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={paragraph}>
            <strong>Email:</strong> {email}
          </Text>
        </Section>
        <Section style={contentSection}>
          <Text style={h2}>Message:</Text>
          <Text style={paragraph}>{message}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          This email was generated automatically. Please do not reply.
        </Text>
      </Container>
    </Body>
  </React.Fragment>
);

const main = {
  backgroundColor: '#fff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '24px',
  maxWidth: '600px',
};

const h1 = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#202020',
  marginBottom: '20px',
  textAlign: 'center',
};

const h2 = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#202020',
  marginBottom: '12px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#4a4a4a',
  marginBottom: '16px',
};

const contentSection = {
  marginBottom: '20px',
};

const hr = {
  borderColor: '#e0e0e0',
  margin: '20px 0',
};

const footer = {
  fontSize: '12px',
  color: '#999999',
  marginTop: '20px',
  textAlign: 'center',
};