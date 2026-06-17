'use client'

import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface CartItem {
  id: string;
  quantity: number;
}

export default function FullSoftUiCatalog() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', quantity: 1 }
  ]);

  const products: Product[] = [
    { id: '1', name: 'Qweqw linear system', category: 'ОСВЕЩЕНИЕ', price: 1111, image: '' },
    { id: '2', name: 'Товар№1 подвесной свет', category: 'ОСВЕЩЕНИЕ', price: 1000, image: '' },
  ];

  return (
    // Мягкий базовый фон из референса
    <div className="min-h-screen bg-[#EBEAEF] text-neutral-800 font-sans antialiased p-6 md:p-10 selection:bg-neutral-200">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        {/* 1. ШАПКА / ПОИСККОВАЯ СТРОКА */}
        <header className="flex items-center justify-between gap-6 w-full">
          <div className="relative flex-1 max-w-xl">
            <span className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-neutral-400">
              <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" 
              placeholder="Поиск светильников..." 
              className="w-full bg-white border-none rounded-2xl pl-14 pr-14 py-4 text-sm shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all"
            />
            <button className="absolute inset-y-2 right-2 px-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl text-neutral-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-semibold text-neutral-500">
            <span>2 поз.</span>
            <div className="bg-white p-3.5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)] cursor-pointer hover:scale-105 transition-transform flex items-center justify-center">
              <svg className="w-5 h-5 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
            </div>
          </div>
        </header>

        {/* 2. БАНЕР "НОВАЯ КОЛЛЕКЦИЯ" (Огромный, белый, с мягким градиентом и тенями) */}
        <section className="relative overflow-hidden bg-white rounded-[36px] min-h-[340px] flex items-center px-16 shadow-[0_25px_55px_-15px_rgba(0,0,0,0.04)] group">
          <div className="max-w-xl z-10 space-y-5">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              Новая коллекция
            </h1>
            <p className="text-sm font-medium text-neutral-400 tracking-wide">Скидка 50% на первый заказ</p>
            <button className="bg-neutral-950 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0">
              Смотреть
            </button>
          </div>
          {/* Кресло/лампа справа, уходящая в край */}
          <div className="absolute right-12 bottom-0 w-[440px] h-[320px] transition-transform duration-700 group-hover:scale-105">
            <div className="w-full h-full bg-contain bg-bottom bg-no-repeat mix-blend-darken" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop')` }} />
          </div>
          {/* Мягкий салатовый акцентный кружочек-свет на фоне, как на референсе */}
          <div className="absolute top-10 left-1/3 w-72 h-72 bg-[#92C348]/10 rounded-full blur-[80px] pointer-events-none" />
        </section>

        {/* 3. КАТЕГОРИИ (Горизонтальный список закругленных белых плашек) */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-neutral-900 tracking-tight px-2">Категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { id: 'all', name: 'Все товары', count: '2 поз.', active: true, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              { id: 'chairs', name: 'Стулья', count: '0 поз.', active: false, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
              { id: 'armchairs', name: 'Кресла', count: '0 поз.', active: false, icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'lights', name: 'Свет', count: '0 поз.', active: false, icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
            ].map((cat) => (
              <button 
                key={cat.id}
                className={`flex items-center gap-4 p-5 rounded-[24px] text-left transition-all duration-300 ${
                  cat.active 
                    ? 'bg-neutral-950 text-white shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)]' 
                    : 'bg-white text-neutral-800 hover:scale-[1.02] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${cat.active ? 'bg-white/10' : 'bg-[#F4F3F8]'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">{cat.name}</p>
                  <p className={`text-xs mt-0.5 font-medium ${cat.active ? 'text-neutral-400' : 'text-neutral-400'}`}>{cat.count}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 4. ОСНОВНОЙ ДВУХКОЛОНОЧНЫЙ БЛОК */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ЛЕВАЯ ПАНЕЛЬ ФИЛЬТРОВ (Белый скругленный баббл) */}
          <aside className="w-full lg:w-[320px] bg-white rounded-[32px] p-8 space-y-8 shrink-0 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-50">
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
              <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-400">Световые сценарии</h3>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Category</h4>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="rounded-[6px] border-neutral-200 text-neutral-900 focus:ring-0 w-5 h-5 transition-all bg-neutral-50" />
                <span className="text-sm font-semibold text-neutral-600 group-hover:text-neutral-900 transition-colors">Освещение</span>
              </label>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Color Palette</h4>
              <div className="space-y-3">
                {[
                  { name: 'White / Ivory', color: 'bg-[#F5F4F0]' },
                  { name: 'Architectural Grey', color: 'bg-[#989898]' },
                  { name: 'Carbon Black', color: 'bg-[#171717]' },
                  { name: 'Olive Green', color: 'bg-[#4A513B]' }
                ].map((c) => (
                  <label key={c.name} className="flex items-center gap-3 cursor-pointer group">
                    <span className={`w-5 h-5 rounded-full ${c.color} border border-black/5 shadow-inner`} />
                    <span className="text-sm font-semibold text-neutral-600 group-hover:text-neutral-900 transition-colors">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-neutral-300 uppercase tracking-wider">
                <span>Цена</span>
                <span className="text-neutral-900 font-bold">$1500</span>
              </div>
              <input type="range" min="600" max="1500" defaultValue="1500" className="w-full accent-neutral-950 bg-neutral-100 h-1.5 rounded-full appearance-none cursor-pointer" />
              <div className="flex justify-between text-[11px] font-mono font-bold text-neutral-400">
                <span>MIN / $600</span>
                <span>MAX / $1500</span>
              </div>
            </div>
          </aside>

          {/* КОНТЕНТНАЯ ЧАСТЬ С КАРТОЧКАМИ */}
          <div className="flex-1 space-y-6 w-full">
            
            {/* ТАБЫ И ТАЙМЕР РАСПРОДАЖИ */}
            <div className="flex items-center justify-between px-4">
              <div className="flex gap-6 text-sm font-bold text-neutral-400">
                <button className="text-neutral-950 border-b-2 border-neutral-950 pb-1">Все</button>
                <button className="hover:text-neutral-900 transition-colors">Дешевле</button>
                <button className="hover:text-neutral-900 transition-colors">Дороже</button>
              </div>
              <div className="text-xs font-mono font-bold text-neutral-400 flex items-center gap-1.5">
                До конца: 
                <span className="bg-neutral-900 text-white px-2 py-1 rounded-lg text-xs shadow-sm ml-1">23 : 59 : 58</span>
              </div>
            </div>

            {/* СЕТКА ТОВАРОВ (Большие монолитные карточки со скруглением 36px) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product) => {
                const cartItem = cartItems.find((item) => item.id === product.id);

                return (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-[36px] p-5 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_30px_50px_-10px_rgba(0,0,0,0.07)] hover:-translate-y-1.5"
                  >
                    {/* Мягкая внутренняя плашка под фото */}
                    <div className="relative aspect-[1.1] bg-[#F4F3F8] rounded-[26px] flex items-center justify-center overflow-hidden p-6">
                      <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest bg-white text-neutral-400 px-3 py-1 rounded-full font-extrabold shadow-[0_4px_10px_rgba(0,0,0,0.01)]">
                        {product.category}
                      </span>
                      
                      {/* Текст/иконка-заглушка */}
                      <div className="text-neutral-300 font-bold text-xs tracking-widest text-center uppercase">
                        <svg className="w-12 h-12 mx-auto mb-2 text-neutral-300/80 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        [ Изображение ]
                      </div>
                    </div>

                    {/* Текстовый блок */}
                    <div className="mt-4 px-2 space-y-1">
                      <p className="text-[11px] font-extrabold text-neutral-300 uppercase tracking-widest">{product.category}</p>
                      <h4 className="text-lg font-bold tracking-tight text-neutral-900 capitalize">
                        {product.name.toLowerCase()}
                      </h4>
                    </div>

                    {/* ЦЕНА + ОВАЛЬНАЯ КНОПКА С СОЧНЫМ ЛАЙМОВЫМ АКЦЕНТОМ */}
                    <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between px-2 gap-4">
                      <span className="text-xl font-bold text-neutral-900 font-mono">
                        ${product.price}
                      </span>

                      <button 
                        onClick={() => {
                          if (cartItem) {
                            setCartItems(cartItems.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
                          } else {
                            setCartItems([...cartItems, { id: product.id, quantity: 1 }]);
                          }
                        }}
                        className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-extrabold transition-all active:scale-95 ${
                          cartItem 
                            ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200' 
                            // Салатовый сочный цвет из референса, дающий интерфейсу "жизнь"
                            : 'bg-[#92C348] text-white hover:bg-[#82B13F] shadow-[0_8px_25px_-5px_rgba(146,195,72,0.45)]'
                        }`}
                      >
                        <svg className="w-4 h-4 shrink-0 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        <span>
                          {cartItem ? `В корзине (${cartItem.quantity})` : 'В корзину'}
                        </span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}