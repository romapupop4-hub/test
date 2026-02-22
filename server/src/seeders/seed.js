const { sequelize, User, Category, Style, ShowcaseComponent, Variation, Tag, Favorite, ComponentView, Setting } = require('../models');
const bcrypt = require('bcryptjs');

const categories = [
  { name: 'Buttons', slug: 'buttons', description: 'Interactive button components with various states and styles', icon: 'cursor' },
  { name: 'Cards', slug: 'cards', description: 'Content cards and panels for displaying information', icon: 'square' },
  { name: 'Forms', slug: 'forms', description: 'Form inputs, selects, checkboxes, and radio buttons', icon: 'check-square' },
  { name: 'Navigation', slug: 'navigation', description: 'Navbars, menus, breadcrumbs, and pagination', icon: 'menu' },
  { name: 'Modals', slug: 'modals', description: 'Dialogs, popups, and overlay components', icon: 'window' },
  { name: 'Tables', slug: 'tables', description: 'Data tables, grids, and spreadsheet-like components', icon: 'table' },
  { name: 'Lists', slug: 'lists', description: 'List views, accordions, and timeline components', icon: 'list' },
  { name: 'Badges', slug: 'badges', description: 'Tags, labels, and status indicators', icon: 'tag' },
  { name: 'Alerts', slug: 'alerts', description: 'Notifications, toasts, and feedback messages', icon: 'bell' },
  { name: 'Loaders', slug: 'loaders', description: 'Spinners, skeletons, and loading states', icon: 'loader' },
  { name: 'Avatars', slug: 'avatars', description: 'User profile images and placeholders', icon: 'user' },
  { name: 'Dropdowns', slug: 'dropdowns', description: 'Select menus, dropdowns, and comboboxes', icon: 'chevron-down' },
  { name: 'Tabs', slug: 'tabs', description: 'Tab panels and tabbed navigation', icon: 'folder' },
  { name: 'Tooltips', slug: 'tooltips', description: 'Hover tooltips and popovers', icon: 'message-circle' },
  { name: 'Sliders', slug: 'sliders', description: 'Range sliders and input sliders', icon: 'sliders' },
  { name: 'Switches', slug: 'switches', description: 'Toggle switches and checkboxes', icon: 'toggle-left' },
  { name: 'Ratings', slug: 'ratings', description: 'Star ratings and review components', icon: 'star' },
  { name: 'Progress', slug: 'progress', description: 'Progress bars and step indicators', icon: 'bar-chart' },
  { name: 'Hero Sections', slug: 'hero-sections', description: 'Landing page hero sections', icon: 'layout' },
  { name: 'Footers', slug: 'footers', description: 'Website footer components', icon: 'columns' },
  { name: 'Headers', slug: 'headers', description: 'Website header components', icon: 'menu' },
  { name: 'Sidebars', slug: 'sidebars', description: 'Sidebar navigation and panels', icon: 'sidebar' },
  { name: 'Pricing Tables', slug: 'pricing-tables', description: 'Pricing cards and comparison tables', icon: 'credit-card' },
  { name: 'Testimonials', slug: 'testimonials', description: 'Customer reviews and quotes', icon: 'message-square' },
  { name: 'Features', slug: 'features', description: 'Feature highlight sections', icon: 'zap' },
  { name: 'Stats', slug: 'stats', description: 'Statistics and counter components', icon: 'hash' },
  { name: 'Teams', slug: 'teams', description: 'Team member cards', icon: 'users' },
  { name: 'Blogs', slug: 'blogs', description: 'Blog post cards and layouts', icon: 'file-text' },
  { name: 'Products', slug: 'products', description: 'Product cards and listings', icon: 'shopping-bag' },
  { name: 'Galleries', slug: 'galleries', description: 'Image and media galleries', icon: 'image' },
  { name: 'Video Players', slug: 'video-players', description: 'Video embed and player components', icon: 'play' },
  { name: 'Audio Players', slug: 'audio-players', description: 'Audio player and podcast components', icon: 'volume-2' },
  { name: 'Maps', slug: 'maps', description: 'Map integrations and location components', icon: 'map-pin' },
  { name: 'Calendars', slug: 'calendars', description: 'Calendar and date picker components', icon: 'calendar' },
  { name: 'Chat', slug: 'chat', description: 'Chat widgets and messaging interfaces', icon: 'message-circle' },
  { name: 'Login Forms', slug: 'login-forms', description: 'Login and registration forms', icon: 'log-in' },
  { name: 'Dashboards', slug: 'dashboards', description: 'Dashboard widgets and analytics', icon: 'grid' },
  { name: 'Widgets', slug: 'widgets', description: 'Miscellaneous UI widgets', icon: 'box' },
  { name: 'Mobile', slug: 'mobile', description: 'Mobile-specific components', icon: 'smartphone' },
  { name: 'Desktop', slug: 'desktop', description: 'Desktop-specific components', icon: 'monitor' },
  { name: 'Widgets', slug: 'widgets-extra', description: 'Additional UI widgets', icon: 'box' }
];

