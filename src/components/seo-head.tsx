import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
    title: string;
    description: string;
    path: string;
    type?: string;
    image?: string;
    noindex?: boolean;
}

const BASE_URL = "https://nfcwear.de";
const DEFAULT_IMAGE = `${BASE_URL}/assets/logo.png`;

export function SeoHead({
    title,
    description,
    path,
    type = "website",
    image = DEFAULT_IMAGE,
    noindex = false,
}: SeoHeadProps) {
    const url = `${BASE_URL}${path}`;
    const fullTitle = title.includes("NFCwear") ? title : `${title} | NFCwear by Severmore`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            {noindex && <meta name="robots" content="noindex,nofollow" />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="NFCwear by Severmore" />
            <meta property="og:locale" content="de_DE" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}
