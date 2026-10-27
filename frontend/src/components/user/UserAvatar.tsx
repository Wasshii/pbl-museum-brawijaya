import { DEFAULT_AVATAR } from "@/lib/constants";

interface Props {
    src: string;
    alt: string;
    className?: string;
}

// Memakai <img> biasa (bukan next/image) karena avatar berasal dari URL luar
// yang berbeda-beda. Jika gambar gagal dimuat, diganti avatar cadangan.
export default function UserAvatar({
    src,
    alt,
    className = "w-full h-full object-cover",
}: Props) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            className={className}
            onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
            }}
        />
    );
}
