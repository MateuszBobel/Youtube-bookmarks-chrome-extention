import {
  getCurrentTabUrl,
  getVideoId,
  getBookmarks,
  getCurrentTabId,
} from "./utilities.js";

const playBookmark = async (time) => {
  const currentTabId = await getCurrentTabId();
  chrome.tabs.sendMessage(currentTabId, {
    name: "PLAY BOOKMARK",
    time,
  });
};

const deleteBookmark = async (time) => {
  const currentTabId = await getCurrentTabId();
  const bookmarkElement = document.getElementById(`ytb-${time}`);
  const isLastElement = bookmarkElement.parentElement.children.length === 1;
  bookmarkElement.parentNode.removeChild(bookmarkElement);
  if (isLastElement) {
    const notYoutubePageInfo = document.querySelector(".no-bookmarks-info");
    notYoutubePageInfo.classList.remove("is-hidden");
  }
  chrome.tabs.sendMessage(currentTabId, {
    name: "DELETE BOOKMARK",
    time,
  });
};

const copyBookmarkUrl = async (time) => {
  const currentTabUrl = await getCurrentTabUrl();
  const videoId = getVideoId(currentTabUrl);
  const bookmarkUrl = `https://youtu.be/${videoId}?t=${Math.floor(time)}`;
  navigator.clipboard.writeText(bookmarkUrl);
};

const creteBookmarkElement = (bookmark) => {
  const bookmarkTemplate = document.querySelector("#bookmark-template");
  const bookmarkElement = bookmarkTemplate.content.cloneNode(true);
  bookmarkElement.querySelector(".box").id = `ytb-${bookmark.time}`;
  bookmarkElement.querySelector(".bookmark-descrition").textContent =
    bookmark.description;
  bookmarkElement
    .querySelector(".play-button")
    .addEventListener("click", () => playBookmark(bookmark.time));
  bookmarkElement
    .querySelector(".delete-button")
    .addEventListener("click", () => deleteBookmark(bookmark.time));
  bookmarkElement
    .querySelector(".link-button")
    .addEventListener("click", () => copyBookmarkUrl(bookmark.time));
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
    if (!bookmarks.length) {
      const noBookmarksInfo = document.querySelector(".no-bookmarks-info");
      noBookmarksInfo.classList.remove("is-hidden");
      return;
    }
    displayBookmarks(bookmarks);
  } else {
    const notYoutubePageInfo = document.querySelector(".not-youtube-page-info");
    notYoutubePageInfo.classList.remove("is-hidden");
  }
});
