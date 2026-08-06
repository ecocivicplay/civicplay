import './Marquee.css';

export default function Marquee({ items, speed = 30 }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((item, i) => (
          <span className="marquee__item" key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
