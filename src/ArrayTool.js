export default class ArrayTool {
  static swap(arr, item1, item2) {
    const index1 = arr.indexOf(item1);
    const index2 = arr.indexOf(item2);

    arr[index1] = item2;
    arr[index2] = item1;
  }

  static insert(arr, index, item) {
    arr.splice(index, 0, item);
  }

  static contains(arr, item) {
    return arr.indexOf(item) >= 0;
  }

  static containsAny(arr, ...arr2) {
    for (let i = 0; i < arr2.length; i++) {
      const item = arr2[i];
      const contains = arr.indexOf(item) >= 0;
      if (contains) {
        return true;
      }
    }

    return false;
  }

  static removeAt(arr, index) {
    arr.splice(index);
  }

  static remove(arr, item) {
    arr.splice(arr.indexOf(item), 1);
  }

  static pushIfNotExist(arr, item) {
    const index = arr.indexOf(item);
    if (index == -1) {
      arr.push(item);
    }
  }

  static pushAll(arr, newArr) {
    for (let i = 0; i < newArr.length; i++) {
      arr.push(newArr[i]);
    }
  }
}
