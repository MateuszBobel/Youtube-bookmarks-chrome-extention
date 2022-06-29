import { getCurrentTabUrl, getVideoId, getBookmarks } from "./utilities.js";

const creteBookmarkElement = (bookmark) => {
  const bookmarkTemplate = document.querySelector("#bookmark-template");
  const bookmarkElement = bookmarkTemplate.content.cloneNode(true);
  bookmarkElement.querySelector(".bookmark-descrition").textContent =
    bookmark.description;
  return bookmarkElement;
};

const displayBookmarks = (bookmarks) => {
  const bookmarksWrapper = document.querySelector(".bookmarks-wrapper");
  bookmarksWrapper.textContent = "";
  bookmarks.forEach((bookmark) => {
    const bookmarkElement = creteBookmarkElement(bookmark);
    bookmarksWrapper.appendChild(bookmarkElement);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const currentTabUrl = await getCurrentTabUrl();
  const videoId = getVideoId(currentTabUrl);
  if (videoId) {
    const bookmarks = await getBookmarks(videoId);
    displayBookmarks(bookmarks);
    const notYoutubePageInfo = document.querySelector(".not-youtube-page-info");
  } else {
    notYoutubePageInfo.classList.remove("is-hidden");
  }
});
