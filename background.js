chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "transferData") {
    console.log("Odebrano dane z content script:", message.dataArray);
    let dataArray = message.dataArray;
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      if (tabs.length >= 2) {
        var targetTab = tabs.find((tab) => tab.url.includes("eu.iot.tuya.com"));
        chrome.scripting.executeScript({
          target: { tabId: targetTab.id },
          func: function (dataArray) {
            // Sprawdź, czy element został znaleziony
            if (textArea) {
              // // Eksperyment
              // Pobierz element textarea
              var textarea = document.getElementById("colour_data");

              // Ustaw nową wartość dla textarea
              textarea.value = `{"h": 158, "s": 470, "v": ${
                Math.round(dataArray) * 10
              }}`;

              // Symuluj zdarzenie zmiany wartości pola tekstowego
              var event = new Event("input", { bubbles: true });
              textarea.dispatchEvent(event);
              const button = document.querySelector(".ant-btn.ant-btn-primary");

              // Sprawdź, czy przycisk został znaleziony
              if (button) {
                // Kliknij przycisk
                button.click();
              }
              // // Eksperyment
            } else {
              console.log(
                "Nie znaleziono elementu textarea o identyfikatorze 'colour_data'"
              );
            }
          },
          args: [dataArray],
        });
      } else {
        console.log("Nie znaleziono drugiej karty w bieżącym oknie.");
      }
    });
  }
});
