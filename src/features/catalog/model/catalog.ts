export type CatalogItem = {
    id: string
    name: string
    url: string
    category: 'desk' | 'chair' | 'monitor' | 'keyboard' | 'sofa' | 'lamp' | 'rug' | 'decor'
    /** Target largest dimension in world units; the model is auto-scaled to fit it. */
    targetSize: number
    /** 'wall' = accroché au mur (horloge, tableau, étagère). Par défaut posé au sol. */
    placement?: 'floor' | 'wall'
    /** Autorise un léger chevauchement dans le mur (assises plaquées). */
    wallHug?: boolean
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
    {
        id: 'chair-gaming-2',
        name: 'Gaming Chair 2',
        url: path('gaming_chair.glb'),
        category: 'chair',
        targetSize: 2,
    },
    {
        id: 'chair-manta',
        name: 'Chaise Manta',
        url: path('athezza_-_chaise_manta.glb'),
        category: 'chair',
        targetSize: 1.7,
        wallHug: true,
    },
    {
        id: 'sofa-moventa',
        name: 'Canapé Moventa',
        url: path('athezza_-_canape_moventa.glb'),
        category: 'sofa',
        targetSize: 2.6,
        wallHug: true,
    },
    {
        id: 'lamp-retro',
        name: 'Retro Lamp',
        url: path('retro_lamp.glb'),
        category: 'lamp',
        targetSize: 1.2,
    },
    {
        id: 'lamp-saturn',
        name: 'Saturn Desk Lamp',
        url: path('saturn_desk_lamp.glb'),
        category: 'lamp',
        targetSize: 0.6,
    },
    {
        id: 'lamp-simple-retro',
        name: 'Retro Desk Lamp',
        url: path('simple_retro_desk_lamp.glb'),
        category: 'lamp',
        targetSize: 0.6,
    },
    {
        id: 'lamp-tomons',
        name: 'Tomons Desk Lamp',
        url: path('tomons_desk_lamp.glb'),
        category: 'lamp',
        targetSize: 0.6,
    },
    {
        id: 'rug-poly',
        name: 'Rug',
        url: path('Rug by Poly by Google - epuypdA3tpO.glb'),
        category: 'rug',
        targetSize: 2.5,
    },
    {
        id: 'rug-nebulaii',
        name: 'Tapis Nebulaii',
        url: path('tapis_nebulaii_tz01-504.glb'),
        category: 'rug',
        targetSize: 2.5,
    },
    {
        id: 'decor-cube-cubby',
        name: 'Wall Cubby',
        url: path('Modern Cube Wall Cubby by Jarlan Perez - 420L7-5BrPw.glb'),
        category: 'decor',
        targetSize: 1.5,
        placement: 'wall',
    },
    {
        id: 'decor-tableau-foret',
        name: 'Tableau Forêt',
        url: path('athezza_-_tableau_rond_foret.glb'),
        category: 'decor',
        targetSize: 1.2,
        placement: 'wall',
    },
    {
        id: 'decor-wall-clock',
        name: 'Wall Clock',
        url: path('walnut_wall_clock_day-date.glb'),
        category: 'decor',
        targetSize: 0.6,
        placement: 'wall',
    },
    {
        id: 'decor-data-rack',
        name: 'Data Center Rack',
        url: path('data_center_rack.glb'),
        category: 'decor',
        targetSize: 1.8,
    },
    {
        id: 'decor-ezio',
        name: 'Ezio Figurine',
        url: path('ezio_auditore_figurine.glb'),
        category: 'decor',
        targetSize: 0.5,
    },
    {
        id: 'decor-sans',
        name: 'Sans Figurine',
        url: path('sans_figurine_undertale.glb'),
        category: 'decor',
        targetSize: 0.5,
    },
]

export const CATALOG_BY_ID = Object.fromEntries(CATALOG.map((item) => [item.id, item]))
