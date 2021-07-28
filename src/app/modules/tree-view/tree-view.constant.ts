import { DfTreeViewOptions } from './tree-view-options';

/**
 * File Icon style rule
 */
export const iconFile: string = 'fa-file-o';

/**
 * Folder icon style rule
 */
export const iconFolder: string = 'df-tree-view__icon-folder';

/**
 * Disable Folder icon
 * CSS class to disable folder icon
 */
export const iconFolderDisable: string = 'df-tree-view__icon--disable';

/**
 * Mac OS Command Key
 */
export const modKeyMac: string = 'metaKey';

/**
 * Windows OS Ctrl Key
 */
export const modKeyWin: string = 'ctrlKey';

/**
 * The default configuration for the tree view
 */
export const DF_TREE_VIEW_DEFAULT_OPTIONS: Readonly<DfTreeViewOptions> = {
  multiselect: false,
  iconFolderOpened: 'fa-folder-open',
  iconFolderClosed: 'fa-folder',
  collapseFolders: false,
  collapseFolderSeparator: ' / ',
  showHandlers: false,
  iconLoading: 'df-tree-view-item__loader',
};