const styles = [
  { name: 'Modern', slug: 'modern', description: 'Clean, minimalist design with ample whitespace', color: '#6366f1' },
  { name: 'Classic', slug: 'classic', description: 'Traditional, timeless design patterns', color: '#8b5cf6' },
  { name: 'Minimalist', slug: 'minimalist', description: 'Ultra-clean with focus on essential elements', color: '#ec4899' },
  { name: 'Glassmorphism', slug: 'glassmorphism', description: 'Frosted glass effect with transparency', color: '#14b8a6' },
  { name: 'Neumorphism', slug: 'neumorphism', description: 'Soft, extruded 3D look', color: '#f97316' },
  { name: 'Brutalist', slug: 'brutalist', description: 'Bold, raw, and unconventional', color: '#ef4444' },
  { name: 'Retro', slug: 'retro', description: 'Nostalgic vintage-inspired design', color: '#eab308' },
  { name: 'Cyberpunk', slug: 'cyberpunk', description: 'Futuristic with neon accents', color: '#06b6d4' },
  { name: 'Material', slug: 'material', description: 'Google Material Design principles', color: '#3b82f6' },
  { name: 'Flat', slug: 'flat', description: 'Simple 2D design without shadows', color: '#10b981' },
  { name: 'Skeuomorphic', slug: 'skeuomorphic', description: 'Realistic 3D appearance', color: '#f59e0b' },
  { name: 'Gradient', slug: 'gradient', description: 'Colorful gradient backgrounds', color: '#a855f7' },
  { name: 'Dark', slug: 'dark', description: 'Dark mode focused design', color: '#1e293b' },
  { name: 'Light', slug: 'light', description: 'Light and airy design', color: '#f8fafc' },
  { name: 'Animated', slug: 'animated', description: 'Motion-rich interactive design', color: '#f43f5e' },
  { name: 'Professional', slug: 'professional', description: 'Business and corporate style', color: '#0ea5e9' },
  { name: 'Playful', slug: 'playful', description: 'Fun and whimsical design', color: '#84cc16' },
  { name: 'Luxury', slug: 'luxury', description: 'Premium elegant design', color: '#d4af37' },
  { name: 'Startup', slug: 'startup', description: 'Modern tech startup aesthetic', color: '#22c55e' },
  { name: 'E-commerce', slug: 'e-commerce', description: 'Shopping-focused design', color: '#e11d48' }
];

