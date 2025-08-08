# Word Swapper Chrome Extension

A simple Chrome extension that allows you to replace words on any web page with your chosen words.

## Features

- Replace any word or phrase on a web page
- Case-insensitive matching
- Reset the page to its original state
- Saves your last used words for convenience
- Clean and simple user interface

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right corner)
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and ready to use

## How to Use

1. Click on the extension icon in your Chrome toolbar
2. Enter the word you want to replace in the first input field
3. Enter the replacement word in the second input field
4. Click "Replace" to replace all instances of the word on the current page
5. Click "Reset" to restore the page to its original state

## Permissions

This extension requires the following permissions:
- `activeTab`: To access and modify the content of the current tab
- `storage`: To save your preferred words between sessions

## Notes

- The extension works on most websites, but some dynamic content may not be replaced
- The replacement is case-insensitive but preserves the original capitalization
- The extension only affects the text content of the page, not form inputs or other interactive elements
