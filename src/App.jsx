import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Check,
  ChevronRight,
  AlertCircle,
  Clock3,
  Copy,
  Image,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Settings2,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  Truck,
  UserRound,
  X,
} from 'lucide-react';
import { supabase } from './lib/supabase.js';

const textField = (name, label, options = {}) => ({
  name,
  label,
  type: 'text',
  ...options,
});

const ADMIN_SECTIONS = [
  {
    key: 'overview',
    label: 'Overview',
    group: 'Workspace',
    icon: LayoutDashboard,
  },
  {
    key: 'company',
    label: 'Company profile',
    group: 'Site',
    icon: Settings2,
    table: 'street_trading_co_company_info',
    single: true,
    title: 'Company profile',
    description: 'The public identity, address, VAT settings, and customer messaging used by Street Trading Co.',
    columns: ['name', 'company_address', 'contact_email', 'maintenance_mode'],
    fields: [
      textField('name', 'Company name', { required: true }),
      textField('company_address', 'Address', { placeholder: '54 Devizes Road, Swindon SN1 4BG' }),
      textField('company_phone', 'Phone'),
      textField('contact_email', 'Contact email', { type: 'email' }),
      textField('company_vat_number', 'VAT number'),
      textField('founded_year', 'Founded year'),
      textField('description', 'Description', { type: 'textarea', rows: 4 }),
      textField('mission', 'Mission', { type: 'textarea', rows: 3 }),
      textField('specialties', 'Specialties', { type: 'array', placeholder: 'Trading, sourcing, events' }),
      textField('social_media', 'Social media JSON', { type: 'json', rows: 4, placeholder: '{"instagram":"https://..."}' }),
      textField('stats', 'Stats JSON', { type: 'json', rows: 4, placeholder: '{"years_experience":"6+"}' }),
      textField('maintenance_mode', 'Maintenance mode', { type: 'boolean', default: false }),
      textField('vat_enabled', 'VAT enabled', { type: 'boolean', default: false }),
      textField('default_vat_rate', 'Default VAT rate', { type: 'number', default: 0.2, step: '0.01' }),
      textField('customer_vat_display_option', 'Customer VAT display', {
        type: 'select',
        options: [
          { value: 'inclusive', label: 'Inclusive' },
          { value: 'exclusive', label: 'Exclusive' },
          { value: 'both', label: 'Both' },
        ],
        default: 'inclusive',
      }),
      textField('admin_notification_email', 'Admin notification email', { type: 'email' }),
      textField('customer_from_name', 'Customer email sender name'),
      textField('invoice_terms', 'Invoice terms', { type: 'textarea', rows: 3 }),
      textField('email_signature', 'Email signature', { type: 'textarea', rows: 3 }),
      textField('success_message', 'Checkout success message', { type: 'textarea', rows: 3 }),
      textField('order_confirmation_text', 'Order confirmation text', { type: 'textarea', rows: 3 }),
      textField('processing_text', 'Processing text', { type: 'textarea', rows: 3 }),
      textField('delivery_text', 'Delivery text', { type: 'textarea', rows: 3 }),
      textField('order_confirmation_email_html', 'Order confirmation email HTML', { type: 'textarea', rows: 5 }),
      textField('admin_notification_email_html', 'Admin notification email HTML', { type: 'textarea', rows: 5 }),
      textField('in_production_email_html', 'In production email HTML', { type: 'textarea', rows: 5 }),
      textField('production_completed_email_html', 'Production completed email HTML', { type: 'textarea', rows: 5 }),
      textField('dispatched_email_html', 'Dispatched email HTML', { type: 'textarea', rows: 5 }),
      textField('completed_email_html', 'Completed email HTML', { type: 'textarea', rows: 5 }),
      textField('invoice_template_html', 'Invoice template HTML', { type: 'textarea', rows: 5 }),
      textField('delivery_note_template_html', 'Delivery note template HTML', { type: 'textarea', rows: 5 }),
    ],
  },
  {
    key: 'site',
    label: 'Holding page',
    group: 'Site',
    icon: Image,
    table: 'street_trading_co_site_config',
    single: true,
    fixedId: 1,
    title: 'Holding page',
    description: 'Control the launch state and artwork shown on streettrading.co.uk.',
    columns: ['company_name', 'holding_page', 'logo_path'],
    fields: [
      textField('company_name', 'Company name', { required: true, default: 'Street Trading Co.' }),
      textField('holding_page', 'Holding page enabled', { type: 'boolean', default: true }),
      textField('logo_path', 'Logo path', { default: '/logo.jpeg', placeholder: '/logo.jpeg' }),
    ],
  },
  {
    key: 'email-content',
    label: 'Email content',
    group: 'Site',
    icon: Copy,
    table: 'street_trading_co_company_info',
    single: true,
    title: 'Email content',
    description: 'Edit the customer and admin email templates used by order-status notifications.',
    columns: ['order_confirmation_email_html', 'in_production_email_html', 'dispatched_email_html'],
    fields: [
      textField('order_confirmation_email_html', 'Order confirmation HTML', { type: 'textarea', rows: 8 }),
      textField('admin_notification_email_html', 'Admin order notification HTML', { type: 'textarea', rows: 8 }),
      textField('in_production_email_html', 'In production HTML', { type: 'textarea', rows: 8 }),
      textField('production_completed_email_html', 'Production completed HTML', { type: 'textarea', rows: 8 }),
      textField('dispatched_email_html', 'Dispatched HTML', { type: 'textarea', rows: 8 }),
      textField('completed_email_html', 'Completed HTML', { type: 'textarea', rows: 8 }),
      textField('order_confirmation_text', 'Order confirmation plain text', { type: 'textarea', rows: 6 }),
      textField('processing_text', 'Processing plain text', { type: 'textarea', rows: 6 }),
      textField('delivery_text', 'Delivery plain text', { type: 'textarea', rows: 6 }),
    ],
  },
  {
    key: 'pdf-content',
    label: 'PDF content',
    group: 'Site',
    icon: Copy,
    table: 'street_trading_co_company_info',
    single: true,
    title: 'PDF content',
    description: 'Maintain the HTML templates used when an invoice or delivery note is generated.',
    columns: ['invoice_template_html', 'delivery_note_template_html'],
    fields: [
      textField('invoice_template_html', 'Invoice template HTML', { type: 'textarea', rows: 12 }),
      textField('delivery_note_template_html', 'Delivery note template HTML', { type: 'textarea', rows: 12 }),
      textField('invoice_terms', 'Invoice terms', { type: 'textarea', rows: 4 }),
    ],
  },
  {
    key: 'products',
    label: 'Products',
    group: 'Commerce',
    icon: Package,
    table: 'street_trading_co_products',
    title: 'Products',
    description: 'Create and maintain the catalogue used by the Street Trading storefront.',
    columns: ['name', 'category', 'base_price', 'purchase_type', 'featured', 'has_variations'],
    fields: [
      textField('name', 'Product name', { required: true }),
      textField('description', 'Description', { type: 'textarea', rows: 4, required: true }),
      textField('image', 'Main image URL', { type: 'image', required: true, placeholder: 'https://...' }),
      textField('base_price', 'Base price', { type: 'number', step: '0.01', default: 0 }),
      textField('category', 'Category', { required: true }),
      textField('purchase_type', 'Purchase type', {
        type: 'select',
        options: [
          { value: 'enquiry', label: 'Enquiry' },
          { value: 'buy', label: 'Buy online' },
        ],
        default: 'enquiry',
      }),
      textField('featured', 'Featured product', { type: 'boolean', default: false }),
      textField('has_variations', 'Has variations', { type: 'boolean', default: false }),
    ],
  },
  {
    key: 'categories',
    label: 'Categories',
    group: 'Commerce',
    icon: Tag,
    table: 'street_trading_co_product_categories',
    title: 'Product categories',
    description: 'Organise products without touching Swordfish categories.',
    columns: ['name', 'description', 'active'],
    fields: [
      textField('name', 'Name', { required: true }),
      textField('description', 'Description', { type: 'textarea', rows: 3 }),
      textField('active', 'Active', { type: 'boolean', default: true }),
    ],
  },
  {
    key: 'images',
    label: 'Product images',
    group: 'Commerce',
    icon: Image,
    table: 'street_trading_co_product_images',
    title: 'Product images',
    description: 'Attach additional image URLs to a Street Trading product.',
    columns: ['product_id', 'image_url', 'is_main'],
    fields: [
      textField('product_id', 'Product ID', { required: true, placeholder: 'UUID from Products' }),
      textField('image_url', 'Image URL', { type: 'image', required: true, placeholder: 'https://...' }),
      textField('is_main', 'Main image', { type: 'boolean', default: false }),
    ],
  },
  {
    key: 'variations',
    label: 'Variations',
    group: 'Commerce',
    icon: Copy,
    table: 'street_trading_co_product_variations',
    title: 'Product variations',
    description: 'Define variation groups such as size, colour, or material.',
    columns: ['product_id', 'name', 'order_index'],
    fields: [
      textField('product_id', 'Product ID', { required: true }),
      textField('name', 'Variation name', { required: true, placeholder: 'Size' }),
      textField('order_index', 'Display order', { type: 'integer', default: 1 }),
    ],
  },
  {
    key: 'options',
    label: 'Variation options',
    group: 'Commerce',
    icon: BarChart3,
    table: 'street_trading_co_variation_options',
    title: 'Variation options',
    description: 'Set option pricing and stock levels. Stock status is calculated securely in the database.',
    columns: ['variation_id', 'label', 'price_modifier', 'stock', 'stock_status'],
    fields: [
      textField('variation_id', 'Variation ID', { required: true }),
      textField('label', 'Option label', { required: true, placeholder: 'Large' }),
      textField('price_modifier', 'Price modifier', { type: 'number', step: '0.01', default: 0 }),
      textField('parent_variation_id', 'Parent variation ID'),
      textField('stock', 'Stock', { type: 'integer', default: 0 }),
      textField('low_stock_threshold', 'Low-stock threshold', { type: 'integer', default: 5 }),
    ],
  },
  {
    key: 'variants',
    label: 'Stock variants',
    group: 'Commerce',
    icon: ShoppingBag,
    table: 'street_trading_co_product_variants',
    title: 'Stock variants',
    description: 'Manage SKUs and stock for combinations of product options.',
    columns: ['product_id', 'sku', 'stock', 'stock_status', 'low_stock_threshold'],
    fields: [
      textField('product_id', 'Product ID', { required: true }),
      textField('option1_id', 'Option 1 ID'),
      textField('option2_id', 'Option 2 ID'),
      textField('sku', 'SKU'),
      textField('stock', 'Stock', { type: 'integer', default: 0 }),
      textField('low_stock_threshold', 'Low-stock threshold', { type: 'integer', default: 5 }),
      textField('image_url', 'Variant image URL', { type: 'image' }),
    ],
  },
  {
    key: 'orders',
    label: 'Orders',
    group: 'Commerce',
    icon: ShoppingBag,
    table: 'street_trading_co_orders',
    title: 'Orders',
    description: 'Review orders and move them through the same production and delivery statuses as Swordfish.',
    allowCreate: false,
    allowDelete: false,
    columns: ['customer_name', 'customer_email', 'total_amount', 'status', 'created_at'],
    fields: [
      textField('stripe_session_id', 'Stripe session ID', { required: true }),
      textField('customer_email', 'Customer email', { required: true, type: 'email' }),
      textField('customer_name', 'Customer name'),
      textField('total_amount', 'Total amount (minor units)', { type: 'integer', required: true }),
      textField('currency', 'Currency', { default: 'gbp' }),
      textField('status', 'Status', {
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'paid', label: 'Paid' },
          { value: 'in_production', label: 'In production' },
          { value: 'production_completed', label: 'Production completed' },
          { value: 'dispatched', label: 'Dispatched' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'completed', label: 'Completed' },
          { value: 'problem', label: 'Problem' },
          { value: 'failed', label: 'Failed' },
          { value: 'refunded', label: 'Refunded' },
        ],
        default: 'pending',
      }),
      textField('items', 'Items JSON', { type: 'json', rows: 5, default: '[]' }),
      textField('shipping_address', 'Shipping address JSON', { type: 'json', rows: 4 }),
      textField('billing_address', 'Billing address JSON', { type: 'json', rows: 4 }),
      textField('delivery_cost', 'Delivery cost (minor units)', { type: 'integer', default: 0 }),
      textField('discount_amount', 'Discount amount (minor units)', { type: 'integer', default: 0 }),
      textField('discount_code', 'Discount code'),
      textField('shipping_method', 'Shipping method'),
      textField('dispatched_at', 'Dispatched at', { type: 'datetime' }),
      textField('tracking_number', 'Tracking number'),
      textField('admin_notes', 'Admin notes', { type: 'textarea', rows: 4 }),
    ],
  },
  {
    key: 'discount-url',
    label: 'Discount URL',
    group: 'Marketing',
    icon: Copy,
    tool: 'discount-url',
    title: 'Discount URL generator',
    description: 'Generate a product link that pre-selects a discount code, as in the Swordfish settings workspace.',
  },
  {
    key: 'discounts',
    label: 'Discount codes',
    group: 'Marketing',
    icon: Tag,
    table: 'street_trading_co_discount_codes',
    title: 'Discount codes',
    description: 'Create percentage or fixed-amount promotions with usage limits.',
    columns: ['code', 'type', 'amount', 'current_uses', 'active', 'valid_until'],
    fields: [
      textField('code', 'Code', { required: true, placeholder: 'WELCOME10' }),
      textField('type', 'Discount type', {
        type: 'select',
        options: [
          { value: 'fixed_amount', label: 'Fixed amount' },
          { value: 'percentage', label: 'Percentage' },
        ],
        default: 'fixed_amount',
      }),
      textField('amount', 'Amount', { type: 'integer', default: 0 }),
      textField('min_order_value', 'Minimum order value', { type: 'integer', default: 0 }),
      textField('max_uses', 'Maximum uses', { type: 'integer' }),
      textField('current_uses', 'Current uses', { type: 'integer', default: 0 }),
      textField('active', 'Active', { type: 'boolean', default: true }),
      textField('valid_from', 'Valid from', { type: 'datetime' }),
      textField('valid_until', 'Valid until', { type: 'datetime' }),
    ],
  },
  {
    key: 'delivery',
    label: 'Delivery rates',
    group: 'Commerce',
    icon: Truck,
    table: 'street_trading_co_delivery_rates',
    title: 'Delivery rates',
    description: 'Configure delivery costs and free-shipping thresholds.',
    columns: ['country_name', 'min_order_value', 'max_order_value', 'cost', 'active'],
    fields: [
      textField('country', 'Country code', { required: true, placeholder: 'GB' }),
      textField('country_name', 'Country name', { required: true, placeholder: 'United Kingdom' }),
      textField('min_order_value', 'Minimum order value', { type: 'integer', default: 0 }),
      textField('max_order_value', 'Maximum order value', { type: 'integer' }),
      textField('cost', 'Delivery cost', { type: 'integer', default: 0 }),
      textField('free_shipping_threshold', 'Free-shipping threshold', { type: 'integer' }),
      textField('active', 'Active', { type: 'boolean', default: true }),
    ],
  },
  {
    key: 'artists',
    label: 'Artists',
    group: 'People',
    icon: UserRound,
    table: 'street_trading_co_artists',
    title: 'Artists',
    description: 'Manage artist profiles and featured placement.',
    columns: ['name', 'instagram_handle', 'featured'],
    fields: [
      textField('name', 'Name', { required: true }),
      textField('bio', 'Bio', { type: 'textarea', rows: 4, required: true }),
      textField('image', 'Profile image URL', { type: 'image', required: true }),
      textField('instagram_handle', 'Instagram handle', { required: true }),
      textField('featured', 'Featured', { type: 'boolean', default: false }),
    ],
  },
  {
    key: 'portfolio',
    label: 'Artist portfolio',
    group: 'People',
    icon: Image,
    table: 'street_trading_co_artist_portfolio_images',
    title: 'Artist portfolio',
    description: 'Attach portfolio image URLs to an isolated Street Trading artist.',
    columns: ['artist_id', 'image_url', 'created_at'],
    fields: [
      textField('artist_id', 'Artist ID', { required: true }),
      textField('image_url', 'Image URL', { type: 'image', required: true }),
    ],
  },
  {
    key: 'reviews',
    label: 'Reviews',
    group: 'People',
    icon: Star,
    table: 'street_trading_co_reviews',
    title: 'Reviews',
    description: 'Publish and maintain customer reviews.',
    columns: ['customer_name', 'rating', 'comment', 'date', 'product'],
    fields: [
      textField('customer_name', 'Customer name', { required: true }),
      textField('rating', 'Rating', { type: 'integer', min: 1, max: 5, default: 5 }),
      textField('comment', 'Comment', { type: 'textarea', rows: 4, required: true }),
      textField('date', 'Display date', { required: true, placeholder: '23 October 2026' }),
      textField('product', 'Product'),
    ],
  },
  {
    key: 'offers',
    label: 'Special offers',
    group: 'Marketing',
    icon: Star,
    table: 'street_trading_co_special_offers',
    title: 'Special offers',
    description: 'Schedule the offers surfaced across the public site.',
    columns: ['title', 'valid_until', 'active'],
    fields: [
      textField('title', 'Title', { required: true }),
      textField('description', 'Description', { type: 'textarea', rows: 4, required: true }),
      textField('valid_until', 'Valid until', { required: true }),
      textField('active', 'Active', { type: 'boolean', default: true }),
    ],
  },
  {
    key: 'events',
    label: 'Events',
    group: 'Marketing',
    icon: CalendarDays,
    table: 'street_trading_co_events',
    title: 'Events',
    description: 'Manage events and appearances.',
    columns: ['title', 'date', 'location', 'active'],
    fields: [
      textField('title', 'Title', { required: true }),
      textField('description', 'Description', { type: 'textarea', rows: 4, required: true }),
      textField('date', 'Date', { required: true }),
      textField('location', 'Location', { required: true }),
      textField('active', 'Active', { type: 'boolean', default: true }),
    ],
  },
  {
    key: 'analytics',
    label: 'Analytics',
    group: 'Workspace',
    icon: BarChart3,
    tool: 'analytics',
    title: 'Analytics',
    description: 'Review catalogue, order, revenue, and engagement totals from the isolated Street Trading tables.',
  },
  {
    key: 'access',
    label: 'Admin access',
    group: 'Workspace',
    icon: Settings2,
    table: 'street_trading_co_admin_users',
    title: 'Admin access',
    description: 'Access is granted through Supabase Auth and this isolated allow-list. Account creation is intentionally kept out of the public client.',
    allowCreate: false,
    allowDelete: false,
    allowEdit: false,
    columns: ['user_id', 'role', 'created_at'],
    fields: [
      textField('user_id', 'User ID', { readOnly: true }),
      textField('role', 'Role', { readOnly: true }),
      textField('created_at', 'Granted', { readOnly: true }),
    ],
  },
];

