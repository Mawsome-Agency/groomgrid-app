// Simple global store for tracking unsaved changes across components
class UnsavedChangesStore {
  private unsavedChangesCount = 0;
  private listeners: (() => void)[] = [];

  increment() {
    this.unsavedChangesCount++;
    this.notifyListeners();
  }

  decrement() {
    this.unsavedChangesCount = Math.max(0, this.unsavedChangesCount - 1);
    this.notifyListeners();
  }

  hasUnsavedChanges() {
    return this.unsavedChangesCount > 0;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

const unsavedChangesStore = new UnsavedChangesStore();
export default unsavedChangesStore;