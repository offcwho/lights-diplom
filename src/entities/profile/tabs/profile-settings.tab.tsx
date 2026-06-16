'use client';

import { useState, useEffect, useRef } from 'react';
import { usersApi } from '@/lib/api'; // Укажи правильный путь к твоему API// Твой хук авторизации
import { Toggle } from '@/components/Toggle';
import { upload } from '@vercel/blob/client';
import { useAuth } from '@/hooks/AuthContext';

export const ProfileSettingsTab = () => {
    const { user, refreshUser } = useAuth(); // Предполагается, что refreshUser обновляет глобальное состояние юзера

    // Состояния уведомлений
    const [notifyOrders, setNotifyOrders] = useState(true);
    const [notifyPromo, setNotifyPromo] = useState(false);

    // Состояния полей профиля
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    // Состояния для лоадеров
    const [isSaving, setIsSaving] = useState(false);
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);

    // Ссылка на скрытый инпут выбора файла
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Синхронизируем данные из useAuth при монтировании или обновлении профиля
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
        }
    }, [user]);

    // Хэндлер сохранения текстовых данных
    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            await usersApi.updateProfile({ name, phone, address });
            if (refreshUser) await refreshUser(); // Обновляем стейт в контексте
            alert('Профиль успешно обновлен');
        } catch (error) {
            console.error('Ошибка при сохранении профиля:', error);
            alert('Не удалось сохранить изменения');
        } finally {
            setIsSaving(false);
        }
    };

    // Хэндлер выбора и моментальной загрузки аватарки
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsAvatarUploading(true);

            // 1. Загружаем файл напрямую в Vercel Blob, минуя бэкенд
            const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/upload', // путь к нашему API роуту из Шага 2
            });

            // 2. Файл загружен! Теперь отправляем текстовую ссылку (newBlob.url) в твой NestJS
            // Для этого в твоем usersApi.updateProfile должно быть предусмотрено поле для URL аватарки
            await usersApi.updateProfile({
                name,
                phone,
                address,
                avatarUrl: newBlob.url //-> передаешь строку в NestJS, который сохранит её в Prisma
            });

            if (refreshUser) await refreshUser();
            alert('Аватар успешно изменен!');
        } catch (error) {
            console.error('Ошибка при работе с Vercel Blob:', error);
            alert('Не удалось сохранить изображение');
        } finally {
            setIsAvatarUploading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-zinc-700">
                Настройки
            </h2>

            {/* Данные профиля */}
            <div className="bg-[#F5F4F1] rounded-3xl p-4 sm:p-6 border border-black/5 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
                    <div>
                        <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
                            Профиль
                        </h3>
                        <p className="text-[11px] text-zinc-500 mt-1">Управляйте личной информацией и аватаром</p>
                    </div>

                    {/* Секция Аватарки */}
                    <div className="flex items-center gap-4">
                        <div
                            onClick={() => !isAvatarUploading && fileInputRef.current?.click()}
                            className="group relative w-16 h-16 rounded-full bg-white border border-black/10 flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-all"
                        >
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={name}
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${isAvatarUploading ? 'opacity-40' : 'opacity-100'}`}
                                />
                            ) : (
                                <span className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                                    {name ? name.slice(0, 2) : 'LX'}
                                </span>
                            )}

                            {/* Overlay при наведении */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[9px] text-white font-bold uppercase tracking-wider">Изменить</span>
                            </div>

                            {/* Индикатор загрузки внутри круга */}
                            {isAvatarUploading && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        {/* Скрытый нативный инпут */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <div className="text-left">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[11px] font-bold uppercase tracking-wider underline hover:text-zinc-600 transition-colors"
                            >
                                Загрузить фото
                            </button>
                            <p className="text-[9px] text-zinc-400 mt-1">JPG, PNG или SVG. До 5MB</p>
                        </div>
                    </div>
                </div>

                {/* Поля формы */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">Имя</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Константин"
                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-black/30 transition-colors"
                        />
                    </label>

                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">Email (Не редактируется)</span>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full bg-zinc-100/60 border border-black/5 text-zinc-400 rounded-xl px-4 py-2.5 text-xs font-medium cursor-not-allowed outline-none"
                        />
                    </label>

                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">Телефон</span>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+7 (999) 000-00-00"
                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-black/30 transition-colors"
                        />
                    </label>

                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">Адрес доставки</span>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="г. Москва, ул. Световая, д. 10"
                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-black/30 transition-colors"
                        />
                    </label>
                </div>

                <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2"
                >
                    {isSaving && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
            </div>

            {/* Уведомления */}
            <div className="bg-[#F5F4F1] rounded-3xl p-4 sm:p-6 border border-black/5 space-y-1">
                <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                    Уведомления
                </h3>
                {/* Компонент Toggle оставлен без изменений, стейты привязаны сверху */}
                <Toggle
                    label="Статус заказов"
                    description="Email о смене статуса доставки"
                    checked={notifyOrders}
                    onChange={setNotifyOrders}
                />
                <Toggle
                    label="Акции и новинки"
                    description="Редкие письма о новых коллекциях"
                    checked={notifyPromo}
                    onChange={setNotifyPromo}
                />
            </div>

            {/* Безопасность */}
            <div className="bg-[#F5F4F1] rounded-3xl p-4 sm:p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-xs font-bold">Пароль</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Последнее изменение: 3 месяца назад</p>
                </div>
                <button className="shrink-0 bg-white border border-black/10 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-all">
                    Изменить
                </button>
            </div>
        </div>
    );
};