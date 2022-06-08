(() => {
  let youtubePlayerLeftControlPanel, youtubePlayer, currentVideoId;

  const getBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideoId], (result) => {
        const bookmarks = result[currentVideoId]
          ? JSON.parse(result[currentVideoId])
          : [];
        resolve(bookmarks);
      });
    });
  };

  const addNewBookmark = async () => {
    const bookmarks = await getBookmarks();
    const newBookmark = {
      time: youtubePlayer.currentTime,
      description: `Bookmark time: ${youtubePlayer.currentTime}`,
    };
    const updatedBookmarks = [...bookmarks, newBookmark];
    updatedBookmarks.sort((a, b) => a.time - b.time);
    chrome.storage.sync.set({
      [currentVideoId]: JSON.stringify(updatedBookmarks),
    });
  };

  const crateNewBookmarkButton = () => {
    const button = document.createElement("button");
    button.addEventListener("click", addNewBookmark);
    button.textContent = "Bookmark";
    button.classList.add("ytp-button", "bookmark-button");
    button.style.width = "100%";
    return button;
  };

  const render = () => {
    youtubePlayerLeftControlPanel =
      document.querySelector(".ytp-left-controls");
    youtubePlayer = document.querySelector(".video-stream");
    let newBookmarkButton = document.querySelector(".bookmark-button");
    if (newBookmarkButton) return;
    newBookmarkButton = crateNewBookmarkButton();
    youtubePlayerLeftControlPanel.appendChild(newBookmarkButton);
  };

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { name, videoId } = request;

    switch (name) {
      case "VIDEO ID UPDATE":
        currentVideoId = videoId;
        render();
        break;
    }
    render();
  });
})();
