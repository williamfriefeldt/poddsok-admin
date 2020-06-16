export const DIALOGTTEXT: DialogOption[] = [
	{ type: 'deleteEp', text: 'Är du säker på att du vill ta bort detta segment?' },
	{ type: 'changeEp', text: 'Är du säker på att du vill ändra detta segment?' },
	{ type: 'newEps', text: 'Är du säker att du vill lägga till de nya avsnitten?' },
	{ type: 'addPod', text: 'Är du säker på att du vill lägga till podcasten?' }
];

export interface DialogOption {
	type: string;
	text: string;
}