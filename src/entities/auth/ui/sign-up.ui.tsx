'use client'

import { useEffect, useState } from "react"
import { AuthShell, Eyebrow, Field, PrimaryButton, SwitchLink } from ".."
import { useAuth } from "@/hooks/AuthContext"
import { useRouter } from "next/navigation"

export const SignUpPage = () => {
    const { register, user } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const route = useRouter();

    useEffect(() => {
        if (user) route.push('/');
    }, [user])

    console.log(user)

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        register(form.name, form.email, form.password);
        console.log("signup", form) // TODO
    }

    return (
        <AuthShell switchNode={<SwitchLink text="Уже с нами?" label="Вход" href="/sign-in" />}>
            <Eyebrow>Регистрация</Eyebrow>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-zinc-900">
                Создать аккаунт
            </h1>
            <p className="mt-2 text-xs text-zinc-500">
                Присоединяйтесь к luxf.light.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
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
                <PrimaryButton>Создать аккаунт</PrimaryButton>
            </form>

            <p className="mt-5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 leading-relaxed">
                Регистрируясь, вы соглашаетесь с{" "}
                <a href="/terms" className="underline hover:text-zinc-900">условиями</a> и{" "}
                <a href="/privacy" className="underline hover:text-zinc-900">политикой</a>.
            </p>
        </AuthShell>
    )
}
