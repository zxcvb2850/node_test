/**
 * 常用函数
 * */

export const mapTag = '[object Map]';
export const setTag = '[object Set]';
export const arrayTag = '[object Array]';
export const objectTag = '[object Object]';
export const argsTag = '[object Arguments]';

export const boolTag = '[object Boolean]';
export const dateTag = '[object Date]';
export const errorTag = '[object Error]';
export const numberTag = '[object Number]';
export const regexpTag = '[object RegExp]';
export const stringTag = '[object String]';
export const symbolTag = '[object Symbol]';

/**
 * 获取类型
 * @param params
 * @returns {string}
 */
export const typeOf = (params) => {
  return Object.prototype.toString.call(params);
};

/**
 * 深拷贝
 * @param target
 * @returns {null|*}
 */
export const deepCopy = (target) => {
  if (typeof target === 'object') {
	const type = typeOf(target);
	let cloneTarget = null;
	if (type === objectTag) {
	  cloneTarget = {};
	} else if (type === arrayTag) {
	  cloneTarget = [];
	}
	for (const key in target) {
	  cloneTarget[key] = deepCopy(target[key]);
	}
	return cloneTarget;
  } else {
	return target;
  }
};

/**
 * 函数防抖
 * @param fn
 * @param delay
 * @returns {Function}
 */
export const debounce = (fn, delay) => {
  let timer = null;
  return (args) => {
	if (timer) {
	  clearTimeout(timer);
	}
	timer = setTimeout(() => {
	  fn.apply(this, args);
	}, delay)
  }
};

/**
 * 函数节流
 * @param fn
 * @param delay
 * @returns {Function}
 */
export const throttle = (fn, delay) => {
  let timer = null;
  return (args) => {
	if (!timer) {
	  timer = setTimeout(() => {
		fn.apply(this, args);
		clearTimeout(timer);
		timer = null;
	  }, delay)
	}
  }
};
