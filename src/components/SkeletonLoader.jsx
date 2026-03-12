const SkeletonCard = () => (
  <article className="skeleton-card">
    <div className="skeleton-card__image skeleton-shimmer" />
    <div className="skeleton-card__body">
      <div className="skeleton-card__line skeleton-card__line--title skeleton-shimmer" />
      <div className="skeleton-card__line skeleton-card__line--price skeleton-shimmer" />
    </div>
  </article>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="products-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
