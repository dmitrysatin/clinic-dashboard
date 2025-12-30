import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { RatingChart } from './components/RatingChart';
import { ClinicCard } from './components/ClinicCard';
import type { MetricType, ClinicsData } from './types';
import clinicsData from './data/clinics.json';
import './App.css';

const data = clinicsData as ClinicsData;

type MobileTab = 'chart' | 'list';

function App() {
  const [metric, setMetric] = useState<MetricType>('integrated');
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [expandedClinicId, setExpandedClinicId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('chart');

  const sortedClinics = useMemo(() => {
    const getSeoValue = (seo: 'good' | 'warning' | 'bad') => {
      if (seo === 'good') return 100;
      if (seo === 'warning') return 50;
      return 0;
    };

    return [...data.clinics].sort((a, b) => {
      switch (metric) {
        case 'integrated':
          return b.integrated - a.integrated;
        case 'functionality':
          return b.functionality - a.functionality;
        case 'wcag':
          return a.wcag - b.wcag; // Меньше = лучше
        case 'flesch':
          return b.flesch - a.flesch;
        case 'seo':
          return getSeoValue(b.seo) - getSeoValue(a.seo);
        case 'app':
          const aRating = a.app?.rating ?? 0;
          const bRating = b.app?.rating ?? 0;
          return bRating - aRating;
        default:
          return 0;
      }
    });
  }, [metric]);

  // Клик по диаграмме: фильтрует список и раскрывает карточку
  const handleChartClick = (clinicId: string) => {
    if (selectedClinicId === clinicId) {
      setSelectedClinicId(null);
      setExpandedClinicId(null);
    } else {
      setSelectedClinicId(clinicId);
      setExpandedClinicId(clinicId);
    }
  };

  // Клик по карточке: только раскрывает/сворачивает (аккордеон)
  const handleCardToggle = (clinicId: string) => {
    setExpandedClinicId(expandedClinicId === clinicId ? null : clinicId);
  };

  // При клике на диаграмму переключаемся на список (мобильная версия)
  const handleChartClickWithTabSwitch = (clinicId: string) => {
    handleChartClick(clinicId);
    setMobileTab('list');
  };

  return (
    <div className="app">
      <Header meta={data.meta} />

      <div className="app__tabs">
        <button
          className={`app__tab ${mobileTab === 'chart' ? 'app__tab--active' : ''}`}
          onClick={() => setMobileTab('chart')}
        >
          Диаграмма
        </button>
        <button
          className={`app__tab ${mobileTab === 'list' ? 'app__tab--active' : ''}`}
          onClick={() => setMobileTab('list')}
        >
          Список
        </button>
      </div>

      <main className="app__main">
        <div className={`app__chart ${mobileTab === 'chart' ? 'app__chart--visible' : ''}`}>
          <RatingChart
            clinics={sortedClinics}
            metric={metric}
            onMetricChange={setMetric}
            onClinicClick={handleChartClickWithTabSwitch}
            selectedClinicId={selectedClinicId}
          />
        </div>
        <section className={`app__cards ${mobileTab === 'list' ? 'app__cards--visible' : ''}`}>
          <h2 className="app__cards-title">
            {selectedClinicId ? 'Выбранная клиника' : 'Детали по клиникам'}
            {selectedClinicId && (
              <button
                className="app__cards-reset"
                onClick={() => {
                  setSelectedClinicId(null);
                  setExpandedClinicId(null);
                }}
              >
                Показать все
              </button>
            )}
          </h2>
          {sortedClinics
            .filter((clinic) => !selectedClinicId || clinic.id === selectedClinicId)
            .map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
                isExpanded={expandedClinicId === clinic.id}
                onToggle={() => handleCardToggle(clinic.id)}
              />
            ))}
        </section>
      </main>
    </div>
  );
}

export default App;
