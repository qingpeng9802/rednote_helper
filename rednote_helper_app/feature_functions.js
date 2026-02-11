'use strict';

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @param {number} ms
 * @returns {Promise<unknown>}
 */
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject('Operation timed out'), ms)
  );
}

/**
 * @param {() => Promise<any>} func
 * @param {number} ms
 * @returns {Promise<boolean>}
 */
async function runFuncWithTimeout(func, ms) {
  try {
    await Promise.race([
      func(),
      timeout(ms)
    ]);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {HTMLElement} parent
 */
async function showAllSubs(parent, clickTimes = 10) {
  for (let count = 0; count < clickTimes; ++count) {
    const showMoreButton = parent.querySelector('.show-more');
    if (showMoreButton === null) {
      // double check to make sure remove show-all
      const showAllNodes = parent.querySelectorAll('.show-all');
      for (const node of showAllNodes) {
        node.remove();
      }
      break;
    }

    /** @type {HTMLElement} */(showMoreButton).click();

    const incTime = count * 58;
    const minTime = Math.min(315 + incTime, 1500);
    const maxTime = Math.min(390 + incTime, 2000);
    const randomTime = getRandomInt(minTime, maxTime);
    await sleep(randomTime);
  }
}

/**
 * @param {HTMLElement} parent
 * @returns {HTMLButtonElement}
 */
function getShowAllButton(parent, buttonText = '查看所有', clickTimes = 10) {
  const oneClickNode = document.createElement('button');
  oneClickNode.textContent = buttonText;
  oneClickNode.classList.add('show-all');

  oneClickNode.addEventListener('click',
    async () => await runFuncWithTimeout(
      async () => await showAllSubs(parent, clickTimes), 10000)
  );
  return oneClickNode;
}

/**
 * @param {HTMLElement} rangeNode
 * @param {string} buttonText
 * @param {number} clickTimes
 */
function handleShowAll(rangeNode, buttonText, clickTimes) {
  // if the `show-all` button was not added or possibly removed by the website,
  // the `show-all` button could be empty

  // find in `.reply-container`
  const replyCont = /** @type {HTMLElement} */(rangeNode.parentElement);
  const showMoreNode = replyCont.querySelector('.show-more');
  const showAllNodes = replyCont.querySelectorAll('.show-all');

  if (showMoreNode !== null) {
    /** @type {HTMLElement} */
    (showMoreNode).style.display = 'inline-block';
    // if the element does not exist
    if (showAllNodes.length === 0) {
      replyCont.append(getShowAllButton(replyCont, buttonText, clickTimes));
    }
  } else {
    for (const node of showAllNodes) {
      node.remove();
    }
  }
}

/**
 * @param {HTMLElement} rangeNode
 * @param {string} buttonText
 * @param {number} clickTimes
 */
function initShowAll(rangeNode, buttonText, clickTimes) {
  const showMoreNodes = rangeNode.querySelectorAll('.show-more');

  for (const node of showMoreNodes) {
    const replyCont = /** @type {HTMLElement} */ (node.parentElement);
    if (replyCont.querySelector('.show-all') !== null) {
      continue;
    }

    /** @type {HTMLElement} */
    (node).style.display = 'inline-block';

    // no .after to avoid show-more unstable
    replyCont.append(getShowAllButton(replyCont, buttonText, clickTimes));
  }
}

/**
 * @param {Element} cont
 * @returns {HTMLElement}
 */
function findCommentTarget(cont) {
  const isSub = cont.classList.contains('comment-item-sub');
  const targetCont = isSub ?
    // if this comment is sub, just assign
    cont :
    // if this comment is NOT sub, find closest '.parent-comment'
    cont.closest('.parent-comment');
  return /** @type {HTMLElement} */ (targetCont);
}

/**
 * @param {HTMLElement} rangeNode
 * @param {RegExp} regex
 * @param {Set<string>} regexTested
 */
function regexFilterForComments(rangeNode, regex, regexTested) {
  const allCommentConts = rangeNode.querySelectorAll('.comment-item');
  const seenConts = regexTested;
  for (const cont of allCommentConts) {
    const id = cont.id;
    if (!seenConts.has(id)) {
      const text = cont.querySelectorAll('.note-text')[0].textContent ?? '';
      const matchResult = regex.test(text);
      if (matchResult) {
        const targetCont = findCommentTarget(cont);
        //console.log('[regex] ', text);
        targetCont.style.display = 'none';
      }

      seenConts.add(id);
    }
  }

}

/**
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function isEmptyTextForNode(node) {
  const texts = node.querySelectorAll('span');
  const trimmedTexts = Array.from(texts).map(t => t.textContent?.trim() || '');
  const isEmptyText = trimmedTexts.every(str => str === '');

  const noEmoji = node.querySelector('img') === null;
  return isEmptyText && noEmoji;
}

/**
 * @param {HTMLElement} rangeNode
 * @param {boolean} hideNoTextOnly
 * @param {Map<HTMLElement, Map<string, string>> | undefined} atRecord 
 * {main-comment-whole-container : {to-user-ame: from-user-name}}
 */
function deleteAtUserComment(rangeNode, hideNoTextOnly, atRecord) {
  // get all at-user comment text nodes
  const allAtUserNodes = rangeNode.querySelectorAll('.note-content-user');
  for (const node of allAtUserNodes) {
    // find the comment container which includes an at-user
    const atUserCommentCont =
      /** @type {HTMLElement} */ (node.closest('.comment-item'));

    const targetCont = findCommentTarget(atUserCommentCont);

    // hide the target container
    //console.log('[username-at] ', node.textContent);

    if (
      !hideNoTextOnly ||
      isEmptyTextForNode(/** @type {HTMLElement} */(node.parentElement))
    ) {
      targetCont.style.display = 'none';
    }

    if (atRecord !== undefined) {
      // prepare for atUser's reply
      const fromUserName = targetCont.querySelector('.author')?.textContent ?? '';
      const toUserName = /** @type {string} */ (node.textContent).slice(1);

      const parentContainer =
        /** @type {HTMLElement} */ (atUserCommentCont.parentElement);
      if (!atRecord.has(parentContainer)) {
        atRecord.set(parentContainer, new Map())
      }

      const possibleAtUserMap = atRecord.get(parentContainer);
      if (possibleAtUserMap && !possibleAtUserMap.has(toUserName)) {
        possibleAtUserMap.set(toUserName, fromUserName)
      }
    }

  }
  //console.log(checkAtReplyCont);
}

/**
 * @param {Map<HTMLElement, Map<string, string>>} checkAtReplyCont
 * {main-comment-whole-container : {to-user-ame: from-user-name}}
 */
function deleteAtUserReply(checkAtReplyCont) {
  for (const [AtReplyCont, atUserMap] of checkAtReplyCont.entries()) {
    const allFromUsers = AtReplyCont.querySelectorAll('.nickname');
    for (const fromUser of allFromUsers) {
      const reUserCont =
        /** @type {HTMLElement} */ (fromUser.closest('.comment-item-sub'));
      const toUserName =
        reUserCont.querySelector('.author')?.textContent ?? '';
      const recordfromUserName = atUserMap.get(toUserName);

      const isFollowingReply = (
        recordfromUserName !== undefined &&
        recordfromUserName === fromUser.textContent
        // reUser is after the record node, not always
        //(reUserCont.compareDocumentPosition(possibleMatchRecord.locationCont) &
        //  Node.DOCUMENT_POSITION_PRECEDING)
      )
      if (isFollowingReply) {
        //console.log('[username-re] ', reUser.textContent);
        reUserCont.style.display = 'none';
      }

    }
  }

}
