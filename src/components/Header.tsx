import './Header.css';

interface HeaderProps {
  meta: {
    totalClinics: number;
    totalReviews: number;
    checklistItems: number;
    auditDate: string;
  };
}

export function Header({ meta }: HeaderProps) {
  const basePath = import.meta.env.BASE_URL;

  return (
    <header className="header">
      <img src={`${basePath}logo.svg`} alt="UsabilityLab" className="header__logo" />
      <div className="header__content">
        <h1 className="header__title">UX-аудит медицинских клиник</h1>
        <p className="header__subtitle">
          {meta.totalClinics} клиник &middot; {meta.checklistItems} элементов &middot; {meta.totalReviews} отзывов
        </p>
      </div>
    </header>
  );
}
