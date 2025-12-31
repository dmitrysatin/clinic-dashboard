import { ChevronDown, ChevronUp, Star, ExternalLink } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import type { Clinic } from '../types';
import './ClinicCard.css';

interface ClinicCardProps {
  clinic: Clinic;
  isExpanded: boolean;
  onToggle: () => void;
}

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <span className="clinic-card__stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < count ? '#ff6900' : 'none'}
          stroke={i < count ? '#ff6900' : '#ccc'}
        />
      ))}
    </span>
  );
}

function getStarsForValue(value: number, max: number, invert = false): number {
  const normalized = invert ? (max - value) / max * 100 : value / max * 100;
  if (normalized >= 80) return 5;
  if (normalized >= 60) return 4;
  if (normalized >= 40) return 3;
  if (normalized >= 20) return 2;
  return 1;
}

function getIntegratedStars(integrated: number): number {
  if (integrated >= 80) return 5;
  if (integrated >= 60) return 4;
  if (integrated >= 50) return 3;
  if (integrated >= 30) return 2;
  return 1;
}

function getSeoValue(seo: 'good' | 'warning' | 'bad'): number {
  if (seo === 'good') return 100;
  if (seo === 'warning') return 50;
  return 0;
}

function getSeoLabel(seo: 'good' | 'warning' | 'bad'): string {
  if (seo === 'good') return 'Хорошо';
  if (seo === 'warning') return 'Проблемы';
  return 'Критично';
}

function DimensionStars({ clinic }: { clinic: Clinic }) {
  const funcStars = getStarsForValue(clinic.functionality, 100);
  const wcagStars = getStarsForValue(clinic.wcag, 50, true);
  const fleschStars = getStarsForValue(clinic.flesch, 100);
  const seoStars = getStarsForValue(getSeoValue(clinic.seo), 100);
  const appStars = clinic.app ? getStarsForValue(clinic.app.rating, 5) : 0;

  return (
    <div className="clinic-card__dimension-stars">
      <div className="clinic-card__dimension-row">
        <span className="clinic-card__dimension-label">
          Функциональность
          <span className="clinic-card__dimension-detail">({clinic.functionality}%)</span>
        </span>
        <Stars count={funcStars} size={12} />
      </div>
      <div className="clinic-card__dimension-row">
        <span className="clinic-card__dimension-label">
          Доступность
          <span className="clinic-card__dimension-detail">({clinic.wcag} ошибок)</span>
        </span>
        <Stars count={wcagStars} size={12} />
      </div>
      <div className="clinic-card__dimension-row">
        <span className="clinic-card__dimension-label">
          Читабельность
          <span className="clinic-card__dimension-detail">(Flesch {clinic.flesch})</span>
        </span>
        <Stars count={fleschStars} size={12} />
      </div>
      <div className="clinic-card__dimension-row">
        <span className="clinic-card__dimension-label">
          SEO
          <span className={`clinic-card__dimension-detail clinic-card__dimension-detail--${clinic.seo}`}>
            ({getSeoLabel(clinic.seo)})
          </span>
        </span>
        <Stars count={seoStars} size={12} />
      </div>
      {clinic.app && (
        <div className="clinic-card__dimension-row">
          <span className="clinic-card__dimension-label">
            Приложение
            <span className="clinic-card__dimension-detail">({clinic.app.rating.toFixed(1)}★, {clinic.app.reviewsCount} отз.)</span>
          </span>
          <Stars count={appStars} size={12} />
        </div>
      )}
    </div>
  );
}

function ClinicRadar({ clinic }: { clinic: Clinic }) {
  const data = [
    { metric: 'Функциональность', value: clinic.functionality },
    { metric: 'Доступность', value: Math.max(0, 100 - clinic.wcag * 2) },
    { metric: 'Читабельность', value: clinic.flesch },
    { metric: 'SEO', value: getSeoValue(clinic.seo) },
    { metric: 'Приложение', value: clinic.app ? clinic.app.rating * 20 : 0 },
  ];

  return (
    <div className="clinic-card__radar">
      <ResponsiveContainer width="100%" height={150}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
          <Radar
            dataKey="value"
            stroke="#0693e3"
            fill="#0693e3"
            fillOpacity={0.3}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ClinicCard({ clinic, isExpanded, onToggle }: ClinicCardProps) {
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={`clinic-card ${isExpanded ? 'clinic-card--expanded' : ''} ${clinic.isBenchmark ? 'clinic-card--benchmark' : ''}`}>
      <button className="clinic-card__header" onClick={onToggle}>
        <div className="clinic-card__main">
          <div className="clinic-card__title-row">
            <span className="clinic-card__name">{clinic.name}</span>
            <a
              href={`https://${clinic.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="clinic-card__site-link"
              onClick={handleLinkClick}
            >
              {clinic.id}
              <ExternalLink size={12} />
            </a>
            {clinic.isBenchmark && <span className="clinic-card__badge">Бенчмарк</span>}
          </div>
          <span className="clinic-card__city">{clinic.city}</span>
        </div>
        <div className="clinic-card__score">
          <span className="clinic-card__score-value">{clinic.integrated}</span>
          <Stars count={getIntegratedStars(clinic.integrated)} />
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div className="clinic-card__details">
          <div className="clinic-card__visualizations">
            <div className="clinic-card__viz-section">
              <h4 className="clinic-card__viz-title">Оценки по измерениям</h4>
              <DimensionStars clinic={clinic} />
            </div>
            <div className="clinic-card__viz-section">
              <h4 className="clinic-card__viz-title">Профиль клиники</h4>
              <ClinicRadar clinic={clinic} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
