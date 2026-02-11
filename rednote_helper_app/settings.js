'use strict';

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

/**
 * @param {string} clickTimesStr
 * @param {number} prevValid
 * @returns {number}
 */
function clickTimesToNum(clickTimesStr, prevValid) {
  const num = parseInt(clickTimesStr, 10);
  if (Number.isNaN(num)) {
    return prevValid;
  }
  return Math.max(1, Math.min(num, 20));
}

const DEFAULT_SETTINGS = /** @type {const} */({
  regex: '//',
  enableRegex: false,
  hideAt: true,
  hideAtReply: true,
  hideNoTextOnly: false,
  showAll: true,
  buttonText: '查看所有',
  clickTimes: '10',
});
/** @typedef {typeof DEFAULT_SETTINGS} DefaultSettingsType*/
/** @typedef {keyof DEFAULT_SETTINGS} DefaultSettingsKeys*/

/** 
 * @typedef {DefaultSettingsType & {
 *   regexObj: RegExp | undefined,
 *   clickTimesNum: number
 * }} CachedSettingsType
 */

/** @type {CachedSettingsType} */
const cachedSettings = { ...DEFAULT_SETTINGS, regexObj: undefined, clickTimesNum: 10 };

/**
 * async to make sure main program starts after settings are loaded
 * @param {() => Promise<any>} onChangedFunc
 */
async function initSettings(onChangedFunc) {
  // init user settings
  // store default values if storage is empty
  const SETTING_KEYS = /** @type {DefaultSettingsKeys[]} */
    (Object.keys(DEFAULT_SETTINGS));
  const result = await chrome.storage.local.get(SETTING_KEYS);

  /** @type {Partial<Record<DefaultSettingsKeys, string | boolean>>} */
  const settingsToSet = {};

  for (const key of SETTING_KEYS) {
    if (result[key] === undefined) {
      settingsToSet[key] = DEFAULT_SETTINGS[key];
    }
  };

  if (Object.keys(settingsToSet).length > 0) {
    await chrome.storage.local.set(settingsToSet);
  }

  Object.assign(cachedSettings, result);

  // cache
  cachedSettings.regexObj = regexStrToRegExp(cachedSettings.regex);
  cachedSettings.clickTimesNum =
    clickTimesToNum(cachedSettings.clickTimes, cachedSettings.clickTimesNum);

  // add listener for changes to storage
  chrome.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === 'local') {
      for (const key of Object.keys(changes)) {
        if (SETTING_KEYS.includes(/** @type {DefaultSettingsKeys} */(key))) {
          /** @type {Record<string, any>} */ (cachedSettings)[key] = changes[key].newValue;
        }
      }

      // cache
      if (Object.hasOwn(changes, 'regex')) {
        cachedSettings.regexObj = regexStrToRegExp(cachedSettings.regex);
      }
      if (Object.hasOwn(changes, 'clickTimes')) {
        cachedSettings.clickTimesNum =
          clickTimesToNum(cachedSettings.clickTimes, cachedSettings.clickTimesNum);;
      }

      await onChangedFunc();
    }
  });
}
