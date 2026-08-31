// Picks one of the four brand colors per visit. Logo and favicon
// use the same variant, and it stays stable while the tab is open.

import BildmarkeGruen from '/src/assets/logo/Bildmarke_mit_Outlines_grün.svg';
import BildmarkeOrange from '/src/assets/logo/Bildmarke_mit_Outlines_orange.svg';
import BildmarkeGelb from '/src/assets/logo/Bildmarke_mit_Outlines_gelb.svg';
import BildmarkeLila from '/src/assets/logo/Bildmarke_mit_Outlines_lila.svg';

export type BrandVariant = 'grün' | 'orange' | 'gelb' | 'lila';

interface VariantAssets {
    bildmarke: string;
    favicon: string;
    color: string;
}

const VARIANTS: Record<BrandVariant, VariantAssets> = {
    'grün': {
        bildmarke: BildmarkeGruen,
        favicon: '/Favicon_mit_Outlines_grün_weiß.svg',
        color: 'var(--color-green)',
    },
    'orange': {
        bildmarke: BildmarkeOrange,
        favicon: '/Favicon_mit_Outlines_orange_weiß.svg',
        color: 'var(--color-orange)',
    },
    'gelb': {
        bildmarke: BildmarkeGelb,
        favicon: '/Favicon_mit_Outlines_gelb_weiß.svg',
        color: 'var(--color-yellow)',
    },
    'lila': {
        bildmarke: BildmarkeLila,
        favicon: '/Favicon_mit_Outlines_lila_weiß.svg',
        color: 'var(--color-purple)',
    },
};

const VARIANT_NAMES = Object.keys(VARIANTS) as BrandVariant[];
const STORAGE_KEY = 'brandVariant';

function isBrandVariant(value: string | null): value is BrandVariant {
    return value !== null && value in VARIANTS;
}

function pickVariant(): BrandVariant {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (isBrandVariant(stored)) return stored;

        const picked = VARIANT_NAMES[Math.floor(Math.random() * VARIANT_NAMES.length)];
        sessionStorage.setItem(STORAGE_KEY, picked);
        return picked;
    } catch {
        // sessionStorage can be blocked (private mode, embedded contexts)
        return VARIANT_NAMES[Math.floor(Math.random() * VARIANT_NAMES.length)];
    }
}

export const brandVariant: BrandVariant = pickVariant();
export const brandAssets: VariantAssets = VARIANTS[brandVariant];

/** Sets the favicon of the document to the one of the current variant. */
export function applyBrandFavicon() {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        document.head.appendChild(link);
    }
    link.href = brandAssets.favicon;
}
