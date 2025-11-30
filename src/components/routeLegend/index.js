import GreenFlag from '../../assets/green-flag.svg';
import './index.css';

const entries = [
  { label: 'Start Route', icon: GreenFlag },
  { label: '8:00 AM', color: '#81459B' },
  { label: '10:00 AM', color: '#4DB949' },
  { label: '10:45 AM', color: '#395CAC' },
  { label: '12:30 PM', color: '#D2C322' },
  { label: '1:15 PM', color: '#F46D25' },
  { label: '2:00 PM', color: '#E91E25' },
];

const RouteLegend = ({ className = '' }) => {
  const classes = ['route-legend', className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {entries.map(({ label, color, icon }) => (
        <span key={label} className="route-legend__item">
          <span className="route-legend__label">{label}</span>
          {icon ? (
            <span className="route-legend__icon">
              <img src={icon} alt={label} />
            </span>
          ) : (
            <span
              className="route-legend__swatch"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
          )}
        </span>
      ))}
    </span>
  );
};

export default RouteLegend;

