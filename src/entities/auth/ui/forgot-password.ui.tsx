'use client'

import { useState } from "react"
import { AuthShell, Eyebrow, Field, PrimaryButton, SwitchLink } from ".."
import { motion } from "framer-motion"
import Link from "next/link"

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("")
    const [sent, setSent] = useState(false)

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("reset", email) // TODO
        setSent(true)
    }

    return (
        <AuthShell switchNode={<SwitchLink text="Вспомнили?" label="Вход" href="/sign-in" />}>
            <Eyebrow>Восстановление</Eyebrow>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-zinc-900">
                Сброс пароля
            </h1>

            {sent ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 space-y-4">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Ссылка для сброса отправлена на{" "}
                        <span className="font-semibold text-zinc-900">{email}</span>. Перейдите по ней,
                        чтобы задать новый пароль.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-zinc-900 pb-1 hover:text-[#9a7b4f] hover:border-[#9a7b4f] transition-colors"
                    >
                        Вернуться ко входу
                    </Link>
                </motion.div>
            ) : (
                <>
                    <p className="mt-2 text-xs text-zinc-500">
                        Укажите e-mail — пришлём ссылку для восстановления.
                    </p>
                    <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
                        <Field
                            label="E-mail"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <PrimaryButton>Отправить ссылку</PrimaryButton>
                    </form>
                </>
            )}
        </AuthShell>
    )
}