// Background code goes here
chrome.browserAction.onClicked.addListener((/* tab */) => {
	// Opens our extension in a new browser window.
	// Only if a popup isn't defined in the manifest.
	chrome.tabs.create(
		{
			url: chrome.extension.getURL('www/index.html'),
		},
		(/* newTab */) => {
			// Tab opened.
		}
	);
});

async function ankiPost(body) {
	const response = await fetch("http://localhost:8765", {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(body)
	});
	return response.json();
}

const storage = {
	getItemsAsync: async function(keys) {
		return new Promise((resolve) => {
			chrome.storage.sync.get(keys, function(result) {
				resolve(result);
			})
		});
	},
	setItemsAsync: async function(obj) {
		return new Promise((resolve) => {
			chrome.storage.sync.set(obj, function(result) {
				resolve(result);
			})
		})
	}
};

async function addTranslation(payload) {
	const {deckName} = await storage.getItemsAsync(['deckName']);

	const {from, to, synonym, fromPos, toPos, usage, fromLang, toLang} = payload;

	const notes = [
		{
			deckName,
			modelName: "Basic",
			fields: {
				Front: `${fromLang}: ${from} ${fromPos} ${synonym} ${usage}`,
				Back: `${toLang}: ${to} ${toPos}`,
			},
			tags: ["traduit"]
		},
		{
			deckName,
			modelName: "Basic",
			fields: {
				Front: `${toLang}: ${to} ${toPos} ${synonym} ${usage}`,
				Back: `${fromLang}: ${from} ${fromPos}`
			},
			tags: ["traduit"]
		}
	];

	await ankiPost({
		action: 'addNotes',
		version: 6,
		params: {notes}
	});
}

async function getAnkiDecks(payload, request, sender, sendResponse) {
	const {result, error} = await ankiPost({
		action: 'deckNames',
		version: 6
	});
	if (error) console.error('Error occured in getAnkiDecks: ' + error);
	sendResponse(result);
}

async function setAnkiDeck(payload, request, sender, sendResponse) {
	await storage.setItemsAsync({deckName: payload.deckName});
	sendResponse({success: true});
}

async function getAnkiDeck(payload, request, sender, sendResponse) {
	const {deckName} = await storage.getItemsAsync(['deckName']);
	sendResponse(deckName);
}

async function syncAnkiDeck() {
	// TODO
}

const actionToFnMap = {
	ADD_TRANSLATION: addTranslation,
	GET_ANKI_DECKS: getAnkiDecks,
	GET_ANKI_DECK: getAnkiDeck,
	SET_ANKI_DECK: setAnkiDeck,
	SYNC_ANKI_DECK: syncAnkiDeck,
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		(async() => {
			const {action, payload} = request;
			if (actionToFnMap[action]) {
				actionToFnMap[action](payload, request, sender, sendResponse);
			} else {
				console.error(`Callback for action ${action} doesn't exist.`)
			}
		})();
		return true;
	}
);
