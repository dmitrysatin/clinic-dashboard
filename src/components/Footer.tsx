import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__insights">
        <h3 className="footer__title">Ключевые выводы</h3>
        <ul className="footer__list">
          <li>Российские клиники догнали Mayo Clinic по функциональности (84% vs 77%)</li>
          <li>Критическая проблема — доступность: 6-48 WCAG-ошибок vs 1 у международных</li>
          <li>Половина сайтов пишут слишком сложно (Flesch &lt; 30)</li>
          <li>28% жалоб в приложениях — на баги и вылеты</li>
        </ul>
      </div>
      <div className="footer__meta">
        <p>Исследование проведено в декабре 2025</p>
        <p>
          <a href="https://usabilitylab.ru" target="_blank" rel="noopener noreferrer">
            UsabilityLab
          </a>
        </p>
      </div>
    </footer>
  );
}
