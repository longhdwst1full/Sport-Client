import type { ElementType, ReactNode } from 'react';

/**
 * Presentational "nothing here" block. All visual choices (container class,
 * icon wrapper class, heading tag/class) are passed in by the caller so an
 * existing call site can be converted without changing its rendered markup.
 */
export function EmptyState({
  className,
  iconWrapClassName,
  icon,
  titleAs: TitleTag = 'h2',
  titleClassName,
  title,
  descriptionClassName,
  description,
  actions,
}: {
  className?: string;
  iconWrapClassName?: string;
  icon?: ReactNode;
  titleAs?: ElementType;
  titleClassName?: string;
  title: ReactNode;
  descriptionClassName?: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className={className}>
      {icon ? <div className={iconWrapClassName}>{icon}</div> : null}
      <TitleTag className={titleClassName}>{title}</TitleTag>
      {description ? <p className={descriptionClassName}>{description}</p> : null}
      {actions}
    </div>
  );
}