const sectionsByKey = Object.fromEntries(ADMIN_SECTIONS.map((section) => [section.key, section]));
const STREET_TRADING_ADMIN_URL = 'https://streettrading.co.uk/admin';

function hasRecoveryMarker() {
  const hashType = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('type');
  const queryType = new URLSearchParams(window.location.search).get('type');
  return hashType === 'recovery' || queryType === 'recovery';
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const recoveryRedirect = hasRecoveryMarker();

  if (recoveryRedirect || path === '/admin' || path.startsWith('/admin/')) return <AdminLogin />;

  return <HoldingPage />;
}

function HoldingPage() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadConfig() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('street_trading_co_site_config')
        .select('company_name, holding_page, logo_path')
        .eq('id', 1)
        .maybeSingle();

      if (!error && active && data) setConfig(data);
    }

    loadConfig();
    return () => { active = false; };
  }, []);

  const companyName = config?.company_name || 'Street Trading Co.';
  const logoPath = config?.logo_path || '/logo.jpeg';

  return (
    <main className="holding-page">
      <div className="grain" aria-hidden="true" />
      <header className="topline">
        <a className="wordmark" href="/" aria-label="Street Trading Co. home">
          <span className="wordmark-mark" aria-hidden="true">ST</span>
          <span>{companyName.toUpperCase()}</span>
        </a>
        <div className="top-actions">
          <span className="status"><i /> WEBSITE IN THE WORKS</span>
          <a className="admin-link" href="/admin">
            <LockKeyhole size={13} strokeWidth={1.7} />
            <span>ADMIN LOGIN</span>
          </a>
        </div>
      </header>

      <section className="hero" aria-labelledby="headline">
        <div className="logo-frame">
          <img src={logoPath} alt="Street Trading Co. skull and gothic lettering logo" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow"><span>01</span> A NEW CHAPTER</p>
          <h1 id="headline">Something<br /><em>GREAT</em> is coming.</h1>
          <p className="intro">Street Trading Co. is getting a new home online.<br className="desktop-break" /> Check back soon to see what we’re building.</p>
          <div className="address-block" aria-label="Street Trading Co. address">
            <span className="address-label">FIND US</span>
            <address>54 Devizes Road<br />Swindon</address>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>INDEPENDENT SPIRIT. STREET LEVEL.</span>
        <span>© {new Date().getFullYear()} {companyName.toUpperCase()}</span>
      </footer>
    </main>
  );
}

