#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Function to remove dark mode classes from a file
function removeDarkModeClasses(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Remove dark: variants from className strings
    // This regex finds className="..." and removes dark:... classes
    content = content.replace(/className=['"`]([^'"`]*?)['"`]/g, (match, classes) => {
      const cleanClasses = classes
        .split(/\s+/)
        .filter(cls => !cls.startsWith('dark:'))
        .join(' ')
        .trim();
      return `className='${cleanClasses}'`;
    });

    // Remove dark: variants from template literals
    content = content.replace(/className=\{[^}]*?\}/g, (match) => {
      return match.replace(/dark:[a-zA-Z0-9-]+\/?\d*\s*/g, '');
    });

    // Remove dark: variants from template literals with backticks
    content = content.replace(/className=\{`([^`]*?)`\}/g, (match, classes) => {
      const cleanClasses = classes.replace(/dark:[a-zA-Z0-9-]+\/?\d*\s*/g, '');
      return `className={\`${cleanClasses}\`}`;
    });

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all React component files
const patterns = [
  'src/**/*.jsx',
  'src/**/*.js',
  'src/**/*.tsx',
  'src/**/*.ts'
];

let totalUpdated = 0;

patterns.forEach(pattern => {
  const files = glob.sync(pattern, { cwd: process.cwd() });
  
  files.forEach(file => {
    const fullPath = path.resolve(file);
    if (removeDarkModeClasses(fullPath)) {
      totalUpdated++;
    }
  });
});

console.log(`\n🎉 Dark mode removal complete!`);
console.log(`📊 Total files updated: ${totalUpdated}`);
console.log(`\n✨ Your website is now light mode only!`);
