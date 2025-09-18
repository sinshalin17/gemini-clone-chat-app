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

type Country = {
  name: { common: string };
  idd: { root: string; suffixes?: string[] };
  cca2: string;
};

export default function AuthPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((res) => res.json())
      .then((data) => {
        setCountries(
          data.filter((c: Country) => c.idd && c.idd.root && c.cca2)
        );
      });
  }, []);

  const onSubmit = (data: AuthFormData) => {
    setLoading(true);
    setTimeout(() => {
      setOtp('123456'); // Simulate OTP
      setOtpSent(true);
      setLoading(false);
    }, 1200);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (otpInput === otp) {
        setSuccess(true);
      }
      setLoading(false);
    }, 1000);
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
            {countries.map((c) => {
              // Compose full dial code (root + first suffix if available)
              const dialCode = c.idd.root + (c.idd.suffixes && c.idd.suffixes.length > 0 ? c.idd.suffixes[0] : '');
              return (
                <option key={c.cca2} value={c.cca2}>
                  {c.name.common} ({dialCode})
                </option>
              );
            })}
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
        <form
          onSubmit={handleOtpVerify}
          className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md mt-4"
        >
          <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
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
          {otpInput && otpInput !== otp && !loading && (
            <span className="text-red-500 text-sm block mt-2">Invalid OTP</span>
          )}
        </form>
      )}
    </div>
  );
}
