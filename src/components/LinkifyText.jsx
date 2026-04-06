const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export default function LinkifyText({ text, className }) {
  const parts = text.split(URL_REGEX);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline text-forest hover:text-forest-dark">{part}</a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
