const getInitials = (name) => name?.trim()?.slice(0, 2).toUpperCase() || 'WC';

export default function Avatar({ name, image, size = 'default' }) {
  const sizeClass = size === 'large' ? 'h-14 w-14 text-base' : 'h-10 w-10 text-xs';
  if (image) return <img src={image} alt={name} className={`${sizeClass} shrink-0 rounded-full object-cover ring-2 ring-white`} />;
  return <div className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 ring-2 ring-white`}>{getInitials(name)}</div>;
}