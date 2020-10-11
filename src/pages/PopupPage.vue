<template lang="pug">
	q-card(style='min-width: 500px').q-pa-md.column.items-center.relative-position
		h3.text-weight-bold.q-mt-none.q-mb-xs Traduit
		.settings-panel.column.items-center.self-stretch(v-if='isAnkiConnectRunning === true')
			.row.items-center(style='margin-top: -2px')
				.text-weight-bold Current Anki Deck:
				span.q-ml-xs {{ currentlySelectedDeck.value }}
				q-icon.q-ml-xs(
					:name='matInfo'
				)
					q-tooltip(max-width='200px').
						This is the deck where the flashcards from the translations
						you save are stored.
			q-select.self-stretch(
				label='Anki Decks'
				v-model='currentlySelectedDeck'
				:options='ankiDecks'
			)
		div(v-else-if='isAnkiConnectRunning === false').column.items-center.q-gutter-y-md
			span We couldn't establish a connection to AnkiConnect.
			q-btn(
				no-caps
				label='Retry'
				:icon='matRefresh'
				@click='checkAnkiConnect'
			)
			div.text-center
				| Make sure to follow the instructions at !{' '}
				a(href='https://foosoft.net/projects/anki-connect/').
					AnkiConnect's Installation Page
				| !{' '} and that Anki is running in the background on your computer.
		template(v-else)
			q-inner-loading(
				showing
			)
		q-separator.q-my-md
		span
			| Traduit is an open-source project started by !{' '}
			a(href='https://github.com/leonzalion') @leonzalion.
			| !{' '} You can find the source code at !{' '}
			a(href='https://github.com/leonzalion/Traduit') its GitHub Repository.
</template>

<script>
import { defineComponent, watch, watchEffect, ref, onMounted } from
		'@vue/composition-api';
import { matRefresh, matInfo } from '@quasar/extras/material-icons';

export default defineComponent({
	name: 'PopupPage',
	setup() {
		const currentlySelectedDeck = ref();
		const ankiDecks = ref([]);
		const isAnkiConnectRunning = ref(null);

		function checkAnkiConnect() {
			chrome.runtime.sendMessage(
				{ action: 'CHECK_ANKICONNECT' },
				(isConnected) => {
					isAnkiConnectRunning.value = isConnected;
				}
			);
		}
		checkAnkiConnect();

		onMounted(() => {
			const links = document.getElementsByTagName("a");
			for (let i = 0; i < links.length; i += 1) {
				const ln = links[i];
				const location = ln.href;
				ln.onclick = () => {
					chrome.tabs.create({active: true, url: location});
				};
			}
		});

		watchEffect(() => {
			if (isAnkiConnectRunning.value === true) {
				chrome.runtime.sendMessage({ action: 'GET_ANKI_DECKS' }, (decks) => {
					ankiDecks.value = decks.map((deck) => {
						return {
							value: deck,
							label: deck,
						};
					});
				});

				chrome.runtime.sendMessage({ action: 'GET_ANKI_DECK' }, (deckName) => {
					currentlySelectedDeck.value = {
						label: deckName,
						value: deckName,
					};
				});
			}
		});

		watch(currentlySelectedDeck, (selectedDeck) => {
			chrome.runtime.sendMessage({
				action: 'SET_ANKI_DECK',
				payload: { deckName: selectedDeck.value },
			});
		});

		return {
			currentlySelectedDeck,
			ankiDecks,
			checkAnkiConnect,
			isAnkiConnectRunning,

			matRefresh,
			matInfo,
		};
	},
});
</script>

<style>
.settings-panel {
	min-height: 300px;
}
</style>
