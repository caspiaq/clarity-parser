const fs = require('fs');

const analysisRules = {
  unsafeFunctions: ['stx-transfer?'],
  requiredFunctions: ['get-total-deposit'],
};

function readClarityCode(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error('Error reading Clarity file:', err);
    return null;
  }
}

function analyzeClarityCode(clarityCode) {
  let report = {
    isScam: false,
    issues: [],
  };

  analysisRules.unsafeFunctions.forEach((func) => {
    const regex = new RegExp(`\\b${func}\\b`, 'g');
    if (regex.test(clarityCode)) {
      report.isScam = true;
      report.issues.push(`Unsafe function detected: ${func}`);
    }
  });

  analysisRules.requiredFunctions.forEach((func) => {
    const regex = new RegExp(`\\b${func}\\b`, 'g');
    if (!regex.test(clarityCode)) {
      report.isScam = true;
      report.issues.push(`Missing required function: ${func}`);
    }
  });

  return report;
}

function checkContract(filePath) {
  const clarityCode = readClarityCode(filePath);

  if (!clarityCode) {
    console.error('Failed to load Clarity code.');
    return;
  }

  const analysisReport = analyzeClarityCode(clarityCode);

  if (analysisReport.isScam) {
    console.log('⚠️ Potentially malicious contract:');
    analysisReport.issues.forEach((issue) => console.log('- ' + issue));
  } else {
    console.log('✅ The contract seems safe.');
  }
}

checkContract('basic-program.clar');
