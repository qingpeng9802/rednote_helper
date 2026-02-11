'use strict';

const boxHideAtNode = /** @type {HTMLInputElement} */ (document.querySelector('#hideAt'));
const boxHideAtReply = /** @type {HTMLInputElement} */ (document.querySelector('#hideAtReply'));
const boxHideNoTextOnly = /** @type {HTMLInputElement} */ (document.querySelector('#hideNoTextOnly'));

const boxShowAll = /** @type {HTMLInputElement} */ (document.querySelector('#showAll'));
const buttonTextInput = /** @type {HTMLInputElement} */ (document.querySelector('#buttonText'));
const clickTimesInput = /** @type {HTMLInputElement} */ (document.querySelector('#clickTimes'));

const boxEnableRegex = /** @type {HTMLInputElement} */ (document.querySelector('#enableRegex'));
const regexInput = /** @type {HTMLTextAreaElement} */ (document.querySelector('#regex'));

const submitButton = /** @type {HTMLButtonElement} */ (document.querySelector('#submit'));
const successfulMsg = /** @type {HTMLElement} */ (document.querySelector('#successful'));
const failedMsg = /** @type {HTMLElement} */ (document.querySelector('#failed'));

const selectCN = /** @type {HTMLInputElement} */ (document.querySelector('#selectCN'));
const selectEN = /** @type {HTMLInputElement} */ (document.querySelector('#selectEN'));
const selectLang = /** @type {HTMLElement} */ (document.querySelector('#selectLang'));

const langcns = document.querySelectorAll('.lang-cn');
const langens = document.querySelectorAll('.lang-en');

/** 
  * @type {Readonly<Map<string, Readonly<
  *   {access: 'checked', ele: HTMLInputElement} | 
  *   {access: 'value', ele: HTMLInputElement | HTMLTextAreaElement}>
  * >>} 
  */
const SETTINGS = new Map([
  ['selectCN', { access: 'checked', ele: selectCN }], // only in popup
  ['selectEN', { access: 'checked', ele: selectEN }], // only in popup
  ['hideAt', { access: 'checked', ele: boxHideAtNode }],
  ['hideAtReply', { access: 'checked', ele: boxHideAtReply }],
  ['hideNoTextOnly', { access: 'checked', ele: boxHideNoTextOnly }],
  ['showAll', { access: 'checked', ele: boxShowAll }],
  ['buttonText', { access: 'value', ele: buttonTextInput }],
  ['clickTimes', { access: 'value', ele: clickTimesInput }],
  ['enableRegex', { access: 'checked', ele: boxEnableRegex }],
  ['regex', { access: 'value', ele: regexInput }],
]);

/**
 * @param {string} eleId
 * @param {boolean | string | undefined} [setValue=undefined]
 * @returns {boolean | string}
 * @throws {Error}
 */
function accessBy(eleId, setValue = undefined) {
  const info = SETTINGS.get(eleId);
  if (info === undefined) {
    throw new Error(`[Error] no setting for domId: ${eleId}`);
  } else if (!(info.access in info.ele)) {
    throw new Error(`[Error] ${info.access} not in ${eleId}`);
  }

  const ele = /** @type {Record<'checked' | 'value', boolean | string>} */ (info.ele);
  const oldValue = ele[info.access];
  // reduce dom change
  if (setValue !== undefined && setValue !== oldValue) {
    ele[info.access] = setValue;
    return setValue;
  } else {
    return oldValue;
  }
}

/**
 * @param {string} regexStr
 * @returns {RegExp | undefined}
 */
function regexStrToRegExp(regexStr) {
  if (
    regexStr.length < 2 ||
    regexStr[0] !== '/' ||
    regexStr.lastIndexOf('/') === 0) {
    return undefined;
  }

  const partIndex = regexStr.lastIndexOf('/');
  const flagpart = regexStr.slice(partIndex + 1);
  const rePart = regexStr.slice(1, partIndex);

  try {
    const pattern = new RegExp(rePart, flagpart);
    return pattern;
  } catch (e) {
    return undefined;
  }
}

/** @returns {boolean} */
function submitRegex() {
  const regexVal = regexInput.value;
  const parsedRegex = regexStrToRegExp(regexVal);

  const isRegexValid = parsedRegex !== undefined;
  successfulMsg.classList.toggle('hidden', !isRegexValid);
  failedMsg.classList.toggle('hidden', isRegexValid);

  return isRegexValid;
}

function disableSecondary() {
  const isUpperBoxChecked = boxHideAtNode.checked;

  boxHideNoTextOnly.disabled = !isUpperBoxChecked;
  boxHideAtReply.disabled = !isUpperBoxChecked;
}

function switchLang() {
  const visibleCN = selectCN.checked;

  const toggleVisibility = (
    /** @type {NodeListOf<Element>} */ elements,
    /** @type {boolean} */ isVisible
  ) => {
    for (const ele of elements) {
      ele.classList.toggle('hidden', !isVisible);
    }
  };

  toggleVisibility(langcns, visibleCN);
  toggleVisibility(langens, !visibleCN);

  const htmlLang = visibleCN ? 'zh-CN' : 'en';
  document.documentElement.setAttribute('lang', htmlLang);
}

function init() {
  // store or recover values from local storage
  chrome.storage.local.get([...SETTINGS.keys()]).then((result) => {
    /** @type {Record<string, boolean | string>} */
    const needToSet = {};

    for (const eleId of SETTINGS.keys()) {
      const localVal = /** @type {boolean | string | undefined} */ (result[eleId]);

      if (localVal === undefined) {
        needToSet[eleId] = accessBy(eleId);
      } else {
        accessBy(eleId, localVal);
      }
    }

    if (Object.keys(needToSet).length > 0) {
      chrome.storage.local.set(needToSet);
    }

    // optimized performance, no ops on default
    if (!accessBy('hideAt')) {
      disableSecondary();
    }
    if (!accessBy('selectCN')) {
      switchLang();
    }
  });

  // storage listners
  for (const [eleId, accessInfo] of SETTINGS.entries()) {
    if (!['regex', 'selectCN', 'selectEN'].includes(eleId)) {
      accessInfo?.ele.addEventListener('change', () => {
        chrome.storage.local.set({ [eleId]: accessBy(eleId) });
      });
    }
  }

  submitButton.addEventListener('click', () => {
    if (submitRegex()) {
      chrome.storage.local.set({ regex: regexInput.value });
    }
  });

  selectLang.addEventListener('change', (event) => {
    if (/** @type {HTMLInputElement} */ (event.target).name === 'language') {
      chrome.storage.local.set({
        'selectCN': selectCN.checked,
        'selectEN': selectEN.checked
      });
    }
  });

  // ui listners
  boxHideAtNode.addEventListener('change', disableSecondary);

  selectLang.addEventListener('change', (event) => {
    if (/** @type {HTMLInputElement} */ (event.target).name === 'language') {
      switchLang();
    }
  });
}

init();
