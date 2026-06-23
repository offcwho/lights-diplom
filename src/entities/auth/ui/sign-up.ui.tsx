'use client'

import { useEffect, useRef, useState } from "react"
import { AuthShell, Eyebrow, Field, PrimaryButton, SwitchLink } from ".."
import { useAuth } from "@/hooks/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authApi } from "@/lib/api"
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

export const SignUpPage = () => {
    const { refreshUser, user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState<'form' | 'verify'>('form');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (user) router.push('/');
    }, [user]);

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const sendCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return;
        setLoading(true);
        try {
            await authApi.sendRegisterCode(form);
            setStep('verify');
            setCountdown(60);
            toast.success(`Код отправлен на ${form.email}`);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(msg || 'Не удалось отправить код. Попробуйте ещё раз.');
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (code.length !== 6) { toast.error('Введите 6-значный код'); return; }
        setLoading(true);
        try {
            await authApi.verifyRegisterCode({ email: form.email, code });
            await refreshUser();
            toast.success('Аккаунт создан! Добро пожаловать 🎉');
            router.push('/');
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
            await authApi.sendRegisterCode(form);
            setCountdown(60);
            setCode('');
            toast.success('Код отправлен повторно');
        } catch {
            toast.error('Не удалось отправить код');
        } finally {
            setResending(false);
        }
    };

    if (step === 'verify') {
        return (
            <AuthShell switchNode={<SwitchLink text="Уже с нами?" label="Вход" href="/sign-in" />}>
                <Eyebrow>Подтверждение</Eyebrow>
                <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-zinc-900">
                    Введите код
                </h1>
                <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                    Мы отправили 6-значный код на{' '}
                    <span className="font-bold text-zinc-800">{form.email}</span>
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <Mail size={11} />
                    Проверьте папку «Спам», если не видите письма
                </div>

                <form onSubmit={verifyCode} className="mt-6 space-y-5">
                    <OtpInput value={code} onChange={setCode} />

                    <PrimaryButton disabled={loading || code.length !== 6}>
                        {loading
                            ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Проверка…</span>
                            : 'Подтвердить'
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
                    onClick={() => { setStep('form'); setCode(''); }}
                    className="mt-2 w-full text-center text-[10px] font-mono text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    ← Изменить email
                </button>
            </AuthShell>
        );
    }

    return (
        <AuthShell switchNode={<SwitchLink text="Уже с нами?" label="Вход" href="/sign-in" />}>
            <Eyebrow>Регистрация</Eyebrow>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-zinc-900">
                Создать аккаунт
            </h1>
            <p className="mt-2 text-xs text-zinc-500">
                Присоединяйтесь к Свет.Ру.
            </p>

            <form onSubmit={sendCode} className="mt-6 space-y-3.5">
                <Field
                    label="Имя"
                    type="text"
                    placeholder="Ваше имя"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Field
                    label="E-mail"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Field
                    label="Пароль"
                    type="password"
                    placeholder="Придумайте пароль"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <PrimaryButton disabled={loading}>
                    {loading
                        ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Отправляем код…</span>
                        : 'Создать аккаунт'
                    }
                </PrimaryButton>
            </form>

            <p className="mt-5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 leading-relaxed">
                Регистрируясь, вы соглашаетесь с{' '}
                <a href="/terms" className="underline hover:text-zinc-900">условиями</a> и{' '}
                <a href="/privacy" className="underline hover:text-zinc-900">политикой</a>.
            </p>
        </AuthShell>
    );
};