function AdminLogin() {
  // Supabase may consume the recovery hash while it establishes the session.
  // Capture the marker before that happens so the recovery session cannot be
  // mistaken for an ordinary sign-in and sent straight to the dashboard.
  const recoveryEntryRef = useRef(hasRecoveryMarker());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPassword, setRecoveryPassword] = useState('');
  const [recoveryConfirmation, setRecoveryConfirmation] = useState('');
  const [recoveryMode, setRecoveryMode] = useState(() => {
    return hasRecoveryMarker() ? 'update' : '';
  });
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState({ kind: '', message: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, recoverySession) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && recoveryEntryRef.current)) {
        setRecoveryMode('update');
        setSession(null);
        if (recoverySession?.user?.email) setRecoveryEmail(recoverySession.user.email);
      }
    });

    async function restoreAuthorisedSession() {
      if (!supabase) return;

      const { data: { session: restoredSession } } = await supabase.auth.getSession();
      if (!restoredSession || !active) return;

      const recoveryRedirect = recoveryEntryRef.current || hasRecoveryMarker();
      if (recoveryRedirect) {
        setRecoveryMode('update');
        setRecoveryEmail(restoredSession.user?.email || '');
        return;
      }

      try {
        const authorised = await isAuthorisedAdmin(restoredSession.user.id);
        if (active && authorised) setSession(restoredSession);
        if (active && !authorised) await supabase.auth.signOut();
      } catch (error) {
        if (active) setStatus({ kind: 'error', message: error.message || 'Unable to verify administrator access.' });
      }
    }

    restoreAuthorisedSession();
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ kind: '', message: '' });

    if (!supabase) {
      setStatus({ kind: 'error', message: 'Admin sign-in is not configured yet.' });
      return;
    }

    setBusy(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      const authorised = await isAuthorisedAdmin(data.user.id);
      if (!authorised) {
        await supabase.auth.signOut();
        throw new Error('This account is not authorised for Street Trading Co.');
      }

      setSession(data.session);
      setPassword('');
    } catch (error) {
      setStatus({ kind: 'error', message: error.message || 'Unable to sign in. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setStatus({ kind: '', message: '' });
  }

  async function handleRequestReset(event) {
    event.preventDefault();
    setStatus({ kind: '', message: '' });

    if (!supabase) {
      setStatus({ kind: 'error', message: 'Password recovery is not configured yet.' });
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail.trim(), {
        redirectTo: STREET_TRADING_ADMIN_URL,
      });
      if (error) throw error;
      setStatus({ kind: 'success', message: 'If that address is authorised, a password reset link has been sent.' });
    } catch (error) {
      setStatus({ kind: 'error', message: error.message || 'Unable to send a password reset link.' });
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordUpdate(event) {
    event.preventDefault();
    setStatus({ kind: '', message: '' });

    if (recoveryPassword.length < 12) {
      setStatus({ kind: 'error', message: 'Use a password of at least 12 characters.' });
      return;
    }
    if (recoveryPassword !== recoveryConfirmation) {
      setStatus({ kind: 'error', message: 'The passwords do not match.' });
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: recoveryPassword });
      if (error) throw error;
      await supabase.auth.signOut();
      window.history.replaceState({}, document.title, '/admin');
      setRecoveryMode('');
      setRecoveryPassword('');
      setRecoveryConfirmation('');
      setStatus({ kind: 'success', message: 'Password updated. You can now sign in.' });
    } catch (error) {
      setStatus({ kind: 'error', message: error.message || 'Unable to update the password.' });
    } finally {
      setBusy(false);
    }
  }

  if (session) return <AdminDashboard session={session} onSignOut={handleSignOut} />;

  return (
    <main className="admin-page">
      <div className="grain" aria-hidden="true" />
      <header className="topline admin-topline">
        <a className="wordmark" href="/" aria-label="Street Trading Co. home">
          <span className="wordmark-mark" aria-hidden="true">ST</span>
          <span>STREET TRADING CO.</span>
        </a>
        <a className="back-link" href="/">
          <ArrowLeft size={14} strokeWidth={1.7} /> BACK TO SITE
        </a>
      </header>

      <section className="admin-shell" aria-labelledby="admin-headline">
        <div className="admin-card">
          <p className="eyebrow"><span>02</span> PRIVATE ACCESS</p>
          {recoveryMode === 'update' ? (
            <>
              <h1 id="admin-headline">Set a new<br /><em>password.</em></h1>
              <p className="intro">Choose a password for your Street Trading Co. administrator account.</p>
              <form className="admin-form" onSubmit={handlePasswordUpdate}>
                <label className="admin-field">
                  <span>NEW PASSWORD</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    value={recoveryPassword}
                    onChange={(event) => setRecoveryPassword(event.target.value)}
                    required
                  />
                </label>
                <label className="admin-field">
                  <span>CONFIRM PASSWORD</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    value={recoveryConfirmation}
                    onChange={(event) => setRecoveryConfirmation(event.target.value)}
                    required
                  />
                </label>
                <button className="admin-submit" type="submit" disabled={busy}>
                  {busy ? 'SAVING…' : 'SET PASSWORD'}
                </button>
                {status.message && <p className={'admin-status ' + status.kind}>{status.message}</p>}
              </form>
            </>
          ) : recoveryMode === 'request' ? (
            <>
              <h1 id="admin-headline">Reset<br /><em>password.</em></h1>
              <p className="intro">Enter your authorised email address and we’ll send a secure reset link.</p>
              <form className="admin-form" onSubmit={handleRequestReset}>
                <label className="admin-field">
                  <span>EMAIL ADDRESS</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={recoveryEmail}
                    onChange={(event) => setRecoveryEmail(event.target.value)}
                    required
                  />
                </label>
                <button className="admin-submit" type="submit" disabled={busy}>
                  {busy ? 'SENDING…' : 'EMAIL RESET LINK'}
                </button>
                <button className="admin-submit secondary" type="button" onClick={() => { setRecoveryMode(''); setStatus({ kind: '', message: '' }); }}>
                  BACK TO LOGIN
                </button>
                {status.message && <p className={'admin-status ' + status.kind}>{status.message}</p>}
              </form>
            </>
          ) : (
            <>
              <h1 id="admin-headline">Admin<br /><em>login.</em></h1>
              <p className="intro">This area is reserved for authorised Street Trading Co. administrators.</p>

              <form className="admin-form" onSubmit={handleSubmit}>
                <label className="admin-field">
                  <span>EMAIL ADDRESS</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <label className="admin-field">
                  <span>PASSWORD</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </label>
                <button className="admin-submit" type="submit" disabled={busy}>
                  {busy ? 'SIGNING IN…' : 'SIGN IN'}
                </button>
                <button className="admin-submit secondary" type="button" onClick={() => { setRecoveryEmail(email); setRecoveryMode('request'); setStatus({ kind: '', message: '' }); }}>
                  FORGOT PASSWORD?
                </button>
                {status.message && <p className={'admin-status ' + status.kind}>{status.message}</p>}
              </form>
            </>
          )}
        </div>
      </section>

      <footer className="footer">
        <span>STREET TRADING CO. ADMIN</span>
        <span>© {new Date().getFullYear()} STREET TRADING CO.</span>
      </footer>
    </main>
  );
}

