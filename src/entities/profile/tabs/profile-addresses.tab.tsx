'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, MapPin, Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import { addressesApi } from '@/lib/api';
import type { Address } from '@/lib/types';
import { toast } from 'sonner';

/* ── Form state ─────────────────────────────────────────────────── */
type FormData = {
    label: string;
    city: string;
    street: string;
    house: string;
    apartment: string;
    zipCode: string;
    isDefault: boolean;
};

const EMPTY: FormData = { label: '', city: '', street: '', house: '', apartment: '', zipCode: '', isDefault: false };

function toForm(a: Address): FormData {
    return {
        label: a.label ?? '',
        city: a.city,
        street: a.street,
        house: a.house,
        apartment: a.apartment ?? '',
        zipCode: a.zipCode ?? '',
        isDefault: a.isDefault,
    };
}

/* ── Field component ────────────────────────────────────────────── */
function Field({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <input
                {...props}
                className="w-full bg-white border border-black/8 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-black/30 transition-colors placeholder:text-zinc-300"
            />
        </div>
    );
}

/* ── Address card ───────────────────────────────────────────────── */
function AddressCard({ address, onEdit, onDelete, onSetDefault, deleting }: {
    address: Address;
    onEdit: () => void;
    onDelete: () => void;
    onSetDefault: () => void;
    deleting: boolean;
}) {
    const full = [address.street, `д. ${address.house}`, address.apartment ? `кв. ${address.apartment}` : ''].filter(Boolean).join(', ');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className={`relative bg-white border rounded-2xl p-4 flex flex-col gap-3 ${address.isDefault ? 'border-[#111111]/20 shadow-[0_4px_20px_rgba(0,0,0,0.06)]' : 'border-black/5'}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${address.isDefault ? 'bg-[#111111]' : 'bg-zinc-100'}`}>
                        <MapPin size={13} className={address.isDefault ? 'text-white' : 'text-zinc-400'} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-wide text-zinc-800 truncate">
                            {address.label || address.city}
                        </p>
                        {address.isDefault && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Основной</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {!address.isDefault && (
                        <button
                            onClick={onSetDefault}
                            title="Сделать основным"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                        >
                            <Star size={13} />
                        </button>
                    )}
                    <button
                        onClick={onEdit}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-black hover:bg-zinc-100 transition-colors"
                    >
                        <Pencil size={13} />
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={deleting}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                        {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                </div>
            </div>

            {/* Address lines */}
            <div className="text-xs text-zinc-500 leading-relaxed">
                <p className="font-bold text-zinc-700">{address.city}{address.zipCode ? `, ${address.zipCode}` : ''}</p>
                <p>{full}</p>
            </div>
        </motion.div>
    );
}

/* ── Modal ──────────────────────────────────────────────────────── */
function AddressModal({ initial, onSave, onClose, saving }: {
    initial: FormData;
    onSave: (data: FormData) => void;
    onClose: () => void;
    saving: boolean;
}) {
    const [form, setForm] = useState<FormData>(initial);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const set = (k: keyof FormData, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

    const validate = () => {
        const e: Partial<FormData> = {};
        if (!form.city.trim())   e.city   = 'required';
        if (!form.street.trim()) e.street = 'required';
        if (!form.house.trim())  e.house  = 'required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) onSave(form);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md bg-white rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90svh] overflow-y-auto"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-tight">
                        {initial.city ? 'Редактировать адрес' : 'Новый адрес'}
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                        <X size={14} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <Field label="Название (необязательно)" placeholder="Дом, Работа…" value={form.label} onChange={e => set('label', e.target.value)} />

                    <div className="grid grid-cols-2 gap-3">
                        <div className={errors.city ? 'ring-1 ring-red-400 rounded-xl' : ''}>
                            <Field label="Город" placeholder="Москва" required value={form.city} onChange={e => set('city', e.target.value)} />
                        </div>
                        <Field label="Индекс" placeholder="101000" value={form.zipCode} onChange={e => set('zipCode', e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} />
                    </div>

                    <div className={errors.street ? 'ring-1 ring-red-400 rounded-xl' : ''}>
                        <Field label="Улица" placeholder="ул. Пушкина" required value={form.street} onChange={e => set('street', e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className={errors.house ? 'ring-1 ring-red-400 rounded-xl' : ''}>
                            <Field label="Дом" placeholder="12А" required value={form.house} onChange={e => set('house', e.target.value.replace(/[^0-9а-яёА-ЯЁa-zA-Z/\-]/g, '').slice(0, 10))} maxLength={10} />
                        </div>
                        <Field label="Квартира" placeholder="45" value={form.apartment} onChange={e => set('apartment', e.target.value.replace(/\D/g, '').slice(0, 5))} inputMode="numeric" maxLength={5} />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group pt-1">
                        <div
                            onClick={() => set('isDefault', !form.isDefault)}
                            className={`w-4 h-4 rounded-md border-[1.5px] flex items-center justify-center shrink-0 transition-all ${form.isDefault ? 'bg-[#111111] border-transparent' : 'border-zinc-300 group-hover:border-zinc-500'}`}
                        >
                            {form.isDefault && <Check size={9} strokeWidth={3} className="text-white" />}
                        </div>
                        <span className="text-xs font-bold text-zinc-600 group-hover:text-black transition-colors">Сделать основным адресом</span>
                    </label>

                    {Object.keys(errors).length > 0 && (
                        <p className="text-[10px] text-red-500 font-bold">Заполните обязательные поля</p>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-[#111111] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-60"
                    >
                        {saving && <Loader2 size={13} className="animate-spin" />}
                        {saving ? 'Сохраняем…' : 'Сохранить'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}

/* ── Main tab ───────────────────────────────────────────────────── */
export const ProfileAddressesTab = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{ open: boolean; editing: Address | null }>({ open: false, editing: null });
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        addressesApi.list()
            .then(setAddresses)
            .catch(() => setAddresses([]))
            .finally(() => setLoading(false));
    }, []);

    const openAdd  = () => setModal({ open: true, editing: null });
    const openEdit = (a: Address) => setModal({ open: true, editing: a });
    const closeModal = () => setModal({ open: false, editing: null });

    const handleSave = async (data: FormData) => {
        setSaving(true);
        try {
            const dto = {
                label:     data.label || undefined,
                city:      data.city,
                street:    data.street,
                house:     data.house,
                apartment: data.apartment || undefined,
                zipCode:   data.zipCode   || undefined,
                isDefault: data.isDefault,
            };
            if (modal.editing) {
                const updated = await addressesApi.update(modal.editing.id, dto);
                setAddresses(prev => {
                    const list = prev.map(a => a.id === updated.id ? updated : a);
                    return data.isDefault ? list.map(a => ({ ...a, isDefault: a.id === updated.id })) : list;
                });
                toast.success('Адрес обновлён');
            } else {
                const created = await addressesApi.create(dto);
                setAddresses(prev => {
                    const list = data.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : prev;
                    return [...list, created];
                });
                toast.success('Адрес добавлен');
            }
            closeModal();
        } catch {
            toast.error('Не удалось сохранить адрес');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await addressesApi.remove(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
            toast.success('Адрес удалён');
        } catch {
            toast.error('Не удалось удалить адрес');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            const updated = await addressesApi.update(id, { isDefault: true });
            setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === updated.id })));
            toast.success('Основной адрес изменён');
        } catch {
            toast.error('Не удалось изменить основной адрес');
        }
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-white/60 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-base font-black uppercase tracking-wider text-zinc-800">Адреса доставки</h2>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-[#111111] text-white px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                    <Plus size={12} /> Добавить
                </button>
            </div>

            <AnimatePresence mode="popLayout">
                {addresses.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center mb-4 shadow-sm">
                            <MapPin size={18} className="text-zinc-300" strokeWidth={1.5} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-tight text-zinc-700 mb-1">Нет адресов</p>
                        <p className="text-[11px] text-zinc-400 mb-5">Добавьте адрес для быстрого оформления заказов</p>
                        <button
                            onClick={openAdd}
                            className="text-[10px] font-black uppercase tracking-widest bg-[#111111] text-white px-5 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
                        >
                            Добавить адрес
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <AnimatePresence mode="popLayout">
                            {addresses.map(a => (
                                <AddressCard
                                    key={a.id}
                                    address={a}
                                    onEdit={() => openEdit(a)}
                                    onDelete={() => handleDelete(a.id)}
                                    onSetDefault={() => handleSetDefault(a.id)}
                                    deleting={deletingId === a.id}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {modal.open && (
                    <AddressModal
                        initial={modal.editing ? toForm(modal.editing) : EMPTY}
                        onSave={handleSave}
                        onClose={closeModal}
                        saving={saving}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
