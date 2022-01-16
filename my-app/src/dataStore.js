export default class DataStore {
  static userName;

  static getName() {
    return DataStore.userName;
  }

  static setName(newName) {
    DataStore.userName = newName;
  }
}
