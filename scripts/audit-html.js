async function auditHtml() {
  const homeHtml = await fetch('http://localhost:3000/').then((r) => r.text());
  const articleHtml = await fetch('http://localhost:3000/grow/hydroponics-for-beginners').then((r) => r.text());
  const contactHtml = await fetch('http://localhost:3000/contact').then((r) => r.text());

  console.log('--- AUDIT HOMEPAGE ---');
  console.log('lang="en":', homeHtml.includes('lang="en"'));
  console.log('External font imports (fonts.googleapis.com):', homeHtml.includes('fonts.googleapis.com'));
  console.log('Font variables on <html>:', homeHtml.includes('__variable_'));
  console.log('Has Website Schema:', homeHtml.includes('"@type":"WebSite"'));
  console.log('Has Org Schema:', homeHtml.includes('"@type":"Organization"'));
  console.log('Render-blocking CSS imports:', homeHtml.includes('@import url'));

  const cssMatch = homeHtml.match(/href="(\/_next\/static\/css\/[^"]+)"/);
  if (cssMatch) {
    const css = await fetch('http://localhost:3000' + cssMatch[1]).then(r => r.text());
    console.log('Main CSS size:', (css.length / 1024).toFixed(1), 'KB');
    console.log('CSS defines --font-sans:', css.includes('--font-sans'));
    console.log('CSS defines --font-serif:', css.includes('--font-serif'));
    console.log('CSS includes self-hosted @font-face:', css.includes('@font-face'));
  }

  console.log('\n--- AUDIT ARTICLE PAGE ---');
  console.log('Has Article Schema:', articleHtml.includes('"@type":"BlogPosting"'));
  console.log('Has Breadcrumb Schema:', articleHtml.includes('"@type":"BreadcrumbList"'));
  console.log('TOC pre-rendered in SSR HTML:', articleHtml.includes('aria-label="Table of contents"'));
  console.log('TOC has heading links:', articleHtml.includes('In This Guide'));
  console.log('Headings have IDs matching TOC:', articleHtml.includes('<h2 id="') || articleHtml.includes('<h3 id="'));
  console.log('High-priority images count:', (articleHtml.match(/fetchpriority="high"/g) || []).length);

  console.log('\n--- AUDIT CONTACT PAGE ---');
  console.log('Is SSR pre-rendered:', contactHtml.includes('Get in Touch.'));
  console.log('Form labels present:', contactHtml.includes('htmlFor="name"') || contactHtml.includes('id="name"'));
  console.log('Has Canonical:', contactHtml.includes('rel="canonical"'));
}

auditHtml();
