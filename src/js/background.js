chrome.tabs.onUpdated.addListener((tabId, tab) => {
  const url = tab.url;
  const youtubeRegExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((?:\w|-){11})(?:&list=(\S+))?$/;

  if (url && url.match(youtubeRegExp)) {
    const videoId = youtubeRegExp.exec(url)[1];

    chrome.tabs.sendMessage(tabId, {
      name: "VIDEO ID UPDATE",
      videoId,
    });
  }
});
