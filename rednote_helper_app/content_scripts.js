'use strict';

/**
 * @param {MutationCallback} callback
 * @returns {MutationObserver}
 */
function debouncedObserver(callback) {
  const debounced = debounce(callback, 250);
  return new MutationObserver(debounced);
}

/**
 * @param {MutationObserver} observer
 */
function observeShowMore(observer) {
  const showMoreNodes = document.querySelectorAll('.show-more');
  for (const node of showMoreNodes) {
    // .list-container with .show-more
    const listCont = node.parentElement?.querySelector('.list-container');
    observer.observe(
      /** @type {Element} */
      (listCont), {
      childList: true
    });
  }
}

/**
 * @type {Set<string>}
 */
const regexTested = new Set();

/**
 * @param {HTMLElement | undefined} [rangeNode=undefined]
 */
function rawOps(rangeNode = undefined) {
  //const s = performance.now();

  const hasRangeNode = rangeNode !== undefined;
  const defaultNode =
    /** @type {HTMLElement | null} */ (document.querySelector('.list-container'));

  const opRange = hasRangeNode ? rangeNode : defaultNode;
  if (opRange === null) {
    // guard to prevent page inconsistency caused by debounce
    return;
  }

  const settingsSnapshot = /** @type {const} */ ({ ...cachedSettings });
  if (settingsSnapshot.hideAt) {
    /** @type {Map<HTMLElement, Map<string, string>> | undefined} */
    const atRecord = settingsSnapshot.hideAtReply ? new Map() : undefined;
    deleteAtUserComment(opRange, settingsSnapshot.hideNoTextOnly, atRecord);

    if (settingsSnapshot.hideAtReply && atRecord !== undefined) {
      deleteAtUserReply(atRecord);
    }
  }

  if (settingsSnapshot.enableRegex) {
    const regex = settingsSnapshot.regexObj;
    if (regex !== undefined) {
      regexFilterForComments(opRange, regex, regexTested);
    }
  }

  if (settingsSnapshot.showAll) {
    const buttonText = settingsSnapshot.buttonText;
    const clickTimes = settingsSnapshot.clickTimesNum;
    if (hasRangeNode) {
      handleShowAll(opRange, buttonText, clickTimes);
    } else {
      initShowAll(opRange, buttonText, clickTimes);
    }
  }

  //console.log('[time] ', performance.now() - s, ' ms');
}

/**
 * @param {HTMLElement | undefined} [rangeNode=undefined]
 */
function ops(rangeNode) {
  const isDebug = false;

  if (!isDebug) {
    return rawOps(rangeNode);
  }

  try {
    return rawOps(rangeNode);
  } catch (e) {
    console.log(/** @type {Error} */(e).message);
    console.log(/** @type {Error} */(e).stack);
  }
}

function injectedScript() {
  // first run
  ops();

  const observerSM = debouncedObserver(mutations => {
    const rangeNode = /** @type {HTMLElement} */ (mutations[0].target);
    ops(rangeNode);

  });
  observeShowMore(observerSM);

  const observerPC = debouncedObserver(() => {
    // load all things again
    ops();

    observerSM.disconnect();
    observeShowMore(observerSM);
  });
  // .list-container of all parent comments
  const parentCommentContainer = document.querySelector('.list-container');
  observerPC.observe(
    /** @type {Element} */
    (parentCommentContainer), {
    childList: true
  });

};

function recoverAll() {
  const eles = document.querySelectorAll(
    '.comment-item-sub[style="display: none;"], ' +
    '.parent-comment[style="display: none;"], ' +
    '.show-more[style="display: inline-block;"]'
  );

  for (const ele of eles) {
    /** @type {HTMLElement} */
    (ele).style.removeProperty('display');
  }

  const buttons = document.querySelectorAll('.show-all');
  for (const b of buttons) {
    b.remove();
  }
}

/**
 * @template {any[]} Args
 * @param {(...args: Args) => any} func
 * @param {number} delay
 * @returns {(...args: Args) => void}
 */
function debounce(func, delay) {
  /** @type {number | undefined} */
  let timeoutID = undefined;
  return (...args) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => func(...args), delay);
  };
}

/**
 * @template {any[]} Args
 * @template T
 * @param {(...args: Args) => Promise<T>} func
 * @param {number} delay
 * @returns {(...args: Args) => Promise<T>}
 */
function asyncDebounce(func, delay) {
  /** @type {number | undefined} */
  let timeoutID = undefined;
  /** @type {{resolve: (value: T) => void, reject: (reason?: any) => void}[]} */
  let pending = [];

  return (...args) => {
    clearTimeout(timeoutID);

    return new Promise((resolve, reject) => {
      pending.push({ resolve, reject });

      timeoutID = setTimeout(async () => {
        try {
          const res = await func(...args);
          pending.forEach(p => p.resolve(res));
        } catch (err) {
          pending.forEach(p => p.reject(err));
        } finally {
          pending = [];
        }
      }, delay);

    });

  };
}

/**
 * @param {() => boolean} cond
 * @param {number} [retryInterval=10]
 * @param {number} [retryTimes=10]
 * @returns {Promise<boolean>}
 */
async function waitUntilMeet(cond, retryInterval = 10, retryTimes = 10) {
  for (let i = 0; i < retryTimes; ++i) {
    if (cond()) {
      return true;
    }
    await sleep(retryInterval);
  }
  return false;
}

/**
 * @returns {boolean}
 */
function isCommentReady() {
  const hasComment = document.querySelector('.note-text') !== null;
  const hasTotal = document.querySelector('.total') !== null;
  return hasComment && hasTotal;
}

function addMODetectingFeedAndNote() {
  const titleNode = document.querySelector('title');

  const debounced = asyncDebounce(async () => await injectWhenReady(), 250);
  const observer = new MutationObserver(debounced);
  observer.observe(
    /** @type {HTMLTitleElement}*/
    (titleNode), {
    childList: true
  });
}

async function injectWhenReady() {
  if (await waitUntilMeet(isCommentReady)) {
    regexTested.clear();
    injectedScript();
  }
}

async function onChangedFunc() {
  if (await waitUntilMeet(isCommentReady)) {
    recoverAll();

    regexTested.clear();
    ops();
  }
}

(async () => {
  await initSettings(onChangedFunc);

  await injectWhenReady();
  addMODetectingFeedAndNote();
})();
