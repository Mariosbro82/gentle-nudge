export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    colors: string[];
    sizes: string[];
    features: string[];
}

export const PRODUCTS: Product[] = [
    {
        id: "hoodie-corporate-black",
        name: "NFCwear Corporate Hoodie",
        description: "Der ultimative Smart-Hoodie für Teams. Eingebauter NTAG424 DNA Chip, 100% Bio-Baumwolle, Made in Portugal. Verbinden Sie Ihre Mitarbeiter mit der digitalen Welt.",
        price: 89.00,
        images: [
            "https://images.unsplash.com/photo-1556821843-88340430b66d?q=80&w=2670&auto=format&fit=crop", // Mockup placeholder
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop"
        ],
        colors: ["Black", "Navy", "White"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        features: [
            "NTAG424 DNA Chip integriert",
            "Severmore Cloud™ Kompatibel",
            "50 Wäschen Garantie auf Chip",
            "Bio-Baumwolle (GOTS)",
            "Unisex Slim Fit"
        ]
    },
    {
        id: "crewneck-minimal",
        name: "Severmore Crewneck",
        description: "Understatement pur. Klassischer Schnitt, futuristische Technologie. Perfekt für Events und den täglichen Einsatz im Büro.",
        price: 79.00,
        images: [
            "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=2000&auto=format&fit=crop"
        ],
        colors: ["Grey-Melange", "Black"],
        sizes: ["S", "M", "L", "XL"],
        features: [
            "NTAG424 DNA Chip integriert",
            "Severmore Cloud™ Kompatibel",
            "Soft-Touch Finish",
            "Recyceltes Polyester-Blend"
        ]
    }
];
