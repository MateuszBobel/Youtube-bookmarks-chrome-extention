(() => {
  let youtubePlayerLeftControlPanel,
    bookmarks = [],
    youtubePlayer,
    currentVideoId = "",
    successBox;

  const getTime = (time) => {
    const date = new Date(0);
    date.setSeconds(time);
    const slicedTime = date.toISOString().slice(11, 19);
    return slicedTime;
  };

  const setBookmarksNumberOnBadge = (number) => {
    chrome.runtime.sendMessage(
      JSON.stringify({
        name: "SET BADGE NUMBER",
        bookmarksNumber: number,
      })
    );
  };

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
    const newBookmark = {
      time: youtubePlayer.currentTime,
      description: `Bookmark time: ${getTime(youtubePlayer.currentTime)}`,
    };
    const updatedBookmarks = [...bookmarks, newBookmark];
    updatedBookmarks.sort((a, b) => a.time - b.time);
    chrome.storage.sync.set({
      [currentVideoId]: JSON.stringify(updatedBookmarks),
    });
    bookmarks = updatedBookmarks;
    successBox.classList.remove("success-box-hidden");
    setTimeout(() => successBox.classList.add("success-box-hidden"), 1500);
    setBookmarksNumberOnBadge(updatedBookmarks.length);
  };

  const deleteBookmark = (currentVideoId, time) => {
    const filteredBookmarks = bookmarks.filter(
      (bookmark) => bookmark.time != time
    );
    chrome.storage.sync.set({
      [currentVideoId]: JSON.stringify(filteredBookmarks),
    });
    bookmarks = filteredBookmarks;
    setBookmarksNumberOnBadge(filteredBookmarks.length);
  };

  const playBookmark = (time) => {
    youtubePlayer.currentTime = time;
  };

  const crateNewBookmarkButton = () => {
    const button = document.createElement("button");
    button.addEventListener("click", addNewBookmark);
    button.textContent = "Bookmark";
    button.classList.add("ytp-button", "bookmark-button");
    button.style.width = "85px";
    return button;
  };

  const render = async () => {
    bookmarks = await getBookmarks();
    let newBookmarkButton = document.querySelector(".bookmark-button");
    if (newBookmarkButton) return;
    newBookmarkButton = crateNewBookmarkButton();
    youtubePlayerLeftControlPanel =
      document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName("video-stream")[0];
    youtubePlayerLeftControlPanel.appendChild(newBookmarkButton);
    successBox = document.createElement("div");
    successBox.classList.add("success-box", "success-box-hidden");
    successBox.textContent = "Bookmark added";
    document.body.appendChild(successBox);
    setBookmarksNumberOnBadge(bookmarks.length);
  };

  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      const { name, videoId, time } = request;

      switch (name) {
        case "VIDEO ID UPDATE":
          currentVideoId = videoId;
          render();
          break;
        case "DELETE BOOKMARK":
          deleteBookmark(currentVideoId, time);
          break;
        case "PLAY BOOKMARK":
          playBookmark(time);
          break;
      }
    }
  );
})();
