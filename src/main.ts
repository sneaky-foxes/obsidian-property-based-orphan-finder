import {
  notice,
  Plugin,
  TFile,
  LinkCache,
  normalizePath,
  getLinkpath,
  parseLinktext,
} from "obsidian";
//import ParentBasedOrphanFinderSettingTab from './settings';

interface FileCollection {
  [name: string]: FileItem[];
}

interface FileItem {
  file: TFile;
  parentLinks?: LinkCache[];
}

//interface ParentBasedOrphanFinderSettings {
//	setting_a: string;
//}
//
//const DEFAULT_SETTINGS: ParentBasedOrphanFinderSettings = {
//	setting_a: "test"
//};

export default class ParentBasedOrphanFinder extends Plugin {
  //	settings: ParentBasedOrphanFinderSettings;
  graph: NoteGraph;
  parentKey: string;

  async onload() {
    //		await this.loadSettings();
    this.parentKey = "up"; // @TODO pull front setting
    this.buildGraph();

    // Add a command to lint the current file
    this.addCommand({});

    // This adds a settings tab so the user can configure various aspects of the plugin
    //		this.addSettingTab(new ParentBasedOrphanFinderSettingTab(this.app, this));
  }

  onunload() {}

  //	async loadSettings() {
  //		this.settings = Object.assign(
  //			{},
  //			DEFAULT_SETTINGS,
  //			await this.loadData(),
  //		);
  //	}
  //
  //	async saveSettings() {
  //		await this.saveData(this.settings);
  //	}

  async buildGraph() {
    this.graph = {};
    const orphans: FileCollection = {}
    const filesToProcess: FileCollection = {};

    // Get the metadataCache.
    const cachedMetadata = this.app.metadataCache;

    // We only care about markdown files.
    const markdownFiles = this.app.vault
      .getFiles()
      .filter((f) => f.extension == "md");
    console.log(markdownFiles.length);

    // Process each markdown file in the vault.
    for (const file of markdownFiles) {
      // Get metadata about the file.
      const fileCache = cachedMetadata.getFileCache(file);
      const frontmatterLinks = fileCache.frontmatterLinks;

      // We only care about frontmatter links.
      // If this file has no frontmatter links, it's automatically an orphan.
      if (frontmatterLinks == undefined || frontmatterLinks.length < 1) {
        orphans[file.name] = {
          file: file
        }
      } else {
        const parentLinks = frontmatterLinks.filter((link) => {
          const linkKey = link.key;

          // Obsidian stores frontmatter arrays as `key.index`.
          // Example: `up.0`
          const linkParts = linkKey.split(".");

          // We only care about links that are associated with the parent key.
          const hasParentKey = linkParts[0] == this.parentKey;

          // Get the normalized link path.
          // We don't need to strip the `#` or `|` off links if we use this function.
          const linkPath = getLinkpath(link.link);

          // We only care about links to actually existing files.
          const linkedNoteExists =
            cachedMetadata.getFirstLinkpathDest(linkPath, file.path) != null;

          // Only return links that meet all criteria.
          return hasParentKey && linkedNoteExists;
        });

        // If there are no parent links, it's automatically an orphan.
        if (parentLinks.length == 0) {
          orphans[file.name] = {
            file: file
          }
        } else {
          filesToProcess[file.name] = {
            file: file,
            parentLinks: parentLinks
          }
        }

        console.log(parentLinks);
      }
    }
    console.log(orphans);
  }
}
