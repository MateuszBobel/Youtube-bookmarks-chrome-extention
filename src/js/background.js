chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = tab.url;
  const youtubeRegExp =
    /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/;

  if (changeInfo.status === "complete" && url) {
    if (url.match(youtubeRegExp)) {
      const videoId = youtubeRegExp.exec(url)[1];
      chrome.tabs.sendMessage(tabId, {
        name: "VIDEO ID UPDATE",
        videoId,
      });
    }
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { name, bookmarksNumber } = JSON.parse(request);
  if (name === "SET BADGE NUMBER") {
    let queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    chrome.action.setBadgeBackgroundColor({ color: "#000" });
    chrome.action.setBadgeText({
      tabId: tab.id,
      text: bookmarksNumber.toString(),
    });
    sendResponse();
  }
});
