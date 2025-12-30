import { Activity } from 'lucide-react';
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
  return (
    <header className="header">
      <div className="header__logo">
        <Activity size={32} />
        <span className="header__brand">UsabilityLab</span>
      </div>
      <div className="header__content">
        <h1 className="header__title">UX-аудит медицинских клиник</h1>
        <p className="header__subtitle">
          {meta.totalClinics} клиник &middot; {meta.checklistItems} элементов &middot; {meta.totalReviews} отзывов
        </p>
      </div>
    </header>
  );
}
