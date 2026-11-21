export type PublicationCardProps = {
  title: string;
  authors?: string;
  venue: string;
  year: string;
  type: string;
  abstract: string;
  href?: string;
  linkLabel?: string;
};

export default function PublicationCard({
  title,
  authors,
  venue,
  year,
  type,
  abstract,
  href,
  linkLabel = 'Read paper',
}: PublicationCardProps) {
  return (
    <article className="grid gap-2 border-t border-line py-10 md:grid-cols-[6rem_1fr] md:gap-8">
      <p className="tabular-nums text-muted">{year}</p>
      <div className="max-w-[65ch]">
        <p className="text-sm text-signal">{type}</p>
        <h2 className="mt-1 font-serif text-2xl leading-snug text-text">{title}</h2>
        {authors && <p className="mt-2 text-sm text-muted">{authors}</p>}
        <p className="mt-1 text-sm italic text-muted">{venue}</p>
        <p className="mt-4 leading-relaxed text-muted">{abstract}</p>
        {href && (
          <a
            href={href}
            {...(href.startsWith('/projects') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            className="mt-5 inline-block border-b border-signal/60 pb-0.5 text-sm text-text hover:border-signal"
          >
            {linkLabel}
          </a>
        )}
      </div>
    </article>
  );
}
