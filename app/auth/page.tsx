"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  phone: z.string().min(8, 'Enter a valid phone number'),
  country: z.string().min(1, 'Select a country'),
});

type AuthFormData = z.infer<typeof schema>;


type CountryCode = {
  name: string;
  code: string;
};

const COUNTRY_CODES: CountryCode[] = [
  { name: 'United States', code: '+1' },
  { name: 'India', code: '+91' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'Canada', code: '+1' },
  { name: 'Australia', code: '+61' },
  { name: 'Germany', code: '+49' },
  { name: 'France', code: '+33' },
  { name: 'Brazil', code: '+55' },
  { name: 'Japan', code: '+81' },
  { name: 'China', code: '+86' },
  { name: 'South Africa', code: '+27' },
  { name: 'Russia', code: '+7' },
  { name: 'Mexico', code: '+52' },
  { name: 'Italy', code: '+39' },
  { name: 'Spain', code: '+34' },
  { name: 'Singapore', code: '+65' },
  { name: 'New Zealand', code: '+64' },
  { name: 'Pakistan', code: '+92' },
  { name: 'Bangladesh', code: '+880' },
  { name: 'Indonesia', code: '+62' },
  // ...add more as needed
];

const AuthPage = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [otpError, setOtpError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
  });



  const onSubmit = (data: AuthFormData) => {
    setLoading(true);
    setOtpMessage('');
    setOtpError('');
    setTimeout(() => {
      setOtp('123456'); // Simulate OTP
      setOtpSent(true);
      setLoading(false);
      setOtpMessage('OTP sent to your phone (simulated). Use 123456.');
    }, 1200);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOtpError('');
    setTimeout(() => {
      if (otpInput === otp) {
        setSuccess(true);
        setOtpError('');
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
      setLoading(false);
    }, 1200);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Login Successful!</h2>
        <p className="text-green-600">Welcome to Gemini Chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-6">Login / Signup</h2>
        <div className="mb-4">
          <label className="block mb-1">Country</label>
          <select
            {...register('country')}
            className="w-full border rounded px-3 py-2"
            disabled={otpSent}
          >
            <option value="">Select country</option>
            {COUNTRY_CODES.map((c) => (
              <option key={c.code + c.name} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
          {errors.country && (
            <span className="text-red-500 text-sm">{errors.country.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Phone Number</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full border rounded px-3 py-2"
            disabled={otpSent}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>
        {!otpSent ? (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        ) : null}
      </form>
      {otpSent && (
        <form onSubmit={handleOtpVerify} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md mt-4">
          <label className="block mb-1">Enter OTP</label>
          {otpMessage && (
            <span className="text-green-600 text-sm block mb-2">{otpMessage}</span>
          )}
          <input
            type="text"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
            maxLength={6}
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          {otpError && (
            <span className="text-red-500 text-sm block mt-2">{otpError}</span>
          )}
        </form>
      )}
    </div>
  );
}

export default AuthPage;
