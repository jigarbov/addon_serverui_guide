# addon_serverui_guide
## What do I do?
Download either the GuideSample.mcaddon or the full resource and behavior folders. They both contain the same stuff and put them into your Add-On development folders as usual.

## Whats in it?
Fully functional ServerUI implementation including some lightweight script to give every player a specific item the first time they enter any world with this addon.
![image](https://github.com/jigarbov/addon_serverui_guide/assets/30274167/90486c17-be6d-41ca-82da-bca821668a99)

## What do I change?
### Most importantly: 
***Do a global Find & Replace using VSCode or something that replaces "studioname_packname" with your namespace of choice.***
### Customise the texture:
- `textures/studioname/packname/items/guide.png`
### Customise the recipe
- `GuideSample_BP/recipes/studioname/packname/guide.json`
### Replace studioname/packname with your chosen folder names according to the guidelines in the following folders:
- `GuideSample_BP/items/studioname/packname`
- `GuideSample_BP/recipes/studioname/packname`
- `GuideSample_RP/textures/studioname/packname/items`
## Finally, it's time to edit the script and lang file.
### Lang File
You will find the lang file in `GuideSample_RP/texts/en_US.lang` and inside it a bunch of pre-populated lang entries. You will be changing all of these to help players understand how YOUR addon works. Be informational but concise. This is NOT supposed to be used to be a comprehensive guide about everything your addon does. Think of it as a starter guide to push players in the right direction so you don't rob them of all discovery.

Note:
- %1 = \n So everytime you see %1, consider it as the curser going to the next line. This is particularly important when showing crafting recipes.
- §c = color codes. You can find a reference of them here: https://minecraft.wiki/w/Formatting_codes#Color_codes
- Keep in mind that this will be bright text on a dark background. So avoid using dark colors.

### Script main.js
The scary file. This might be your first time editing a script, but don't worry! We've made it super easy for you!
Crack open `GuideSample_BP/scripts/main.js` in your text editor of choice. I like VSCode, but even notepad will do. You'll notice a bunch of comments like this:
> // If you did a global find and replace, this should now be the same as your book item.

This means there's something you should double check. If you did the global replace, many of these are already pointing to the correct lang string. If you didn't, you need to make sure they are.

The big chunk of text is where the body of the dialogue window goes. This can be formatted however you like, the important part here is that all of the text corresponds to your lang entries. This is standard rawtext formatting, if you are not familiar I would recommend checking some online guides about the rawtext format.
![image](https://github.com/jigarbov/addon_serverui_guide/assets/30274167/ee4370a1-4bf5-404a-beee-c984efacf035)

### Sounds
At the bottom you can see a place to add some custom sound effects on open and close. I recommend using some that appear in your pack to give it some custom flavor.

## Don't forget UUIDS!
In the manifest of your behavior & resource pack are a whole bunch of UUID's. You should already know about them, but the TLDR is you should generate new ones for _ALL_ of them except the dependencies.

## What's a dependency?
Dependencies ensure both the behavior & resource pack get added at the same time. To make sure this happens you need to **copy your new uuid from the "header" of the resource pack to the dependencies in the manifest of the behavior pack**. And vice versa, the ***header uuid of the resource pack into the dependencies of the behavior pack**.

# You did it!
## But how do you test it?
- Add the pack to your world, you'll get a book at load.
- Interact with the book and a fancy UI will open up!
- Press the close button to close it.
- Don't forget to try to craft it to ensure the recipe was set up right!

# FAQ
## I didn't get the item when I opened the world.
Check that the BOOK_ID in main.js matches the identifier of your actual book.

## The text in the ServerUI looks all messed up
Check your formatting in the lang file. That's what determines how it will look.

## I want to give my book a different way.
Just delete this bit of code from the main.js
`giveASingleBook({
	itemTypeId: BOOK_ID
});`

## Can I integrate this with my own scripts?
Of course, just make sure you add everything from the main.js into your own scripting main.js including the imports at the top. But if you're already scripting you probably don't need me to tell you that.

## Not copyright Jigarbov Productions
