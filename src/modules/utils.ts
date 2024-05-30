export const deepCloneObject = function<T> (obj: T): T {
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const clone = Object.create(Object.getPrototypeOf(obj), descriptors) as T;
    return clone;
}
