const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('Voicely Extension Integration Test', () => {
  const screenshotsDir = path.join(__dirname, '../screenshots');

  test.beforeAll(async () => {
    // Ensure screenshots directory exists
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('Extension loads successfully', async ({ page }) => {
    // Navigate to test page
    await page.goto('/');
    
    // Wait for extension to load
    await page.waitForTimeout(5000);

    // Verify extension is loaded by checking for extension elements
    const extensionTargets = await page.context().pages();
    const hasExtension = extensionTargets.some(p => 
      p.url().startsWith('chrome-extension://')
    );
    
    expect(hasExtension).toBeTruthy();
  });

  test('Audio playback works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Set up audio context
    await page.evaluate(async () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const response = await fetch('/harvard.mp3');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      
      return new Promise(resolve => {
        source.onended = resolve;
      });
    });

    // Wait for audio playback to complete
    await page.waitForTimeout(5000);
  });

  test('Voice typing functionality works', async ({ page }) => {
    await page.goto('/');
    
    // Find the textarea
    const textarea = await page.locator('#prompt-textarea');
    await expect(textarea).toBeVisible();
    
    // Click the voice icon
    const voiceIcon = await page.locator('.lt-marker-container');
    await voiceIcon.click();
    
    // Wait for voice recognition to start
    await page.waitForTimeout(2000);
    
    // Simulate voice input
    await page.evaluate(() => {
      const event = new Event('speech');
      event.results = [{
        isFinal: true,
        transcript: 'Hello, this is a test'
      }];
      window.dispatchEvent(event);
    });
    
    // Verify text was entered
    const text = await textarea.inputValue();
    expect(text).toContain('Hello, this is a test');
  });

  test('Takes screenshot on failure', async ({ page }) => {
    await page.goto('/');
    
    // This test will fail and trigger a screenshot
    const nonExistentElement = await page.locator('#non-existent');
    await expect(nonExistentElement).toBeVisible({ timeout: 1000 });
  });
}); 