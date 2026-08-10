export function exportToJson(vulnerabilities, totalScanned) {
  const report = {
    generatedAt: new Date().toISOString(),
    totalScanned,
    vulnerabilitiesCount: vulnerabilities.length,
    vulnerabilities: vulnerabilities
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `npm-verify-report-${new Date().getTime()}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
