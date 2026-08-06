export default function GradientText({ children, as: Tag = 'span', className = '' }) {
  return <Tag className={`grad-text ${className}`}>{children}</Tag>;
}
