(() => {
  let youtubePlayerLeftControlPanel, youtubePlayer, curretVideoId;

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
        curretVideoId = videoId;
        render();
        break;
    }
    render();
  });
})();