async function isAuthorisedAdmin(userId) {
  if (!supabase) return false;

  const { data, error } = await supabase
    .from('street_trading_co_admin_users')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data?.role === 'admin';
}

function AdminDashboard({ session, onSignOut }) {
  const [activeKey, setActiveKey] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activeSection = sectionsByKey[activeKey] || sectionsByKey.overview;
  const groups = ['Workspace', 'Site', 'Commerce', 'Marketing', 'People'];

  function selectSection(key) {
    setActiveKey(key);
    setMobileNavOpen(false);
  }

  return (
    <main className="dashboard-page">
      <div className="grain" aria-hidden="true" />
      <header className="dashboard-header">
        <a className="wordmark" href="/" aria-label="Street Trading Co. home">
          <span className="wordmark-mark" aria-hidden="true">ST</span>
          <span>STREET TRADING CO.</span>
        </a>
        <div className="dashboard-header-right">
          <span className="dashboard-user">{session?.user?.email || 'ADMIN'}</span>
          <button className="dashboard-signout" type="button" onClick={onSignOut}>
            <LogOut size={14} /> <span>SIGN OUT</span>
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className={'dashboard-sidebar ' + (mobileNavOpen ? 'is-open' : '')}>
          <div className="sidebar-heading">
            <span>MANAGEMENT</span>
            <span className="live-dot"><i /> PRIVATE</span>
          </div>
          <nav className="dashboard-nav" aria-label="Admin sections">
            {groups.map((group) => (
              <div className="nav-group" key={group}>
                <p>{group}</p>
                {ADMIN_SECTIONS.filter((section) => section.group === group).map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      className={'nav-item ' + (section.key === activeKey ? 'is-active' : '')}
                      key={section.key}
                      type="button"
                      onClick={() => selectSection(section.key)}
                    >
                      <Icon size={15} strokeWidth={1.7} />
                      <span>{section.label}</span>
                      {section.key === activeKey && <ChevronRight className="nav-chevron" size={13} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="sidebar-note">
            <AlertCircle size={14} />
            <span>Street Trading data is isolated from Swordfish tables.</span>
          </div>
        </aside>

        <section className="dashboard-main">
          <div className="mobile-dashboard-nav">
            <button type="button" onClick={() => setMobileNavOpen((value) => !value)}>
              <Menu size={16} /> <span>{activeSection.label}</span>
            </button>
          </div>
          <div className="dashboard-breadcrumb">
            <span>STREET TRADING CO. / ADMIN</span>
            <ChevronRight size={13} />
            <strong>{activeSection.label.toUpperCase()}</strong>
          </div>
          {activeKey === 'overview' ? (
            <Overview onOpen={selectSection} />
          ) : activeSection.tool === 'discount-url' ? (
            <DiscountUrlPanel />
          ) : activeSection.tool === 'analytics' ? (
            <AnalyticsPanel />
          ) : (
            <CrudPanel key={activeKey} section={activeSection} />
          )}
        </section>
      </div>
    </main>
  );
}

function Overview({ onOpen }) {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      if (!supabase) return;

      const targets = [
        ['products', 'street_trading_co_products'],
        ['orders', 'street_trading_co_orders'],
        ['artists', 'street_trading_co_artists'],
        ['reviews', 'street_trading_co_reviews'],
        ['offers', 'street_trading_co_special_offers'],
        ['events', 'street_trading_co_events'],
      ];

      const results = await Promise.all(
        targets.map(async ([key, table]) => {
          const { count, error: countError } = await supabase
            .from(table)
            .select('id', { count: 'exact', head: true });
          return [key, countError ? null : count || 0, countError];
        }),
      );

      const { data: orders, error: ordersError } = await supabase
        .from('street_trading_co_orders')
        .select('id, customer_name, customer_email, total_amount, currency, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!active) return;
      const firstError = results.find(([, , countError]) => countError)?.[2] || ordersError;
      if (firstError) setError(firstError.message || 'Unable to load the admin overview.');
      setStats(Object.fromEntries(results.map(([key, value]) => [key, value])));
      setRecentOrders(orders || []);
    }

    loadOverview();
    return () => { active = false; };
  }, []);

  const cards = [
    { key: 'products', label: 'Products', icon: Package, section: 'products' },
    { key: 'orders', label: 'Orders', icon: ShoppingBag, section: 'orders' },
    { key: 'artists', label: 'Artists', icon: UserRound, section: 'artists' },
    { key: 'reviews', label: 'Reviews', icon: Star, section: 'reviews' },
    { key: 'offers', label: 'Offers', icon: Tag, section: 'offers' },
    { key: 'events', label: 'Events', icon: CalendarDays, section: 'events' },
  ];

  return (
    <div className="overview">
      <div className="dashboard-title-row">
        <div>
          <p className="dashboard-kicker">PRIVATE WORKSPACE</p>
          <h1>Good to see you.</h1>
          <p className="dashboard-lede">A single control room for the Street Trading catalogue, orders, and public content.</p>
        </div>
        <button className="dashboard-refresh" type="button" onClick={() => window.location.reload()}>
          <RefreshCcw size={14} /> REFRESH
        </button>
      </div>

      {error && <div className="dashboard-alert"><AlertCircle size={16} /> {error}</div>}

      <div className="stat-grid">
        {cards.map(({ key, label, icon: Icon, section }) => (
          <button className="stat-card" type="button" key={key} onClick={() => onOpen(section)}>
            <span className="stat-card-icon"><Icon size={17} /></span>
            <span className="stat-card-label">{label}</span>
            <strong>{stats ? stats[key] : '—'}</strong>
            <ChevronRight className="stat-card-arrow" size={14} />
          </button>
        ))}
      </div>

      <div className="overview-grid">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="dashboard-kicker">ORDERS</p>
              <h2>Recent activity</h2>
            </div>
            <button className="text-action" type="button" onClick={() => onOpen('orders')}>VIEW ALL <ChevronRight size={13} /></button>
          </div>
          {recentOrders.length ? (
            <div className="mini-table-wrap">
              <table className="data-table mini-table">
                <thead><tr><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.customer_name || 'Guest'}</strong><small>{order.customer_email}</small></td>
                      <td><StatusBadge value={order.status} /></td>
                      <td>{formatMoney(order.total_amount, order.currency, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={Clock3} title="No orders yet" text="Orders will appear here when the storefront is connected." />
          )}
        </section>

        <section className="dashboard-panel launch-panel">
          <div className="panel-heading">
            <div>
              <p className="dashboard-kicker">SITE CONTROL</p>
              <h2>Launch state</h2>
            </div>
            <span className="panel-live"><i /> ACTIVE</span>
          </div>
          <p>The public page is still in holding mode. Update the copy, logo path, or launch switch from the Site section.</p>
          <button className="dashboard-primary" type="button" onClick={() => onOpen('site')}>
            <Settings2 size={15} /> OPEN SITE SETTINGS
          </button>
          <div className="isolation-note"><Check size={14} /> Shared TattSync infrastructure, isolated Street Trading tables.</div>
        </section>
      </div>
    </div>
  );
}

function DiscountUrlPanel() {
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [productId, setProductId] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      if (!supabase) return;
      const [productResult, discountResult] = await Promise.all([
        supabase.from('street_trading_co_products').select('id, name').order('name'),
        supabase.from('street_trading_co_discount_codes').select('id, code').eq('active', true).order('code'),
      ]);
      if (!active) return;
      setProducts(productResult.data || []);
      setDiscounts(discountResult.data || []);
      setLoading(false);
    }
    loadOptions();
    return () => { active = false; };
  }, []);

  function generateUrl(event) {
    event.preventDefault();
    if (!productId || !discountCode) return;
    const url = window.location.origin + '/products?product_id=' + encodeURIComponent(productId) + '&discount_code=' + encodeURIComponent(discountCode);
    setGeneratedUrl(url);
    setCopied(false);
  }

  async function copyUrl() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="tool-panel">
      <div className="dashboard-title-row">
        <div>
          <p className="dashboard-kicker">MARKETING</p>
          <h1>Discount URL generator</h1>
          <p className="dashboard-lede">Create a product link with a discount code already attached to the query string.</p>
        </div>
      </div>
      <section className="dashboard-panel tool-card">
        <div className="panel-heading">
          <div>
            <p className="dashboard-kicker">CAMPAIGN LINK</p>
            <h2>Choose a product and code</h2>
          </div>
          <Copy size={18} className="tool-heading-icon" />
        </div>
        <form className="tool-form" onSubmit={generateUrl}>
          <label className="record-field">
            <span>PRODUCT</span>
            <select value={productId} onChange={(event) => setProductId(event.target.value)} required disabled={loading}>
              <option value="">{loading ? 'Loading products…' : 'Select a product'}</option>
              {products.map((product) => <option value={product.id} key={product.id}>{product.name}</option>)}
            </select>
          </label>
          <label className="record-field">
            <span>DISCOUNT CODE</span>
            <select value={discountCode} onChange={(event) => setDiscountCode(event.target.value)} required disabled={loading}>
              <option value="">{loading ? 'Loading codes…' : 'Select a code'}</option>
              {discounts.map((discount) => <option value={discount.code} key={discount.id}>{discount.code}</option>)}
            </select>
          </label>
          <button className="dashboard-primary" type="submit"><Copy size={14} /> GENERATE URL</button>
        </form>
        {generatedUrl && (
          <div className="generated-url">
            <code>{generatedUrl}</code>
            <div>
              <button className="dashboard-primary" type="button" onClick={copyUrl}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'COPIED' : 'COPY'}</button>
              <a className="dashboard-refresh" href={generatedUrl} target="_blank" rel="noreferrer">OPEN</a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function AnalyticsPanel() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadMetrics() {
      if (!supabase) return;
      const [products, orders, artists, reviews, offers, events] = await Promise.all([
        supabase.from('street_trading_co_products').select('id, featured'),
        supabase.from('street_trading_co_orders').select('id, status, total_amount, currency, created_at'),
        supabase.from('street_trading_co_artists').select('id, featured'),
        supabase.from('street_trading_co_reviews').select('id, rating'),
        supabase.from('street_trading_co_special_offers').select('id, active'),
        supabase.from('street_trading_co_events').select('id, active, date'),
      ]);
      if (!active) return;
      const firstError = [products, orders, artists, reviews, offers, events].find((result) => result.error)?.error;
      if (firstError) setError(firstError.message || 'Unable to load analytics.');
      const orderRows = orders.data || [];
      const completed = orderRows.filter((order) => order.status === 'completed');
      const revenuePence = completed.reduce((total, order) => total + (Number(order.total_amount) || 0), 0);
      const reviewRows = reviews.data || [];
      setMetrics({
        products: (products.data || []).length,
        featuredProducts: (products.data || []).filter((product) => product.featured).length,
        orders: orderRows.length,
        completedOrders: completed.length,
        revenue: revenuePence / 100,
        artists: (artists.data || []).length,
        featuredArtists: (artists.data || []).filter((artist) => artist.featured).length,
        reviews: reviewRows.length,
        averageRating: reviewRows.length ? reviewRows.reduce((total, review) => total + Number(review.rating || 0), 0) / reviewRows.length : 0,
        activeOffers: (offers.data || []).filter((offer) => offer.active).length,
        upcomingEvents: (events.data || []).filter((event) => event.active && new Date(event.date) >= new Date()).length,
      });
    }
    loadMetrics();
    return () => { active = false; };
  }, []);

  const cards = metrics ? [
    ['Products', metrics.products, metrics.featuredProducts + ' featured'],
    ['Orders', metrics.orders, metrics.completedOrders + ' completed'],
    ['Revenue', '£' + metrics.revenue.toFixed(2), 'completed orders'],
    ['Artists', metrics.artists, metrics.featuredArtists + ' featured'],
    ['Reviews', metrics.reviews, metrics.averageRating.toFixed(1) + ' average rating'],
    ['Marketing', metrics.activeOffers + metrics.upcomingEvents, metrics.activeOffers + ' offers · ' + metrics.upcomingEvents + ' events'],
  ] : [];

  return (
    <div className="tool-panel">
      <div className="dashboard-title-row">
        <div>
          <p className="dashboard-kicker">WORKSPACE</p>
          <h1>Analytics</h1>
          <p className="dashboard-lede">A read-only view of the isolated Street Trading catalogue and order pipeline.</p>
        </div>
        <BarChart3 size={25} className="tool-heading-icon" />
      </div>
      {error && <div className="dashboard-alert"><AlertCircle size={16} /> {error}</div>}
      <div className="analytics-grid">
        {cards.length ? cards.map(([label, value, note]) => (
          <div className="analytics-card" key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
            <span>{note}</span>
          </div>
        )) : <div className="loading-state"><RefreshCcw className="spin" size={16} /> Loading analytics…</div>}
      </div>
      <section className="dashboard-panel analytics-note">
        <div className="panel-heading">
          <div>
            <p className="dashboard-kicker">DATA BOUNDARY</p>
            <h2>Street Trading only</h2>
          </div>
          <Check size={17} />
        </div>
        <p>These figures read from <code>street_trading_co_*</code> tables only. Swordfish records and metrics are not included.</p>
      </section>
    </div>
  );
}

