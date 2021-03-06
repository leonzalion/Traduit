# Traduit

An app that allows you to easily create Anki flashcards from popular translation websites.

To run the app, clone the repo and run:
```shell script
yarn
yarn build
```

Then go to the extensions page of your browser, toggle developer mode, and then press load unpacked and select `traduit/dist/bex/UnPackaged`

For Traduit to work, make sure you're running Anki locally and have installed the [AnkiConnect plugin for Anki](https://foosoft.net/projects/anki-connect/).

Then, press the extension icon in your browser and then select the deck you want to save flashcards to.

Then, visit https://wordreference.com and make a search, and you should see small orange buttons next to translation entries! When you click on one of these buttons, it will save the entry as a flashcard in the Anki deck you've selected!

# Future TODOs:
- [ ] Allow customization of flashcard output
- [ ] Add support for more websites (e.g. Linguee)
- [ ] Add an error message that appears when adding the card fails

# Credits
Thanks to https://github.com/Togohogo1 for the logo!
