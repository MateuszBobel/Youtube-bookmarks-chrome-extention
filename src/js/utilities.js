export const getVideoId = (url) => {
  const youtubeRegExp =
    /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/;
  const match = youtubeRegExp.exec(url);
  if (match) {
    const videoId = match[1];
    return videoId;
  }
};

export const getCurrentTabUrl = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
};

export const getCurrentTabId = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.id;
};

export const getBookmarks = (currentVideoId) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([currentVideoId], (result) => {
      const bookmarks = result[currentVideoId]
        ? JSON.parse(result[currentVideoId])
        : [];
      resolve(bookmarks);
    });
  });
};
