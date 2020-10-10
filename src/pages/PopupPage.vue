<template lang="pug">
	q-card.q-pa-md
		h3.text-weight-bold.q-my-none Settings
		q-select(
			label='Anki Decks'
			v-model='currentlySelectedDeck'
			:options='ankiDecks'
		)
</template>

<script>
import { defineComponent, watch, ref } from '@vue/composition-api';

export default defineComponent({
	name: 'PopupPage',
	setup() {
		const currentlySelectedDeck = ref();
		const ankiDecks = ref([]);

		chrome.runtime.sendMessage({ action: 'GET_ANKI_DECK' }, function (
			deckName
		) {
			currentlySelectedDeck.value = { label: deckName, value: deckName };
		});

		watch(currentlySelectedDeck, (selectedDeck) => {
			chrome.runtime.sendMessage({
				action: 'SET_ANKI_DECK',
				payload: { deckName: selectedDeck.value },
			});
		});

		chrome.runtime.sendMessage({ action: 'GET_ANKI_DECKS' }, function (decks) {
			ankiDecks.value = decks.map((deck) => {
				return {
					value: deck,
					label: deck,
				};
			});
		});

		return {
			currentlySelectedDeck,
			ankiDecks,
		};
	},
});
</script>
