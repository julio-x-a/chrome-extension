const d = document;
const title = d.getElementById('title');
const btn = d.getElementById('btn');

btn.addEventListener('click', async (e) => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(tab);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getSelection,
  });
});

function getSelection() {
  d.addEventListener('select', (e) => {
    console.log(e.target.value);
    const selection = e.target.value.substring(
      e.target.selectionStart,
      e.target.selectionEnd
    );
    title.textContent = `You selected: ${selection}`;
  });
}
