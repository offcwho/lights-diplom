'use client'

import { useEffect, useState } from "react"
import { AuthShell, Eyebrow, Field, PrimaryButton, SwitchLink } from ".."
import Link from "next/link"
import { useAuth } from "@/hooks/AuthContext"
import { useRouter } from "next/navigation"

export const SignInPage = () => {
    const { login, user } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" })
    const route = useRouter();

    useEffect(() => {
        if (user) route.push('/');
    }, [user])

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        login(form.email, form.password)
        console.log("login", form) // TODO
    }

    return (
        <AuthShell switchNode={<SwitchLink text="Нет аккаунта?" label="Регистрация" href="/sign-up" />}>
            <Eyebrow>Авторизация</Eyebrow>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-zinc-900">Вход</h1>
            <p className="mt-2 text-xs text-zinc-500">
                Войдите, чтобы управлять заказами и избранным.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
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
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <div className="flex justify-end">
                    <Link
                        href="/forgot-password"
                        className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        Забыли пароль?
                    </Link>
                </div>
                <PrimaryButton>Войти</PrimaryButton>
            </form>
        </AuthShell>
    )
}