function CrudPanel({ section }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(Boolean(section.single));
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(() => makeInitialForm(section.fields));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ kind: '', text: '' });
  const [search, setSearch] = useState('');

  async function loadRows() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from(section.table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setMessage({ kind: 'error', text: error.message || 'Unable to load this section.' });
      setRows([]);
    } else {
      setRows(data || []);
      if (section.single && data?.[0]) {
        setEditing(data[0]);
        setForm(makeInitialForm(section.fields, data[0]));
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRows();
  }, [section.table]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(query)));
  }, [rows, search]);

  function startNew() {
    setEditing(null);
    setForm(makeInitialForm(section.fields));
    setFormOpen(true);
    setMessage({ kind: '', text: '' });
  }

  function startEdit(row) {
    setEditing(row);
    setForm(makeInitialForm(section.fields, row));
    setFormOpen(true);
    setMessage({ kind: '', text: '' });
  }

  function closeForm() {
    if (section.single) return;
    setFormOpen(false);
    setEditing(null);
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event) {
    event.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setMessage({ kind: '', text: '' });

    try {
      const payload = {};
      for (const field of section.fields) {
        if (field.readOnly) continue;
        payload[field.name] = parseFormValue(field, form[field.name]);
      }
      if (section.fixedId && !editing?.id) payload.id = section.fixedId;

      let result;
      if (editing?.id) {
        result = await supabase.from(section.table).update(payload).eq('id', editing.id);
      } else {
        result = await supabase.from(section.table).insert(payload);
      }
      if (result.error) throw result.error;

      setMessage({ kind: 'success', text: editing ? 'Changes saved.' : 'Record created.' });
      await loadRows();
      if (!section.single) setFormOpen(false);
    } catch (error) {
      setMessage({ kind: 'error', text: error.message || 'Unable to save changes.' });
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!section.allowDelete && section.allowDelete !== undefined) return;
    if (!window.confirm('Delete this record? This cannot be undone.')) return;

    const { error } = await supabase.from(section.table).delete().eq('id', row.id);
    if (error) {
      setMessage({ kind: 'error', text: error.message || 'Unable to delete this record.' });
      return;
    }
    setMessage({ kind: 'success', text: 'Record deleted.' });
    await loadRows();
  }

  const canCreate = section.allowCreate !== false;
  const canDelete = section.allowDelete !== false;
  const canEdit = section.allowEdit !== false;
  const columns = section.columns.map((name) => section.fields.find((field) => field.name === name) || { name, label: name });

  return (
    <div className="crud-panel">
      <div className="dashboard-title-row">
        <div>
          <p className="dashboard-kicker">{section.group.toUpperCase()}</p>
          <h1>{section.title}</h1>
          <p className="dashboard-lede">{section.description}</p>
        </div>
        <div className="crud-actions">
          {!section.single && <label className="search-field"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" /></label>}
          {canCreate && !section.single && (
            <button className="dashboard-primary" type="button" onClick={startNew}>
              <Plus size={15} /> NEW RECORD
            </button>
          )}
        </div>
      </div>

      {message.text && <div className={'dashboard-alert ' + message.kind}><span>{message.kind === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}</span>{message.text}</div>}

      {formOpen && (
        <section className="editor-panel">
          <div className="panel-heading">
            <div>
              <p className="dashboard-kicker">{editing ? 'EDIT RECORD' : 'NEW RECORD'}</p>
              <h2>{section.single ? section.title : (editing ? 'Edit record' : 'Create record')}</h2>
            </div>
            {!section.single && <button className="icon-button" type="button" onClick={closeForm} aria-label="Close editor"><X size={16} /></button>}
          </div>
          <form className="record-form" onSubmit={save}>
            <div className="record-fields">
              {section.fields.map((field) => (
                <AdminField key={field.name} field={field} value={form[field.name]} onChange={updateField} />
              ))}
            </div>
            <div className="record-form-footer">
              <span className="form-hint"><AlertCircle size={13} /> IDs and timestamps are managed by the database.</span>
              <button className="dashboard-primary" type="submit" disabled={saving}>
                {saving ? <><RefreshCcw className="spin" size={14} /> SAVING…</> : <><Save size={14} /> SAVE CHANGES</>}
              </button>
            </div>
          </form>
        </section>
      )}

      {!section.single && (
        <section className="dashboard-panel records-panel">
          <div className="panel-heading">
            <div>
              <p className="dashboard-kicker">RECORDS</p>
              <h2>{loading ? 'Loading…' : filteredRows.length + ' ' + (filteredRows.length === 1 ? 'record' : 'records')}</h2>
            </div>
            <button className="icon-button" type="button" onClick={loadRows} aria-label="Refresh records"><RefreshCcw size={15} /></button>
          </div>
          {loading ? (
            <div className="loading-state"><RefreshCcw className="spin" size={16} /> Loading records…</div>
          ) : filteredRows.length ? (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>{columns.map((column) => <th key={column.name}>{column.label}</th>)}<th className="actions-heading">ACTIONS</th></tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id || row.user_id || JSON.stringify(row)}>
                      {columns.map((column) => <td key={column.name}>{formatCell(row[column.name], column)}</td>)}
                      <td className="row-actions">
                        {section.key === 'orders' && <OrderQuickActions row={row} onDone={loadRows} />}
                        {canEdit && <button className="icon-button" type="button" onClick={() => startEdit(row)} aria-label="Edit record"><Pencil size={14} /></button>}
                        {canDelete && <button className="icon-button danger" type="button" onClick={() => remove(row)} aria-label="Delete record"><Trash2 size={14} /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={section.icon} title="No records yet" text={search ? 'Try a different search.' : 'Create the first record to start building this section.'} action={canCreate ? startNew : undefined} />
          )}
        </section>
      )}
    </div>
  );
}

