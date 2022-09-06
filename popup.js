// Initialize button with user's preferred color
let changeColor = document.getElementById('changeColor');
let eyedropper = document.getElementById('eyedropper');
let colorLabel = document.getElementById('color');

chrome.storage.sync.get('color', ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setPageBackgroundColor,
  });
});

eyedropper.addEventListener('click', (e) => {
  if (!window.EyeDropper) {
    eyedropper.textContent = 'Your browser does not support the EyeDropper API';
    return;
  }
  const eyeDropper = new EyeDropper();
  eyeDropper
    .open()
    .then((result) => {
      colorLabel.textContent = result.sRGBHex;
      eyedropper.style.backgroundColor = result.sRGBHex;
      chrome.action.setBadgeBackgroundColor({ color: result.sRGBHex });
      chrome.action.setBadgeText({ text: '1' });
    })
    .catch((e) => {
      colorLabel.textContent = e;
    });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get('color', ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
