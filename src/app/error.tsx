"use client";

import Link from "next/link";
import { useEffect } from "react";

// Something threw while a page was being drawn. The rest of the site is fine, so say so and offer a way on.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="sub">
      <section className="lost2" aria-labelledby="err-title">
        <div className="lost2-grid" aria-hidden="true" />
        <div className="wrap lost2-body">
          <p className="lost2-code" aria-hidden="true">5<span>0</span>0</p>
          <h1 id="err-title">That page broke.</h1>
          <p className="sub-lead">Something went wrong while this page was loading. The rest of the site is fine. Try again, or go somewhere else.</p>
          {error.digest ? <p className="lost2-asked"><span>Reference</span><code>{error.digest}</code></p> : null}
          <div className="acts">
            <button type="button" className="btn" onClick={reset}>Try again</button>
            <Link className="link" href="/">Front page</Link>
            <Link className="link" href="/#contact">Tell me about it</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
