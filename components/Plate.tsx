import Image from 'next/image'

export default function Plate({
  src,
  alt,
  caption,
  numeral,
  priority = false,
  className = '',
}: {
  src: string
  alt: string
  caption?: string
  numeral?: string
  priority?: boolean
  className?: string
}) {
  return (
    <figure className={`plate ${className}`}>
      <div className="plate-frame">
        <Image
          src={src}
          alt={alt}
          width={2560}
          height={1600}
          priority={priority}
          sizes="(min-width: 1200px) 1100px, 100vw"
        />
      </div>
      {caption && (
        <figcaption>
          {numeral ? `Plate ${numeral}. ` : ''}
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
