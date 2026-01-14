
import React, { useState } from 'react';
import { Card, Button, Input } from '../components/UI';
import { Shield, Globe, Mail, Lock, ChevronRight, Github } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'login' | 'mfa'>('login');

  const handleNext = () => {
    if (step === 'login') setStep('mfa');
    else onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 via-slate-50 to-slate-50">
      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-2xl shadow-xl mb-4 text-white font-black italic text-3xl w-14 h-14">
            V
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Verdify</h1>
          <p className="text-slate-500 mt-2 font-medium">Enterprise-grade satellite analysis platform.</p>
        </div>

        <Card className="p-8 shadow-2xl border-none">
          {step === 'login' ? (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              <div className="space-y-4">
                <Input label="Business Email" placeholder="name@company.com" />
                <Input label="Password" type="password" placeholder="••••••••" />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                  <span className="text-slate-600 font-medium">Remember for 30 days</span>
                </label>
                <button className="font-bold text-indigo-600 hover:text-indigo-700">Forgot password?</button>
              </div>

              <Button onClick={handleNext} className="w-full group py-6 text-base shadow-lg shadow-indigo-100">
                Continue to Analysis
                <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or login with SSO</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="md" className="w-full font-bold">
                  <Globe className="w-4 h-4 mr-2 text-slate-400" />
                  Microsoft
                </Button>
                <Button variant="outline" size="md" className="w-full font-bold">
                  <Github className="w-4 h-4 mr-2 text-slate-400" />
                  GitHub
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Two-Factor Authentication</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-4">
                  We've sent a 6-digit verification code to your registered mobile device.
                </p>
              </div>
              
              <div className="flex justify-center gap-2">
                {[1,2,3,4,5,6].map(i => (
                  <input 
                    key={i} 
                    type="text" 
                    maxLength={1} 
                    className="w-10 h-12 text-center text-xl font-bold border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                    placeholder="-"
                  />
                ))}
              </div>

              <Button onClick={handleNext} className="w-full mt-4 py-6">
                Verify and Login
              </Button>

              <p className="text-xs text-slate-400 font-medium">
                Didn't receive the code? <button className="font-bold text-indigo-600">Resend via SMS</button>
              </p>
            </div>
          )}
        </Card>

        <p className="text-center mt-8 text-[11px] text-slate-400 max-w-sm mx-auto font-medium">
          By continuing, you agree to Verdify's <button className="underline">Terms of Service</button> and <button className="underline">Privacy Policy</button>.
        </p>
      </div>
    </div>
  );
};

export default Auth;
