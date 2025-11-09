import Image from "next/image";

interface AvatarProps {
  src: string | null;
  alt: string;
}

export function Avatar({ src, alt }: AvatarProps) {
  if (src) {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
      {alt.slice(0, 2).toUpperCase()}
    </div>
  );
}