const componentTemplates = [
  {
    name: 'Primary Button',
    description: 'Main call-to-action button with hover effects',
    category: 'buttons',
    htmlCode: `<button class="btn btn-primary">Click Me</button>`,
    cssCode: `.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}`,
    reactCode: `export function PrimaryButton({ children, onClick }) {
  return (
    <button 
      className="btn btn-primary"
      onClick={onClick}
    >
      {children}
    </button>
  );
}`
  },
  {
    name: 'Glass Card',
    description: 'Modern glassmorphism card component',
    category: 'cards',
    htmlCode: `<div class="glass-card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>`,
    cssCode: `.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}`,
    reactCode: `export function GlassCard({ title, children }) {
  return (
    <div className="glass-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}`
  },
  {
    name: 'Input Field',
    description: 'Stylized form input with focus states',
    category: 'forms',
    htmlCode: `<div class="input-group">
  <input type="text" class="input-field" placeholder="Enter text..." />
</div>`,
    cssCode: `.input-field {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
}
.input-field:focus {
  border-color: #6366f1;
  outline: none;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}`,
    reactCode: `export function InputField({ placeholder, value, onChange }) {
  return (
    <input
      type="text"
      className="input-field"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}`
  },
  {
    name: 'Navbar',
    description: 'Responsive navigation bar',
    category: 'navigation',
    htmlCode: `<nav class="navbar">
  <div class="nav-brand">Logo</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>`,
    cssCode: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.nav-brand {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}
.nav-links {
  display: flex;
  gap: 32px;
  list-style: none;
}`,
    reactCode: `export function Navbar({ links }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">Logo</div>
      <ul className="nav-links">
        {links.map(link => (
          <li key={link}><a href="#">{link}</a></li>
        ))}
      </ul>
    </nav>
  );
}`
  },
  {
    name: 'Modal',
    description: 'Overlay modal dialog component',
    category: 'modals',
    htmlCode: `<div class="modal-overlay">
  <div class="modal-content">
    <h2>Modal Title</h2>
    <p>Modal body content</p>
    <button class="btn-close">×</button>
  </div>
</div>`,
    cssCode: `.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 32px;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  position: relative;
}`,
    reactCode: `export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <button className="btn-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}`
  },
  {
    name: 'Data Table',
    description: 'Responsive data table component',
    category: 'tables',
    htmlCode: `<table class="data-table">
  <thead>
    <tr><th>Name</th><th>Email</th><th>Role</th></tr>
  </thead>
  <tbody>
    <tr><td>John</td><td>john@email.com</td><td>Admin</td></tr>
  </tbody>
</table>`,
    cssCode: `.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.data-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-weight: 600;
}
.data-table td {
  padding: 16px;
  border-top: 1px solid #e2e8f0;
}`,
    reactCode: `export function DataTable({ columns, data }) {
  return (
    <table className="data-table">
      <thead>
        <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => <td key={j}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`
  },
  {
    name: 'Accordion List',
    description: 'Expandable accordion component',
    category: 'lists',
    htmlCode: `<div class="accordion">
  <div class="accordion-item">
    <div class="accordion-header">Section 1</div>
    <div class="accordion-content">Content here</div>
  </div>
</div>`,
    cssCode: `.accordion-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
}
.accordion-header {
  padding: 16px;
  cursor: pointer;
  font-weight: 600;
  background: #f8fafc;
}
.accordion-content {
  padding: 16px;
  display: none;
}
.accordion-item.active .accordion-content {
  display: block;
}`,
    reactCode: `export function Accordion({ items }) {
  const [active, setActive] = useState(null);
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={i} className={\`accordion-item \${active === i ? 'active' : ''}\`}>
          <div className="accordion-header" onClick={() => setActive(active === i ? null : i)}>
            {item.title}
          </div>
          <div className="accordion-content">{item.content}</div>
        </div>
      ))}
    </div>
  );
}`
  },
  {
    name: 'Status Badge',
    description: 'Status indicator badge',
    category: 'badges',
    htmlCode: `<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Inactive</span>`,
    cssCode: `.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.badge-success { background: #dcfce7; color: #166534; }
.badge-warning { background: #fef3c7; color: #92400e; }
.badge-error { background: #fee2e2; color: #991b1b; }`,
    reactCode: `export function Badge({ status, children }) {
  return <span className={\`badge badge-\${status}\`}>{children}</span>;
}`
  },
  {
    name: 'Toast Notification',
    description: 'Toast alert component',
    category: 'alerts',
    htmlCode: `<div class="toast toast-success">
  <span>Success!</span>
  <button class="toast-close">×</button>
</div>`,
    cssCode: `.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
}
.toast-success { border-left: 4px solid #22c55e; }
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
    reactCode: `export function Toast({ type, message, onClose }) {
  return (
    <div className={\`toast toast-\${type}\`}>
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
}`
  },
  {
    name: 'Spinner Loader',
    description: 'Animated loading spinner',
    category: 'loaders',
    htmlCode: `<div class="spinner"></div>`,
    cssCode: `.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}`,
    reactCode: `export function Spinner() {
  return <div className="spinner"></div>;
}`
  },
  {
    name: 'Skeleton Loader',
    description: 'Content loading skeleton',
    category: 'loaders',
    htmlCode: `<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-title"></div>
<div class="skeleton skeleton-image"></div>`,
    cssCode: `.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
.skeleton-text { height: 16px; width: 100%; }
.skeleton-title { height: 24px; width: 60%; margin-bottom: 16px; }
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
    reactCode: `export function Skeleton({ type }) {
  return <div className={\`skeleton skeleton-\${type}\`}></div>;
}`
  },
  {
    name: 'Avatar',
    description: 'User avatar component',
    category: 'avatars',
    htmlCode: `<img src="avatar.jpg" class="avatar avatar-lg" alt="User" />
<span class="avatar-status"></span>`,
    cssCode: `.avatar {
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.avatar-lg { width: 80px; height: 80px; }
.avatar-status {
  width: 12px; height: 12px; background: #22c55e; 
  border-radius: 50%; position: absolute;
}`,
    reactCode: `export function Avatar({ src, size, status }) {
  return (
    <div style={{ position: 'relative' }}>
      <img src={src} className={\`avatar avatar-\${size}\`} alt="avatar" />
      {status && <span className="avatar-status"></span>}
    </div>
  );
}`
  },
  {
    name: 'Dropdown Menu',
    description: 'Select dropdown component',
    category: 'dropdowns',
    htmlCode: `<div class="dropdown">
  <button class="dropdown-trigger">Select Option ▼</button>
  <div class="dropdown-menu">
    <a href="#">Option 1</a>
    <a href="#">Option 2</a>
    <a href="#">Option 3</a>
  </div>
</div>`,
    cssCode: `.dropdown { position: relative; }
.dropdown-trigger {
  padding: 12px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  min-width: 180px;
  display: none;
  z-index: 100;
}
.dropdown:hover .dropdown-menu { display: block; }
.dropdown-menu a {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #374151;
}`,
    reactCode: `export function Dropdown({ options, trigger }) {
  return (
    <div className="dropdown">
      <button className="dropdown-trigger">{trigger}</button>
      <div className="dropdown-menu">
        {options.map(opt => <a key={opt} href="#">{opt}</a>)}
      </div>
    </div>
  );
}`
  },
  {
    name: 'Tabs',
    description: 'Tab navigation component',
    category: 'tabs',
    htmlCode: `<div class="tabs">
  <div class="tab active">Tab 1</div>
  <div class="tab">Tab 2</div>
  <div class="tab">Tab 3</div>
</div>
<div class="tab-content">Content 1</div>`,
    cssCode: `.tabs { display: flex; border-bottom: 2px solid #e2e8f0; }
.tab {
  padding: 16px 24px;
  cursor: pointer;
  color: #64748b;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}
.tab.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
}
.tab:hover { color: #374151; }`,
    reactCode: `export function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      <div className="tabs">
        {tabs.map((tab, i) => (
          <div key={i} className={\`tab \${activeTab === i ? 'active' : ''}\`}
            onClick={() => setActiveTab(i)}>{tab.label}</div>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab].content}</div>
    </>
  );
}`
  },
  {
    name: 'Tooltip',
    description: 'Hover tooltip component',
    category: 'tooltips',
    htmlCode: `<div class="tooltip-wrapper">
  <button class="tooltip-trigger">Hover me</button>
  <span class="tooltip-content">Tooltip text here</span>
</div>`,
    cssCode: `.tooltip-wrapper { position: relative; display: inline-block; }
.tooltip-trigger { padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; }
.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  margin-bottom: 8px;
}
.tooltip-wrapper:hover .tooltip-content { opacity: 1; visibility: visible; }`,
    reactCode: `export function Tooltip({ trigger, content }) {
  return (
    <div className="tooltip-wrapper">
      <button className="tooltip-trigger">{trigger}</button>
      <span className="tooltip-content">{content}</span>
    </div>
  );
}`
  },
  {
    name: 'Range Slider',
    description: 'Input range slider component',
    category: 'sliders',
    htmlCode: `<input type="range" class="slider" min="0" max="100" value="50" />`,
    cssCode: `.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
  appearance: none;
  outline: none;
}
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
}
.slider::-webkit-slider-thumb:hover { transform: scale(1.1); }`,
    reactCode: `export function Slider({ min, max, value, onChange }) {
  return (
    <input 
      type="range" 
      className="slider" 
      min={min} 
      max={max} 
      value={value} 
      onChange={e => onChange(e.target.value)}
    />
  );
}`
  },
  {
    name: 'Toggle Switch',
    description: 'On/off toggle switch',
    category: 'switches',
    htmlCode: `<label class="switch">
  <input type="checkbox" />
  <span class="slider-switch"></span>
</label>`,
    cssCode: `.switch { position: relative; display: inline-block; width: 50px; height: 28px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider-switch {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #cbd5e1;
  border-radius: 28px;
  transition: 0.3s;
}
.slider-switch:before {
  content: "";
  position: absolute;
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}
.switch input:checked + .slider-switch { background: #6366f1; }
.switch input:checked + .slider-switch:before { transform: translateX(22px); }`,
    reactCode: `export function Toggle({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="slider-switch"></span>
    </label>
  );
}`
  },
  {
    name: 'Star Rating',
    description: 'Star rating component',
    category: 'ratings',
    htmlCode: `<div class="rating">
  <span class="star filled">★</span>
  <span class="star filled">★</span>
  <span class="star filled">★</span>
  <span class="star">★</span>
  <span class="star">★</span>
</div>`,
    cssCode: `.rating { display: flex; gap: 4px; }
.star {
  font-size: 24px;
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.2s;
}
.star.filled, .star:hover { color: #fbbf24; }`,
    reactCode: `export function Rating({ value, onChange }) {
  return (
    <div className="rating">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={\`star \${i <= value ? 'filled' : ''}\`}
          onClick={() => onChange(i)}>★</span>
      ))}
    </div>
  );
}`
  },
  {
    name: 'Progress Bar',
    description: 'Progress indicator component',
    category: 'progress',
    htmlCode: `<div class="progress-bar">
  <div class="progress-fill" style="width: 75%"></div>
</div>
<span class="progress-label">75%</span>`,
    cssCode: `.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 4px;
  transition: width 0.5s ease;
}
.progress-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  display: block;
}`,
    reactCode: `export function ProgressBar({ value }) {
  return (
    <>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: \`\${value}%\` }}></div>
      </div>
      <span className="progress-label">{value}%</span>
    </>
  );
}`
  },
  {
    name: 'Hero Section',
    description: 'Landing page hero section',
    category: 'hero-sections',
    htmlCode: `<section class="hero">
  <div class="hero-content">
    <h1>Build Amazing Things</h1>
    <p>The best components for your next project</p>
    <button class="btn btn-primary">Get Started</button>
  </div>
  <div class="hero-visual"></div>
</section>`,
    cssCode: `.hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
.hero h1 { font-size: 64px; margin-bottom: 24px; }
.hero p { font-size: 24px; opacity: 0.9; margin-bottom: 32px; }`,
    reactCode: `export function Hero({ title, subtitle, cta }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <button className="btn btn-primary">{cta}</button>
      </div>
      <div className="hero-visual"></div>
    </section>
  );
}`
  },
  {
    name: 'Footer',
    description: 'Website footer component',
    category: 'footers',
    htmlCode: `<footer class="footer">
  <div class="footer-col">
    <h4>Company</h4>
    <a href="#">About</a>
    <a href="#">Careers</a>
  </div>
  <div class="footer-col">
    <h4>Product</h4>
    <a href="#">Features</a>
    <a href="#">Pricing</a>
  </div>
  <div class="footer-bottom">© 2024 Company. All rights reserved.</div>
</footer>`,
    cssCode: `.footer {
  background: #1e293b;
  color: white;
  padding: 64px 32px 32px;
}
.footer-col {
  display: inline-block;
  vertical-align: top;
  margin-right: 64px;
}
.footer-col h4 { margin-bottom: 16px; }
.footer-col a {
  display: block;
  color: #94a3b8;
  text-decoration: none;
  margin-bottom: 8px;
}
.footer-col a:hover { color: white; }
.footer-bottom {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #334155;
  color: #94a3b8;
}`,
    reactCode: `export function Footer({ columns }) {
  return (
    <footer className="footer">
      {columns.map(col => (
        <div key={col.title} className="footer-col">
          <h4>{col.title}</h4>
          {col.links.map(link => <a key={link} href="#">{link}</a>)}
        </div>
      ))}
      <div className="footer-bottom">© 2024 Company. All rights reserved.</div>
    </footer>
  );
}`
  },
  {
    name: 'Pricing Card',
    description: 'Pricing table card',
    category: 'pricing-tables',
    htmlCode: `<div class="pricing-card">
  <h3>Pro</h3>
  <div class="price">$29<span>/month</span></div>
  <ul class="features">
    <li>✓ Unlimited Projects</li>
    <li>✓ Priority Support</li>
    <li>✓ Advanced Analytics</li>
  </ul>
  <button class="btn btn-primary">Get Started</button>
</div>`,
    cssCode: `.pricing-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  border: 2px solid #e2e8f0;
  transition: all 0.3s;
}
.pricing-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.price { font-size: 48px; font-weight: 700; margin: 16px 0; }
.price span { font-size: 16px; color: #64748b; }
.features { list-style: none; padding: 0; margin: 24px 0; text-align: left; }
.features li { padding: 8px 0; color: #374151; }`,
    reactCode: `export function PricingCard({ plan, price, features }) {
  return (
    <div className="pricing-card">
      <h3>{plan}</h3>
      <div className="price">${price}<span>/month</span></div>
      <ul className="features">{features.map(f => <li key={f}>✓ {f}</li>)}</ul>
      <button className="btn btn-primary">Get Started</button>
    </div>
  );
}`
  },
  {
    name: 'Testimonial Card',
    description: 'Customer testimonial component',
    category: 'testimonials',
    htmlCode: `<div class="testimonial">
  <p class="quote">"Amazing product! It changed how we work."</p>
  <div class="author">
    <img src="avatar.jpg" alt="Author" />
    <div>
      <strong>John Doe</strong>
      <span>CEO, Company</span>
    </div>
  </div>
</div>`,
    cssCode: `.testimonial {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.quote { font-size: 18px; color: #374151; line-height: 1.6; margin-bottom: 24px; }
.author { display: flex; align-items: center; gap: 16px; }
.author img { width: 48px; height: 48px; border-radius: 50%; }
.author strong { display: block; color: #1e293b; }
.author span { font-size: 14px; color: #64748b; }`,
    reactCode: `export function Testimonial({ quote, author }) {
  return (
    <div className="testimonial">
      <p className="quote">"{quote}"</p>
      <div className="author">
        <img src={author.avatar} alt={author.name} />
        <div><strong>{author.name}</strong><span>{author.role}</span></div>
      </div>
    </div>
  );
}`
  },
  {
    name: 'Feature Card',
    description: 'Feature highlight component',
    category: 'features',
    htmlCode: `<div class="feature">
  <div class="feature-icon">⚡</div>
  <h3>Lightning Fast</h3>
  <p>Blazing fast performance for optimal user experience</p>
</div>`,
    cssCode: `.feature { text-align: center; padding: 32px; }
.feature-icon {
  width: 64px; height: 64px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; margin: 0 auto 24px;
}
.feature h3 { margin-bottom: 12px; color: #1e293b; }
.feature p { color: #64748b; line-height: 1.6; }`,
    reactCode: `export function Feature({ icon, title, description }) {
  return (
    <div className="feature">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}`
  },
  {
    name: 'Stat Counter',
    description: 'Statistics counter component',
    category: 'stats',
    htmlCode: `<div class="stat">
  <div class="stat-value">10K+</div>
  <div class="stat-label">Active Users</div>
</div>`,
    cssCode: `.stat { text-align: center; padding: 24px; }
.stat-value {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stat-label { font-size: 16px; color: #64748b; margin-top: 8px; }`,
    reactCode: `export function Stat({ value, label }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}`
  },
  {
    name: 'Team Card',
    description: 'Team member card',
    category: 'teams',
    htmlCode: `<div class="team-card">
  <img src="member.jpg" alt="Team Member" />
  <h3>Sarah Johnson</h3>
  <p>Design Lead</p>
  <div class="social-links">
    <a href="#">Twitter</a>
    <a href="#">LinkedIn</a>
  </div>
</div>`,
    cssCode: `.team-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: transform 0.3s;
}
.team-card:hover { transform: translateY(-8px); }
.team-card img {
  width: 120px; height: 120px;
  border-radius: 50%;
  margin-bottom: 16px;
}
.team-card h3 { margin-bottom: 4px; }
.team-card p { color: #64748b; margin-bottom: 16px; }
.social-links a {
  color: #6366f1; margin: 0 8px; text-decoration: none;
}`,
    reactCode: `export function TeamCard({ member }) {
  return (
    <div className="team-card">
      <img src={member.photo} alt={member.name} />
      <h3>{member.name}</h3>
      <p>{member.role}</p>
      <div className="social-links">
        {member.socials.map(s => <a key={s} href="#">{s}</a>)}
      </div>
    </div>
  );
}`
  },
  {
    name: 'Blog Card',
    description: 'Blog post card',
    category: 'blogs',
    htmlCode: `<article class="blog-card">
  <img src="blog.jpg" alt="Blog" />
  <div class="blog-content">
    <span class="blog-category">Technology</span>
    <h3>The Future of Web Design</h3>
    <p>Exploring the latest trends...</p>
    <div class="blog-meta">5 min read</div>
  </div>
</article>`,
    cssCode: `.blog-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.blog-card img { width: 100%; height: 200px; object-fit: cover; }
.blog-content { padding: 24px; }
.blog-category {
  font-size: 12px; color: #6366f1; font-weight: 600; text-transform: uppercase;
}
.blog-card h3 { margin: 12px 0; }
.blog-meta { font-size: 12px; color: #94a3b8; margin-top: 16px; }`,
    reactCode: `export function BlogCard({ post }) {
  return (
    <article className="blog-card">
      <img src={post.image} alt={post.title} />
      <div className="blog-content">
        <span className="blog-category">{post.category}</span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="blog-meta">{post.readTime} min read</div>
      </div>
    </article>
  );
}`
  },
  {
    name: 'Product Card',
    description: 'E-commerce product card',
    category: 'products',
    htmlCode: `<div class="product-card">
  <div class="product-badge">New</div>
  <img src="product.jpg" alt="Product" />
  <h3>Wireless Headphones</h3>
  <p class="price">$199.99</p>
  <button class="btn btn-primary">Add to Cart</button>
</div>`,
    cssCode: `.product-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  position: relative;
}
.product-badge {
  position: absolute;
  top: 16px; left: 16px;
  background: #6366f1;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px; font-weight: 600;
}
.product-card img { width: 100%; border-radius: 12px; margin-bottom: 16px; }
.product-card h3 { margin-bottom: 8px; }
.price { font-size: 24px; font-weight: 700; color: #6366f1; margin-bottom: 16px; }`,
    reactCode: `export function ProductCard({ product }) {
  return (
    <div className="product-card">
      {product.badge && <div className="product-badge">{product.badge}</div>}
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <button className="btn btn-primary">Add to Cart</button>
    </div>
  );
}`
  },
  {
    name: 'Image Gallery',
    description: 'Photo gallery grid',
    category: 'galleries',
    htmlCode: `<div class="gallery">
  <div class="gallery-item"><img src="1.jpg" /></div>
  <div class="gallery-item"><img src="2.jpg" /></div>
  <div class="gallery-item"><img src="3.jpg" /></div>
</div>`,
    cssCode: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.gallery-item {
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
}
.gallery-item img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.3s;
}
.gallery-item:hover img { transform: scale(1.1); }`,
    reactCode: `export function Gallery({ images }) {
  return (
    <div className="gallery">
      {images.map((src, i) => (
        <div key={i} className="gallery-item"><img src={src} alt={\`img-\${i}\`} /></div>
      ))}
    </div>
  );
}`
  },
  {
    name: 'Login Form',
    description: 'Login/register form',
    category: 'login-forms',
    htmlCode: `<form class="login-form">
  <h2>Welcome Back</h2>
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <button type="submit" class="btn btn-primary">Sign In</button>
  <a href="#">Forgot password?</a>
</form>`,
    cssCode: `.login-form {
  background: white;
  padding: 48px;
  border-radius: 16px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}
.login-form h2 { text-align: center; margin-bottom: 32px; }
.login-form input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 16px;
}
.login-form .btn { width: 100%; margin-top: 8px; }
.login-form a { display: block; text-align: center; margin-top: 16px; color: #64748b; }`,
    reactCode: `export function LoginForm({ onSubmit }) {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <h2>Welcome Back</h2>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit" className="btn btn-primary">Sign In</button>
      <a href="#">Forgot password?</a>
    </form>
  );
}`
  },
  {
    name: 'Dashboard Widget',
    description: 'Analytics dashboard widget',
    category: 'dashboards',
    htmlCode: `<div class="widget">
  <div class="widget-header">
    <h4>Total Revenue</h4>
    <span class="widget-badge">+12%</span>
  </div>
  <div class="widget-value">$45,231</div>
  <div class="widget-chart">Chart here</div>
</div>`,
    cssCode: `.widget {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.widget-badge {
  background: #dcfce7; color: #166534;
  padding: 4px 8px; border-radius: 8px; font-size: 12px;
}
.widget-value { font-size: 32px; font-weight: 700; color: #1e293b; }
.widget-chart { margin-top: 24px; height: 60px; background: #f1f5f9; border-radius: 8px; }`,
    reactCode: `export function Widget({ title, value, change, children }) {
  return (
    <div className="widget">
      <div className="widget-header">
        <h4>{title}</h4>
        <span className="widget-badge">{change}</span>
      </div>
      <div className="widget-value">{value}</div>
      {children}
    </div>
  );
}`
  }
];

const variationTemplates = [
  { name: 'Default', classSuffix: '' },
  { name: 'Large', classSuffix: '-lg' },
  { name: 'Small', classSuffix: '-sm' },
  { name: 'Outline', classSuffix: '-outline' },
  { name: 'Ghost', classSuffix: '-ghost' },
  { name: 'Rounded Full', classSuffix: '-pill' },
  { name: 'Square', classSuffix: '-square' },
  { name: 'Disabled', classSuffix: '-disabled' },
  { name: 'Loading', classSuffix: '-loading' },
  { name: 'Icon Left', classSuffix: '-icon' },
  { name: 'Icon Only', classSuffix: '-icon-only' },
  { name: 'Gradient', classSuffix: '-gradient' },
  { name: '3D', classSuffix: '-3d' },
  { name: 'Neon', classSuffix: '-neon' },
  { name: 'Minimal', classSuffix: '-minimal' }
];

async function seed() {
  try {
    console.log('🌱 Starting seed...');
    
    await sequelize.sync({ force: true });
    console.log('✓ Database synced');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@gallery.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✓ Admin user created');

    const regularUser = await User.create({
      username: 'user',
      email: 'user@gallery.com',
      password: hashedPassword,
      role: 'user'
    });
    console.log('✓ Regular user created');

    const createdCategories = await Category.bulkCreate(categories);
    console.log(`✓ Created ${createdCategories.length} categories`);

    const createdStyles = await Style.bulkCreate(styles);
    console.log(`✓ Created ${createdStyles.length} styles`);

    const categoryMap = {};
    createdCategories.forEach(c => { categoryMap[c.slug] = c.id; });
    const styleMap = {};
    createdStyles.forEach(s => { styleMap[s.slug] = s.id; });

    let componentCount = 0;
    let variationCount = 0;

    for (const template of componentTemplates) {
      const categoryId = categoryMap[template.category];
      
      const component = await ShowcaseComponent.create({
        name: template.name,
        slug: template.name.toLowerCase().replace(/\s+/g, '-'),
        description: template.description,
        categoryId,
        userId: adminUser.id,
        thumbnail: `https://picsum.photos/seed/${componentCount + 1}/400/300`,
        isPremium: Math.random() > 0.7,
        isFeatured: Math.random() > 0.8,
        status: 'published'
      });

      for (const variation of variationTemplates) {
        await Variation.create({
          showcaseComponentId: component.id,
          styleId: createdStyles[Math.floor(Math.random() * createdStyles.length)].id,
          name: `${template.name} ${variation.name}`,
          htmlCode: template.htmlCode.replace('class="', `class="${variation.classSuffix.replace('-', '')} `),
          cssCode: template.cssCode,
          reactCode: template.reactCode,
          isDefault: variation.name === 'Default'
        });
        variationCount++;
      }

      const tags = ['ui', 'component', template.category, template.name.toLowerCase().split(' ')[0]];
      await component.setTags([Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1]);

      componentCount++;
    }

    for (let i = componentCount; i < 220; i++) {
      const template = componentTemplates[i % componentTemplates.length];
      const categoryId = categoryMap[template.category];
      
      const component = await ShowcaseComponent.create({
        name: `${template.name} ${Math.floor(i / componentTemplates.length) + 1}`,
        slug: `${template.name.toLowerCase().replace(/\s+/g, '-')}-${i}`,
        description: template.description,
        categoryId,
        userId: i % 2 === 0 ? adminUser.id : regularUser.id,
        thumbnail: `https://picsum.photos/seed/${i + 100}/400/300`,
        isPremium: Math.random() > 0.7,
        isFeatured: Math.random() > 0.85,
        status: 'published'
      });

      const numVariations = Math.floor(Math.random() * 6) + 10;
      const selectedStyles = createdStyles.sort(() => 0.5 - Math.random()).slice(0, numVariations);
      
      for (let j = 0; j < numVariations; j++) {
        await Variation.create({
          showcaseComponentId: component.id,
          styleId: selectedStyles[j].id,
          name: `${template.name} ${variationTemplates[j % variationTemplates.length].name}`,
          htmlCode: template.htmlCode,
          cssCode: template.cssCode,
          reactCode: template.reactCode,
          isDefault: j === 0
        });
        variationCount++;
      }

      const tagCount = Math.floor(Math.random() * 4) + 1;
      const tagIds = [];
      for (let t = 0; t < tagCount; t++) {
        tagIds.push(Math.floor(Math.random() * 10) + 1);
      }
      await component.setTags([...new Set(tagIds)]);
    }

    console.log(`✓ Created ${componentCount + (220 - componentCount)} showcase components`);
    console.log(`✓ Created ${variationCount} variations`);

    const allComponents = await ShowcaseComponent.findAll();
    for (const component of allComponents.slice(0, 50)) {
      await Favorite.create({
        userId: regularUser.id,
        showcaseComponentId: component.id
      });
    }
    console.log('✓ Created favorites');

    for (const component of allComponents.slice(0, 100)) {
      await ComponentView.create({
        showcaseComponentId: component.id,
        userId: regularUser.id
      });
    }
    console.log('✓ Created views');

    await Setting.bulkCreate([
      { key: 'siteName', value: 'UI Asset Gallery', type: 'string' },
      { key: 'siteDescription', value: 'A comprehensive gallery for UI components', type: 'string' },
      { key: 'itemsPerPage', value: '12', type: 'number' },
      { key: 'theme', value: 'light', type: 'string' },
      { key: 'allowRegistration', value: 'true', type: 'boolean' },
      { key: 'maintenanceMode', value: 'false', type: 'boolean' }
    ]);
    console.log('✓ Created settings');

    console.log('\n🎉 Seed completed successfully!');
    console.log(`   - ${createdCategories.length} categories`);
    console.log(`   - ${createdStyles.length} styles`);
    console.log(`   - ${await ShowcaseComponent.count()} showcase components`);
    console.log(`   - ${await Variation.count()} variations`);
    console.log(`   - ${await Tag.count()} tags`);
    console.log(`   - ${await Favorite.count()} favorites`);
    console.log(`   - ${await Setting.count()} settings`);

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
