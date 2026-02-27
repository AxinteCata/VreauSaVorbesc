/**
 * Credits & Licenses – app license, third-party libs, symbol placeholders, user content disclaimer. Romanian.
 */

import { t } from '@/i18n';

interface CreditsProps {
  onBack: () => void;
}

const MIT_FULL = `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;

const THIRD_PARTY = [
  { name: 'React', license: 'MIT', url: 'https://github.com/facebook/react' },
  { name: 'Vite', license: 'MIT', url: 'https://github.com/vitejs/vite' },
  { name: 'Zustand', license: 'MIT', url: 'https://github.com/pmndrs/zustand' },
  { name: 'idb', license: 'ISC', url: 'https://github.com/jakearchibald/idb' },
  { name: 'Tailwind CSS', license: 'MIT', url: 'https://github.com/tailwindlabs/tailwindcss' },
  { name: 'vite-plugin-pwa', license: 'MIT', url: 'https://github.com/vite-pwa/vite-plugin-pwa' }
];

export function Credits({ onBack }: CreditsProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] text-aac-primary font-medium underline focus:outline-none focus-visible:ring-2 focus-visible:ring-aac-primary rounded-button"
        >
          ← {t('credits.back')}
        </button>
        <h1 className="text-2xl font-bold text-aac-primary">{t('credits.title')}</h1>
      </div>

      <section className="mb-8" aria-labelledby="app-license-heading">
        <h2 id="app-license-heading" className="text-lg font-semibold text-aac-primary mb-2">
          {t('credits.appHeading')}
        </h2>
        <p className="text-aac-muted mb-2">
          {t('credits.appDesc')}
        </p>
        <p className="mb-2">
          {t('credits.appLicense')}
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer text-aac-primary font-medium">{t('credits.mitSummary')}</summary>
          <pre className="mt-2 p-4 bg-aac-surface rounded-lg text-sm whitespace-pre-wrap font-sans">
            {MIT_FULL}
          </pre>
        </details>
      </section>

      <section className="mb-8" aria-labelledby="third-party-heading">
        <h2 id="third-party-heading" className="text-lg font-semibold text-aac-primary mb-2">
          {t('credits.thirdParty')}
        </h2>
        <ul className="list-none space-y-2">
          {THIRD_PARTY.map((lib) => (
            <li key={lib.name} className="flex flex-wrap items-baseline gap-2">
              <span className="font-medium">{lib.name}</span>
              <span className="text-aac-muted">– {lib.license}</span>
              {lib.url && (
                <a
                  href={lib.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aac-primary underline text-sm"
                >
                  {t('credits.source')}
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8" aria-labelledby="symbol-sources-heading">
        <h2 id="symbol-sources-heading" className="text-lg font-semibold text-aac-primary mb-2">
          {t('credits.symbolsHeading')}
        </h2>
        <p className="text-aac-muted mb-3">
          {t('credits.symbolsDesc')}
        </p>
        <div className="p-4 bg-aac-surface rounded-card border-2 border-aac-border">
          <p className="text-sm font-medium text-aac-muted mb-2">{t('credits.symbolsPlaceholder')}</p>
        </div>
      </section>

      <section className="mb-8" aria-labelledby="user-content-heading">
        <h2 id="user-content-heading" className="text-lg font-semibold text-aac-primary mb-2">
          {t('credits.userImagesHeading')}
        </h2>
        <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-card">
          <p className="text-sm font-medium text-amber-900 mb-1">{t('credits.userImagesDisclaimer')}</p>
          <p className="text-sm text-amber-800">
            {t('credits.userImagesBody')}
          </p>
        </div>
      </section>

      <section aria-labelledby="privacy-heading">
        <h2 id="privacy-heading" className="text-lg font-semibold text-aac-primary mb-2">
          {t('credits.privacyHeading')}
        </h2>
        <p className="text-aac-muted">
          {t('credits.privacyBody')}
        </p>
      </section>
    </div>
  );
}
