chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "transferData") {
    console.log("Odebrano dane z content script:", message.dataArray);
  }
});
