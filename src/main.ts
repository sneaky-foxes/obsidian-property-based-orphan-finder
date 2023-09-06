import { Notice, Plugin, TFile, normalizePath } from 'obsidian';
//import ParentBasedOrphanFinderSettingTab from './settings';

//interface ParentBasedOrphanFinderSettings {
//	setting_a: string;
//}
//
//const DEFAULT_SETTINGS: ParentBasedOrphanFinderSettings = {
//	setting_a: "test"
//};

export default class ParentBasedOrphanFinder extends Plugin {
//	settings: ParentBasedOrphanFinderSettings;

	async onload() {
		new Notice("hello!");
//		await this.loadSettings();

		// Add a command to lint the current file
		this.addCommand({
		});

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

}
