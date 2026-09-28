import type { ElementType, ReactNode } from 'react';

/**
 * Presentational error block (query failed / access denied style sections).
 * Same shape as `EmptyState`; kept separate because callers reliably need an
 * icon + heading + message + retry/back actions rather than a generic slot.
 */
export function ErrorState({
  as: ContainerTag = 'section',
  className,
  iconWrapClassName,
  icon,
  titleAs: TitleTag = 'h1',
  titleClassName,
  title,
  descriptionClassName,
  description,
  actions,
}: {
  as?: ElementType;
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
    <ContainerTag className={className}>
      {icon ? <div className={iconWrapClassName}>{icon}</div> : null}
      <TitleTag className={titleClassName}>{title}</TitleTag>
      {description ? <p className={descriptionClassName}>{description}</p> : null}
      {actions}
    </ContainerTag>
  );
}
