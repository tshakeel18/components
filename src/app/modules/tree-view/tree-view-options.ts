/**
 * Configuration parameters of the component.
 */
export class DfTreeViewOptions {
  /**
   * Allow multiple nodes to be selected.
   */
  multiselect?: boolean;
  /**
   * The default icon for folder nodes when opened.
   */
  iconFolderOpened?: string;
  /**
   * The default icon for folder nodes when closed.
   */
  iconFolderClosed?: string;

  /**
   * The default icon for folder nodes are loading children.
   */
  iconLoading?: string;

  /**
   * If sub folders are empty then collapse them into a single node.
   *
   * @example
   * Folder 1
   *  Folder 2
   * becomes
   * Folder 1 / Folder 2
   */
  collapseFolders?: boolean;

  /**
   * The separator to distinguish parent folder from child
   *
   * @example
   * // Folders separated by backslash /
   * Folder 1 / Folder 1.1 / Folder 1.1.1
   */
  collapseFolderSeparator?: string;
  /**
   * It will render fa-caret icons as handlers to manage collapse/toggle.
   */
  showHandlers?: boolean;
}
