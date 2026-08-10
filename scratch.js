const payload = { "queries": [{"package": {"name": "@angular/common", "ecosystem": "npm"}, "version": "20.1.0"}] };
fetch('https://api.osv.dev/v1/querybatch', { method: 'POST', body: JSON.stringify(payload) })
  .then(r => r.json())
  .then(async data => {
    const vulns = data.results[0].vulns;
    const detail = await fetch(`https://api.osv.dev/v1/vulns/${vulns[0].id}`).then(r => r.json());
    console.log(Object.keys(detail));
    console.log(detail.summary);
  });
