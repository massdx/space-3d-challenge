export type TextureItem = {
    id: string
    name: string
    url: string
    /** 'cover' étire l'image sur toute la surface sans répétition ; 'tile' (défaut) la répète. */
    fit?: 'tile' | 'cover'
}

const path = (file: string) => `/textures/${encodeURIComponent(file)}`

export const TEXTURE_CATALOG: TextureItem[] = [
    { id: 'checker-navy', name: 'Damier marine', url: path('143649302e2e590fa9e20e6aaadaee30.jpg') },
    { id: 'tiles-maroon', name: 'Carreaux bordeaux', url: path('2c76ee7be27f5cb59c383c5b7ab225ae.jpg') },
    { id: 'corduroy', name: 'Velours côtelé', url: path('58f04227b73016e0479f8466c4c25e2c.jpg'), fit: 'cover' },
    { id: 'terracotta', name: 'Terracotta', url: path('663a817619aff7fb56f88a4c1c07c181.jpg') },
    { id: 'tiles-multi', name: 'Carreaux multicolores', url: path('67d3aa686f3500853a5ffba7ddee29d8.jpg') },
    { id: 'checker-brick', name: 'Damier brique', url: path('958f6cf49bd62294d6044d8ae885b840.jpg') },
    { id: 'garden', name: 'Jardin', url: path('ac2b9b1b781f724b1914b40dcccf9253.jpg') },
    { id: 'ride', name: 'Ride', url: path('cf9c6d8de2c839c72758206df32d1219.jpg'), fit: 'cover' },
    { id: 'cottage', name: 'Cottage', url: path('wallpaperflare.com_wallpaper.jpg'), fit: 'cover' },
]

export const TEXTURE_BY_ID: Record<string, TextureItem> = Object.fromEntries(
    TEXTURE_CATALOG.map((item) => [item.id, item]),
)
