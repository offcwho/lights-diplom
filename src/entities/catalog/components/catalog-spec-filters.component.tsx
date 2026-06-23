'use client'

import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useCatalog, type SpecFilters } from '../module/catalog.context';

const LABELS: Record<keyof SpecFilters, string> = {
    styles:        'Стиль',
    rooms:         'Комнаты',
    shapes:        'Форма',
    mountingTypes: 'Тип крепления',
    lampTypes:     'Тип лампы',
    frameMaterials:'Материал корпуса',
    frameColors:   'Цвет корпуса',
    colorTemps:    'Цветовая температура',
};

const MAX_VISIBLE = 10;

function FilterGroup({ label, options, selected, onToggle }: {
    label: string;
    options: string[];
    selected: string[];
    onToggle: (v: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    if (!options.length) return null;

    const visible = expanded ? options : options.slice(0, MAX_VISIBLE);
    const hasMore = options.length > MAX_VISIBLE;

    return (
        <div className="space-y-2.5">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">{label}</p>
            <div className="flex flex-wrap gap-1.5">
                {visible.map(opt => {
                    const active = selected.includes(opt);
                    return (
                        <button
                            key={opt}
                            onClick={() => onToggle(opt)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                                active
                                    ? 'bg-[#111111] text-white'
                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                        >
                            {active && <Check size={8} strokeWidth={3} />}
                            {opt}
                        </button>
                    );
                })}
            </div>
            {hasMore && (
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                    {expanded
                        ? <><ChevronUp size={10} /> Скрыть</>
                        : <><ChevronDown size={10} /> Ещё {options.length - MAX_VISIBLE}</>
                    }
                </button>
            )}
        </div>
    );
}

export const CatalogSpecFiltersComponent = () => {
    const { derivedFilters, specFilters, toggleSpecFilter } = useCatalog();

    const groups: { key: keyof SpecFilters }[] = [
        { key: 'styles' },
        { key: 'rooms' },
        { key: 'shapes' },
        { key: 'mountingTypes' },
        { key: 'lampTypes' },
        { key: 'frameMaterials' },
        { key: 'frameColors' },
        { key: 'colorTemps' },
    ];

    return (
        <div className="space-y-5">
            {groups.map(({ key }) => (
                <FilterGroup
                    key={key}
                    label={LABELS[key]}
                    options={derivedFilters[key]}
                    selected={specFilters[key]}
                    onToggle={v => toggleSpecFilter(key, v)}
                />
            ))}
        </div>
    );
};
