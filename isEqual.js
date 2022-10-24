// v1
function isObject(s) {
  return s && typeof s === 'object' && s.length === undefined;
}
function isArray(s) {
  return s && typeof s === 'object' && s.length !== undefined;
}
function isEqual(value1, value2) {
  if (typeof value1 === 'undefined' && typeof value2 === 'undefined') {
    return true;
  }
  if (typeof value1 === 'boolean' && typeof value2 === 'boolean') {
    return value1 === value2;
  }
  if (typeof value1 === 'number' && typeof value2 === 'number') {
    return value1 === value2;
  }
  if (typeof value1 === 'string' && typeof value2 === 'string') {
    return value1 === value2;
  }
  if (isObject(value1) && value1 !== null && isObject(value2) && value2 !== null) {
    return isObjectsEqual(value1, value2);
  }
  if (isArray(value1) && isArray(value2)) {
    return isArraysEqual(value1, value2);
  }
  return JSON.stringify(value1) === JSON.stringify(value2);
}
function isObjectsEqual(object1, object2) {
  const props1 = Object.getOwnPropertyNames(object1);
  const props2 = Object.getOwnPropertyNames(object2);
  if (props1.length !== props2.length) {
    return false;
  }
  if (props1.length === 0) {
    return true;
  }
  if (!isArraysEqual(props1, props2)) {
    return false;
  }
  for (let i = 0; i < props1.length; i += 1) {
    const prop = props1[i];
    const bothAreObjects = isObject(object1[prop]) && isObject(object2[prop]);
    if (
      (!bothAreObjects && !isEqual(object1[prop], object2[prop])) ||
      (bothAreObjects && !isObjectsEqual(object1[prop], object2[prop]))
    ) {
      return false;
    }
  }
  return true;
}
function isArraysEqual(value1, value2) {
  if (value1.length === 0 && value2.length === 0) {
    return true;
  }
  if (value1.length !== value2.length) {
    return false;
  }
  if (isObject(value1[0]) && isObject(value2[0])) {
    //  return  isObjectsEqual Циклом проверять
  }
  for (let i = 0; i <= value1.length; i++) {
    let res = value2.findIndex((v) => {
      return isEqual(v, value1[i]);
    });
    if (res >= 0) {
      value2.splice(res, 1);
    }
  }

  return value2.length === 0;
}
const a = ['a', 'b', 'k'];
const b = ['k', 'b', 'с'];
console.log(isEqual(a, b));


// v2 
function isEqualV2(a, b) {
	if (a === b) return true;

	if (a && b && typeof a == 'object' && typeof b == 'object') {
		if (a.constructor !== b.constructor) return false;
		let length;
		let i;
		if (Array.isArray(a)) {
			length = a.length;
			if (length != b.length) return false;
			for (i = length; i-- !== 0;) if (!isEqual(a[i], b[i])) return false;
			return true;
		}
		if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
		if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
		if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

		const keys = Object.keys(a);
		length = keys.length;
		if (length !== Object.keys(b).length) return false;

		for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

		for (i = length; i-- !== 0;) {
			let key = keys[i];
			if (!isEqual(a[key], b[key])) return false;
		}

		return true;
	}
	// true if both NaN, false otherwise
	return a !== a && b !== b;
}