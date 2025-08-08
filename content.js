let originalHTML = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'replace') {
    replaceText(request.target, request.replacement, sendResponse);
    return true;
  } else if (request.action === 'reset') {
    resetPage(sendResponse);
    return true;
  }
});

function replaceText(target, replacement, callback) {
  if (originalHTML === null) {
    originalHTML = document.documentElement.innerHTML;
  }

  const regex = new RegExp(escapeRegExp(target), 'gi');
  let count = 0;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const nodes = [];
  let node;

  while (node = walker.nextNode()) {
    if (node.nodeValue.trim() !== '') {
      nodes.push(node);
    }
  }

  nodes.forEach(node => {
    const parent = node.parentNode;
    if (parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE' && parent.tagName !== 'TEXTAREA') {
      const newText = node.nodeValue.replace(regex, function(match) {
        count++;
        return replacement || '';
      });
      
      if (node.nodeValue !== newText) {
        node.nodeValue = newText;
      }
    }
  });

  callback({ success: true, count: count });
}

function resetPage(callback) {
  if (originalHTML !== null) {
    document.documentElement.innerHTML = originalHTML;
    originalHTML = null;
    callback({ success: true });
  } else {
    callback({ success: false, message: 'No changes to reset' });
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
