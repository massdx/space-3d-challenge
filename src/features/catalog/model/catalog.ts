export type CatalogItem = {
    id: string
    name: string
    url: string
    category: 'desk' | 'chair' | 'monitor' | 'keyboard'
    /** Target largest dimension in world units; the model is auto-scaled to fit it. */
    targetSize: number
}

const path = (file: string) => `/models/${encodeURIComponent(file)}`

export const CATALOG: CatalogItem[] = [
    {
        id: 'desk-adjustable',
        name: 'Adjustable Desk',
        url: path('Adjustable Desk by jeff cobesign - 7Z0bva7ec1s.glb'),
        category: 'desk',
        targetSize: 2.8,
    },
    {
        id: 'desk-creative',
        name: 'Desk',
        url: path('Desk by CreativeTrio - YJyJam67hJ.glb'),
        category: 'desk',
        targetSize: 2.6,
    },
    {
        id: 'table-gaming',
        name: 'Gaming Table',
        url: path('Modern Gaming Table by FUS3N - M0kBgsd7Sk.glb'),
        category: 'desk',
        targetSize: 2.8,
    },
    {
        id: 'chair-quaternius',
        name: 'Chair',
        url: path('Chair by Quaternius - iMNqRzPwwe.glb'),
        category: 'chair',
        targetSize: 1.7,
    },
    {
        id: 'chair-office',
        name: 'Office Chair',
        url: path('office_chair.glb'),
        category: 'chair',
        targetSize: 2,
    },
    {
        id: 'chair-gaming',
        name: 'Gaming Chair',
        url: path('gaming_chair (1).glb'),
        category: 'chair',
        targetSize: 2,
    },
    {
        id: 'monitor-creative',
        name: 'Monitor',
        url: path('Monitor by CreativeTrio - PvSjEbz11k.glb'),
        category: 'monitor',
        targetSize: 1.3,
    },
    {
        id: 'monitor-poly',
        name: 'Monitor Poly',
        url: path('Monitor by Poly by Google - 0twMVGXRVDl.glb'),
        category: 'monitor',
        targetSize: 1.3,
    },
    {
        id: 'monitor-crt',
        name: 'CRT Monitor',
        url: path('CRT Monitor by Jarlan Perez - 8jVB0zIXKCv.glb'),
        category: 'monitor',
        targetSize: 1.3,
    },
    {
        id: 'monitor-ultrawide',
        name: 'Ultrawide',
        url: path('ultrawide_monitor.glb'),
        category: 'monitor',
        targetSize: 1.7,
    },
    {
        id: 'monitor-asus',
        name: 'Asus Gaming',
        url: path('asus_pc_gaming_monitor.glb'),
        category: 'monitor',
        targetSize: 1.5,
    },
    {
        id: 'keyboard-poly',
        name: 'Keyboard',
        url: path('Keyboard by Poly by Google - 3oFfQCSsUmQ.glb'),
        category: 'keyboard',
        targetSize: 0.9,
    },
    {
        id: 'keyboard-mechanical',
        name: 'Mechanical KB',
        url: path('mechanical_keyboard_-_aesthetic.glb'),
        category: 'keyboard',
        targetSize: 0.9,
    },
]

export const CATALOG_BY_ID = Object.fromEntries(CATALOG.map((item) => [item.id, item]))
