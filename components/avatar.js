import Image from "next/image";
export default function Avatar({ name, picture }) {
  return (
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
        <Image
          src={picture.url}
          width={48}
          height={48}
          alt={name}
          placeholder="blur"
          blurDataURL={picture.blurDataURL}
        />
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
}
