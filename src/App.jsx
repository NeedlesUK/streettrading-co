import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from './lib/supabase.js';

export default function App() {
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
        <span className="status"><i /> WEBSITE IN THE WORKS</span>
      </header>

      <section className="hero" aria-labelledby="headline">
        <div className="logo-frame">
          <img src={logoPath} alt="Street Trading Co. skull and gothic lettering logo" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow"><span>01</span> A NEW CHAPTER</p>
          <h1 id="headline">Something<br /><em>good</em> is coming.</h1>
          <p className="intro">Street Trading Co. is getting a new home online.<br className="desktop-break" /> Check back soon to see what we’re building.</p>
          <a className="domain-link" href="https://streettrading.co.uk">STREETTRADING.CO.UK <ArrowUpRight size={16} strokeWidth={1.7} /></a>
        </div>
      </section>

      <footer className="footer">
        <span>INDEPENDENT SPIRIT. STREET LEVEL.</span>
        <span>© {new Date().getFullYear()} {companyName.toUpperCase()}</span>
      </footer>
    </main>
  );
}
