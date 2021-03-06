export const DIALOGTTEXT: DialogOption[] = [
	{ type: 'deleteEp', text: 'Är du säker på att du vill ta bort detta segment?' },
	{ type: 'changeEp', text: 'Är du säker på att du vill ändra detta segment?' },
	{ type: 'newEps', text: 'Är du säker att du vill lägga till de nya avsnitten?' },
	{ type: 'newEp', text: 'Det ligger redan ett segment på den angivna minuten. Vill du lägga till segmentet ändå?' },
	{ type: 'addPod', text: 'Är du säker på att du vill lägga till podcasten?' },
	{ type: 'removePod', text: 'Om du är HELT säker på att du vill ta bort podcasten, skriv in titeln med stora bokstäver. Detta går INTE att ångra!' }
];

export interface DialogOption {
	type: string;
	text: string;
}
