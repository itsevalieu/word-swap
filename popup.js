document.addEventListener('DOMContentLoaded', function() {
  const replaceButton = document.getElementById('replaceButton');
  const resetButton = document.getElementById('resetButton');
  const targetWordInput = document.getElementById('targetWord');
  const replacementWordInput = document.getElementById('replacementWord');
  const statusDiv = document.getElementById('status');

  // Load saved words
  chrome.storage.sync.get(['targetWord', 'replacementWord'], function(data) {
    if (data.targetWord) targetWordInput.value = data.targetWord;
    if (data.replacementWord) replacementWordInput.value = data.replacementWord;
  });

  // Replace button click handler
  replaceButton.addEventListener('click', function() {
    const targetWord = targetWordInput.value.trim();
    const replacementWord = replacementWordInput.value.trim();

    if (!targetWord) {
      showStatus('Please enter a word to replace', 'error');
      return;
    }

    // Save words for future use
    chrome.storage.sync.set({
      targetWord: targetWord,
      replacementWord: replacementWord
    });

    // Send message to content script to replace text
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'replace',
        target: targetWord,
        replacement: replacementWord
      }, function(response) {
        if (chrome.runtime.lastError) {
          showStatus('Error: ' + chrome.runtime.lastError.message, 'error');
        } else if (response && response.success) {
          const count = response.count || 0;
          showStatus(`Replaced ${count} instance${count !== 1 ? 's' : ''} of "${targetWord}" with "${replacementWord}"`, 'success');
        } else {
          showStatus('No text was replaced', 'info');
        }
      });
    });
  });

  // Reset button click handler
  resetButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'reset'
      }, function(response) {
        if (chrome.runtime.lastError) {
          showStatus('Error: ' + chrome.runtime.lastError.message, 'error');
        } else {
          showStatus('Page reset to original state', 'success');
          targetWordInput.value = '';
          replacementWordInput.value = '';
          chrome.storage.sync.remove(['targetWord', 'replacementWord']);
        }
      });
    });
  });

  function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
    
    // Hide status after 3 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
});
