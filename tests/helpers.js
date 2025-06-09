const path = require('path');
const fs = require('fs');

/**
 * Takes a screenshot and saves it to the screenshots directory
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} name - Name of the screenshot file
 */
async function takeScreenshot(page, name) {
  const screenshotsDir = path.join(__dirname, '../screenshots');
  const screenshotPath = path.join(screenshotsDir, `${name}.png`);
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot saved: ${screenshotPath}`);
}

/**
 * Saves transcription text to a JSON file
 * @param {string} text - Transcription text to save
 */
function saveTranscriptionToJson(text) {
  const transcriptionPath = path.join(__dirname, '../transcriptions.json');
  let transcriptions = [];
  
  // Read existing transcriptions if file exists
  if (fs.existsSync(transcriptionPath)) {
    const existingData = fs.readFileSync(transcriptionPath, 'utf8');
    transcriptions = JSON.parse(existingData);
  }
  
  // Add new transcription with timestamp
  transcriptions.push({
    text,
    timestamp: new Date().toISOString(),
    source: 'harvard.mp3'
  });
  
  // Write back to file
  fs.writeFileSync(transcriptionPath, JSON.stringify(transcriptions, null, 2));
}

/**
 * Gets platform-specific user agent string
 * @returns {string} User agent string
 */
function getPlatformUserAgent() {
  const platform = process.platform;
  const chromeVersion = process.env.CHROME_VERSION || '122.0.0.0';
  
  switch(platform) {
    case 'darwin':
      return `Mozilla/5.0 (Macintosh; Intel Mac OS X ${process.getSystemVersion()}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;
    case 'win32':
      return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;
    case 'linux':
      return `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;
    default:
      return `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;
  }
}

module.exports = {
  takeScreenshot,
  saveTranscriptionToJson,
  getPlatformUserAgent
}; 