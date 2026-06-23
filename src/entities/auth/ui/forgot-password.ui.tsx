'use client'

import { useEffect, useRef, useState } from "react"
import { AuthShell, Eyebrow, Field, PrimaryButton, SwitchLink } from ".."
import { motion } from "framer-motion"
import Link from "next/link"
import { authApi } from "@/lib/api"
import { toast } from "sonner"
import { Loader2, Mail } from "lucide-react"

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const digits = value.padEnd(6, '').split('').slice(0, 6);

    const handleChange = (i: number, raw: string) => {
        const digit = raw.replace(/\D/g, '').slice(-1);
        const arr = [...digits];
        arr[i] = digit;
        onChange(arr.join('').trimEnd());
        if (digit && i < 5) refs.current[i + 1]?.focus();
    };

    const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (digits[i]) {
                const arr = [...digits];
                arr[i] = '';
                onChange(arr.join('').trimEnd());
            } else if (i > 0) {
                refs.current[i - 1]?.focus();
                const arr = [...digits];
                arr[i - 1] = '';
                onChange(arr.join('').trimEnd());
            }
            e.preventDefault();
        }
        if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
        if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted);
        refs.current[Math.min(pasted.length, 5)]?.focus();
    };

    return (
        <div className="flex gap-2 justify-center">
            {[0, 1, 2, 3, 4, 5].map(i => (
                <input
                    key={i}
                    ref={el => { refs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i] || ''}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    autoFocus={i === 0}
                    className={`w-11 h-14 rounded-xl border-2 text-center text-xl font-black outline-none transition-colors focus:border-zinc-900 focus:bg-white ${
                        digits[i] ? 'border-zinc-300 bg-zinc-50' : 'border-zinc-200 bg-white'
                    }`}
                />
            ))}
        </div>
    );
}

export const ForgotPasswordPage = () => {
    const [step, setStep] = useState<'email' | 'reset' | 'done'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const sendCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setStep('reset');
            setCountdown(60);
            toast.success(`Код отправлен на ${email}`);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(msg || 'Пользователь с таким email не найден.');
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (code.length !== 6) { toast.error('Введите 6-значный код'); return; }
        if (!newPassword) { toast.error('Введите новый пароль'); return; }
        if (newPassword !== confirmPassword) { toast.error('Пароли не совпадают'); return; }
        if (newPassword.length < 6) { toast.error('Пароль должен быть не менее 6 символов'); return; }
        setLoading(true);
        try {
            await authApi.resetPassword({ email, code, newPassword });
            setStep('done');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(msg || 'Неверный или устаревший код.');
            setCode('');
        } finally {
            setLoading(false);
        }
    };

    const resend = async () => {
        if (countdown > 0) return;
        setResending(true);
        try {
            await authApi.forgotPassword(email);
            setCountdown(60);
            setCode('');
            toast.success('Код отправлен повторно');
        } catch {
            toast.error('Не удалось отправить код');
        } finally {
            setResending(false);
        }
    };

    if (step === 'done') {
        return (
            <AuthShell switchNode={<SwitchLink text="Вспомнили?" label="Вход" href="/sign-in" />}>
                <Eyebrow>Готово</Eyebrow>
                <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-zinc-900">Пароль изменён</h1>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-4">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Ваш пароль успешно обновлён. Теперь можете войти с новым паролем.
                    </p>
                    <Link
                        href="/sign-in"
                        className="inline-flex text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-zinc-900 pb-1 hover:opacity-60 transition-opacity"
                    >
                        Войти в аккаунт →
                    </Link>
                </motion.div>
            </AuthShell>
        );
    }

    if (step === 'reset') {
        return (
            <AuthShell switchNode={<SwitchLink text="Вспомнили?" label="Вход" href="/sign-in" />}>
                <Eyebrow>Восстановление</Eyebrow>
                <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-zinc-900">
                    Новый пароль
                </h1>
                <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                    Код отправлен на{' '}
                    <span className="font-bold text-zinc-800">{email}</span>
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <Mail size={11} />
                    Проверьте папку «Спам», если не видите письма
                </div>

                <form onSubmit={resetPassword} className="mt-6 space-y-4">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Код из письма</p>
                        <OtpInput value={code} onChange={setCode} />
                    </div>

                    <Field
                        label="Новый пароль"
                        type="password"
                        placeholder="Не менее 6 символов"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                    <Field
                        label="Повторите пароль"
                        type="password"
                        placeholder="Повторите пароль"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />

                    <PrimaryButton disabled={loading}>
                        {loading
                            ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Сохраняем…</span>
                            : 'Сохранить пароль'
                        }
                    </PrimaryButton>
                </form>

                <div className="mt-4 text-center">
                    {countdown > 0 ? (
                        <p className="text-[10px] font-mono text-zinc-400">
                            Повторная отправка через {countdown} сек.
                        </p>
                    ) : (
                        <button
                            onClick={resend}
                            disabled={resending}
                            className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors disabled:opacity-50"
                        >
                            {resending ? 'Отправляем…' : 'Отправить код повторно'}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => { setStep('email'); setCode(''); }}
                    className="mt-2 w-full text-center text-[10px] font-mono text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    ← Изменить email
                </button>
            </AuthShell>
        );
    }

    return (
        <AuthShell switchNode={<SwitchLink text="Вспомнили?" label="Вход" href="/sign-in" />}>
            <Eyebrow>Восстановление</Eyebrow>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-zinc-900">
                Сброс пароля
            </h1>
            <p className="mt-2 text-xs text-zinc-500">
                Укажите e-mail — пришлём код для восстановления.
            </p>

            <form onSubmit={sendCode} className="mt-6 space-y-3.5">
                <Field
                    label="E-mail"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <PrimaryButton disabled={loading}>
                    {loading
                        ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Отправляем…</span>
                        : 'Отправить код'
                    }
                </PrimaryButton>
            </form>
        </AuthShell>
    );
};
