import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Clinic, MetricType } from '../types';
import './RatingChart.css';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

interface RatingChartProps {
  clinics: Clinic[];
  metric: MetricType;
  onMetricChange: (metric: MetricType) => void;
  onClinicClick: (clinicId: string) => void;
  selectedClinicId: string | null;
}

const metrics: { value: MetricType; label: string }[] = [
  { value: 'integrated', label: 'Интегральный балл' },
  { value: 'functionality', label: 'Функциональность' },
  { value: 'wcag', label: 'Доступность (WCAG)' },
  { value: 'flesch', label: 'Читабельность' },
  { value: 'seo', label: 'SEO' },
  { value: 'app', label: 'Мобильное приложение' },
];

interface ChartDataItem {
  id: string;
  name: string;
  value: number;
  isBenchmark: boolean;
  stars: number;
}

function getSeoValue(seo: 'good' | 'warning' | 'bad'): number {
  if (seo === 'good') return 100;
  if (seo === 'warning') return 50;
  return 0;
}

function getMetricValue(clinic: Clinic, metric: MetricType): number {
  switch (metric) {
    case 'integrated':
      return clinic.integrated;
    case 'functionality':
      return clinic.functionality;
    case 'wcag':
      // Инвертируем: меньше ошибок = лучше
      return Math.max(0, 100 - clinic.wcag * 2);
    case 'flesch':
      return clinic.flesch;
    case 'seo':
      return getSeoValue(clinic.seo);
    case 'app':
      return clinic.app ? clinic.app.rating * 20 : 0;
    default:
      return clinic.integrated;
  }
}

function getMetricLabel(metric: MetricType): string {
  switch (metric) {
    case 'integrated':
      return 'Интегральный балл';
    case 'functionality':
      return 'Функциональность (%)';
    case 'wcag':
      return 'Доступность (100 - ошибки×2)';
    case 'flesch':
      return 'Читабельность (Flesch)';
    case 'seo':
      return 'SEO (good=100, warning=50, bad=0)';
    case 'app':
      return 'Рейтинг приложения (×20)';
    default:
      return '';
  }
}

function getBarColor(value: number, metric: MetricType): string {
  if (metric === 'wcag') {
    // Для WCAG: зелёный = мало ошибок
    if (value >= 90) return '#00d084';
    if (value >= 70) return '#0693e3';
    if (value >= 50) return '#ff6900';
    return '#cf2e2e';
  }
  // Для остальных метрик
  if (value >= 70) return '#00d084';
  if (value >= 50) return '#0693e3';
  if (value >= 30) return '#ff6900';
  return '#cf2e2e';
}

interface CustomTickProps {
  x: number;
  y: number;
  payload: { value: string };
  data: ChartDataItem[];
  onClinicClick: (clinicId: string) => void;
}

function CustomYAxisTick({ x, y, payload, data, onClinicClick }: CustomTickProps) {
  const item = data.find((d) => d.name === payload.value);
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      fontSize={13}
      fill="#333"
      style={{ cursor: 'pointer' }}
      onClick={() => item && onClinicClick(item.id)}
    >
      {payload.value}
    </text>
  );
}

export function RatingChart({ clinics, metric, onMetricChange, onClinicClick, selectedClinicId }: RatingChartProps) {
  const isMobile = useIsMobile();

  const data: ChartDataItem[] = clinics.map((clinic) => ({
    id: clinic.id,
    name: clinic.name,
    value: getMetricValue(clinic, metric),
    isBenchmark: clinic.isBenchmark,
    stars: clinic.stars,
  }));

  const handleBarClick = (item: ChartDataItem) => {
    onClinicClick(item.id);
  };

  const chartMargin = isMobile
    ? { top: 10, right: 10, left: 0, bottom: 10 }
    : { top: 10, right: 30, left: 0, bottom: 10 };

  const yAxisWidth = isMobile ? 110 : 120;

  return (
    <div className="rating-chart">
      <div className="rating-chart__header">
        <label className="rating-chart__label" htmlFor="metric-select">Метрика</label>
        <select
          id="metric-select"
          className="rating-chart__select"
          value={metric}
          onChange={(e) => onMetricChange(e.target.value as MetricType)}
        >
          {metrics.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <div className="rating-chart__container">
        <ResponsiveContainer width="100%" height={data.length * 32 + 40}>
          <BarChart
            data={data}
            layout="vertical"
            margin={chartMargin}
          >
            <XAxis type="number" domain={[0, 'dataMax']} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={yAxisWidth}
              tick={(props) => (
                <CustomYAxisTick
                  {...props}
                  data={data}
                  onClinicClick={onClinicClick}
                />
              )}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(0)}`, getMetricLabel(metric)]}
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              cursor="pointer"
              onClick={(_, index) => handleBarClick(data[index])}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={getBarColor(entry.value, metric)}
                  opacity={selectedClinicId && selectedClinicId !== entry.id ? 0.4 : 1}
                  stroke={entry.isBenchmark ? '#32373c' : 'none'}
                  strokeWidth={entry.isBenchmark ? 2 : 0}
                  strokeDasharray={entry.isBenchmark ? '4 2' : 'none'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rating-chart__legend">
        <span className="rating-chart__legend-item">
          <span className="rating-chart__legend-color" style={{ background: '#00d084' }}></span>
          Отлично (70+)
        </span>
        <span className="rating-chart__legend-item">
          <span className="rating-chart__legend-color" style={{ background: '#0693e3' }}></span>
          Хорошо (50-69)
        </span>
        <span className="rating-chart__legend-item">
          <span className="rating-chart__legend-color" style={{ background: '#ff6900' }}></span>
          Средне (30-49)
        </span>
        <span className="rating-chart__legend-item">
          <span className="rating-chart__legend-color" style={{ background: '#cf2e2e' }}></span>
          Плохо (&lt;30)
        </span>
      </div>
    </div>
  );
}