function OrderQuickActions({ row, onDone }) {
  const [busy, setBusy] = useState('');
  const actions = [
    ['START', 'in_production', true],
    ['MADE', 'production_completed', true],
    ['SEND', 'dispatched', true],
    ['DONE', 'completed', true],
    ['ISSUE', 'problem', false],
  ];

  async function applyAction(label, status, sendEmail) {
    setBusy(label);
    const { error } = await supabase.functions.invoke('street-trading-update-order-status', {
      body: { order_id: row.id, status, send_email: sendEmail },
    });
    setBusy('');
    if (error) {
      window.alert(error.message || 'Unable to update the order.');
      return;
    }
    await onDone();
  }

  return (
    <div className="quick-order-actions">
      {actions.filter(([, status]) => status !== row.status).map(([label, status, sendEmail]) => (
        <button type="button" key={status} disabled={Boolean(busy)} onClick={() => applyAction(label, status, sendEmail)} title={'Set status to ' + status.replaceAll('_', ' ')}>
          {busy === label ? '…' : label}
        </button>
      ))}
    </div>
  );
}

function AdminField({ field, value, onChange }) {
  if (field.type === 'boolean') {
    return (
      <label className="toggle-field">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(field.name, event.target.checked)} />
        <span className="toggle-track"><span /></span>
        <span><strong>{field.label}</strong><small>Enable this setting</small></span>
      </label>
    );
  }

  if (field.type === 'image') {
    return <ImageAdminField field={field} value={value} onChange={onChange} />;
  }

  const common = {
    id: field.name,
    value: value ?? '',
    required: field.required,
    placeholder: field.placeholder,
    min: field.min,
    max: field.max,
    step: field.step,
    onChange: (event) => onChange(field.name, event.target.value),
  };

  return (
    <label className={'record-field ' + (field.type === 'textarea' || field.type === 'json' ? 'wide-field' : '')}>
      <span>{field.label}{field.required ? <i>*</i> : null}</span>
      {field.type === 'select' ? (
        <select {...common}>
          {field.options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
      ) : field.type === 'textarea' || field.type === 'json' ? (
        <textarea {...common} rows={field.rows || 4} className={field.type === 'json' ? 'json-input' : ''} />
      ) : (
        <input {...common} type={field.type === 'datetime' ? 'datetime-local' : field.type === 'number' || field.type === 'integer' ? 'number' : field.type} />
      )}
    </label>
  );
}

