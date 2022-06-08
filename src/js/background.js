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
