import { useEffect, useState } from 'react';
import { ArrowLeft, LockKeyhole, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase.js';

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/admin') return <AdminLogin />;

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
          <h1 id="headline">Something<br /><em>good</em> is coming.</h1>
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [status, setStatus] = useState({ kind: '', message: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    async function restoreAuthorisedSession() {
      if (!supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !active) return;

      const authorised = await isAuthorisedAdmin(session.user.id);
      if (active && authorised) setSignedIn(true);
      if (active && !authorised) await supabase.auth.signOut();
    }

    restoreAuthorisedSession();
    return () => { active = false; };
  }, []);

  async function isAuthorisedAdmin(userId) {
    if (!supabase) return false;

    const { data, error } = await supabase
      .from('street_trading_co_admin_users')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return Boolean(data?.role === 'admin');
  }

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

      setSignedIn(true);
      setPassword('');
      setStatus({ kind: 'success', message: 'Signed in successfully.' });
    } catch (error) {
      setStatus({ kind: 'error', message: error.message || 'Unable to sign in. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    if (supabase) await supabase.auth.signOut();
    setSignedIn(false);
    setStatus({ kind: '', message: '' });
  }

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
          <h1 id="admin-headline">Admin<br /><em>login.</em></h1>
          <p className="intro">This area is reserved for authorised Street Trading Co. administrators.</p>

          {signedIn ? (
            <div className="admin-success">
              <p className="admin-status success">ACCESS CONFIRMED</p>
              <p>Your administrator access is active. The management workspace will appear here as it is built.</p>
              <button className="admin-submit secondary" type="button" onClick={handleSignOut}>
                <LogOut size={14} strokeWidth={1.7} /> SIGN OUT
              </button>
            </div>
          ) : (
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
              {status.message && <p className={`admin-status ${status.kind}`}>{status.message}</p>}
            </form>
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