function ImageAdminField({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Use JPEG, PNG, WebP, or GIF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Images must be smaller than 10MB.');
      return;
    }
    if (!supabase) {
      setError('Storage is not configured.');
      return;
    }
    setUploading(true);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = 'street-trading/' + (crypto.randomUUID ? crypto.randomUUID() : Date.now()) + '.' + extension;
    const { error: uploadError } = await supabase.storage
      .from('street-trading-co-images')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) {
      setError(uploadError.message || 'Upload failed.');
    } else {
      const { data } = supabase.storage.from('street-trading-co-images').getPublicUrl(path);
      onChange(field.name, data.publicUrl);
    }
    setUploading(false);
    event.target.value = '';
  }

  return (
    <label className="record-field wide-field">
      <span>{field.label}{field.required ? <i>*</i> : null}</span>
      <div className="image-field">
        <input
          id={field.name}
          type="url"
          value={value ?? ''}
          required={field.required}
          placeholder={field.placeholder || 'https://…'}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
        <label className="upload-control">
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleUpload} disabled={uploading} />
          {uploading ? 'UPLOADING…' : 'UPLOAD'}
        </label>
      </div>
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

function EmptyState({ icon: Icon = Package, title, text, action }) {
  return (
    <div className="empty-state">
      <span><Icon size={20} /></span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action && <button className="text-action" type="button" onClick={action}>CREATE FIRST <Plus size={13} /></button>}
    </div>
  );
}

function makeInitialForm(fields, row = {}) {
  return Object.fromEntries(fields.map((field) => {
    const value = row[field.name];
    if (value !== undefined && value !== null) return [field.name, toFormValue(field, value)];
    if (typeof field.default === 'function') return [field.name, field.default()];
    if (field.type === 'boolean') return [field.name, Boolean(field.default)];
    if (field.type === 'json') return [field.name, field.default || ''];
    if (field.type === 'array') return [field.name, field.default || ''];
    return [field.name, field.default ?? ''];
  }));
}

function toFormValue(field, value) {
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'array') return Array.isArray(value) ? value.join(', ') : String(value);
  if (field.type === 'json') return typeof value === 'string' ? value : JSON.stringify(value || {}, null, 2);
  if (field.type === 'datetime') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16);
  }
  return value;
}

function parseFormValue(field, value) {
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'number') return value === '' ? null : Number(value);
  if (field.type === 'integer') return value === '' ? null : Number.parseInt(value, 10);
  if (field.type === 'array') return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (field.type === 'json') {
    if (!String(value || '').trim()) return {};
    return JSON.parse(value);
  }
  if (field.type === 'datetime') return value ? new Date(value).toISOString() : null;
  return value === '' ? null : value;
}

function formatCell(value, field) {
  if (value === null || value === undefined || value === '') return <span className="muted-cell">—</span>;
  if (field.type === 'boolean') return <span className={'boolean-cell ' + (value ? 'on' : 'off')}>{value ? 'ON' : 'OFF'}</span>;
  if (field.name === 'status' || field.name === 'stock_status') return <StatusBadge value={value} />;
  if (field.type === 'array') return Array.isArray(value) ? value.join(', ') : String(value);
  if (field.type === 'json') return <span className="json-cell">{Object.keys(value || {}).length} keys</span>;
  if (field.name === 'base_price') return formatMoney(value, 'gbp');
  if (field.name === 'total_amount') return formatMoney(value, 'gbp', true);
  if (field.name === 'created_at' || field.name === 'valid_until') return formatDate(value);
  const text = String(value);
  return text.length > 78 ? text.slice(0, 75) + '…' : text;
}

function StatusBadge({ value }) {
  const label = String(value || '').replaceAll('_', ' ');
  return <span className={'status-badge status-' + String(value || '').replaceAll('_', '-')}>{label}</span>;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMoney(value, currency = 'gbp', minorUnits = false) {
  if (value === null || value === undefined) return '—';
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  if (currency === 'gbp') return '£' + (minorUnits ? (amount / 100).toFixed(2) : amount.toFixed(2));
  return (minorUnits ? amount / 100 : amount).toFixed(2) + ' ' + String(currency).toUpperCase();
}
