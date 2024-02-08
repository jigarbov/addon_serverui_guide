# addon_serverui_guide
## What do I do?
Download either the GuideSample.mcaddon or the full resource and behavior folders. **They both contain the same stuff, put them into your Add-On development folders as usual.**

### ***If you use a TS environment and are compiling from source, download the ```scripts``` folder that is separate and put it into your development environment. It includes the TS declarations you will need.***

## Whats in it?
Fully functional ServerUI implementation including some lightweight script to give every player a specific item the first time they enter any world with this Add-On.
![image](https://github.com/jigarbov/addon_serverui_guide/assets/30274167/90486c17-be6d-41ca-82da-bca821668a99)

## What do I change?
### 1. Customise the texture:
- `textures/studioname/packname/items/guide.png`
### 2. Customise the recipe
- `GuideSample_BP/recipes/studioname/packname/guide.json`
### 3. Rename the studioname/packname folders with your chosen folder names according to the guidelines in the following paths:
- `GuideSample_BP/items/studioname/packname`
- `GuideSample_BP/recipes/studioname/packname`
- `GuideSample_RP/textures/studioname/packname/items`
  
### 4. Most importantly: 
***Do a global Find & Replace using VSCode or something that replaces "studioname_packname" with your namespace of choice.***

### 5. Update your texture reference
Now that your renamed your folders, you will have to update `GuideSample_RP/textures/item_texture.json` specifically where it references your new location for the guide.png image. The file looks like this: ![image](https://github.com/jigarbov/addon_serverui_guide/assets/30274167/3c3d6139-09a6-457e-b36e-969f4d1a8731)

## Finally, it's time to edit the script and lang file.
### 6. Lang File
You will find the lang file in `GuideSample_RP/texts/en_US.lang` and inside it a bunch of pre-populated lang entries. You will be changing all of these to help players understand how YOUR Add-On works. Be informational but concise. This is NOT supposed to be used to be a comprehensive guide about everything your Add-On does. Think of it as a starter guide to push players in the right direction so you don't rob them of all discovery.

Note:
- %1 = \n So everytime you see %1, consider it as the curser going to the next line. This is particularly important when showing crafting recipes.
- §c = color codes. You can find a reference of them here: https://minecraft.wiki/w/Formatting_codes#Color_codes
- Keep in mind that this will be bright text on a dark background. So avoid using dark colors.

### 7. Script main.js
The scary file. This might be your first time editing a script, but don't worry! We've made it super easy for you!
Crack open `GuideSample_BP/scripts/main.js` in your text editor of choice. I like VSCode, but even notepad will do. You'll notice a bunch of comments like this:
> // If you did a global find and replace, this should now be the same as your book item.

This means there's something you should double check. If you did the global replace, many of these are already pointing to the correct lang string. If you didn't, you need to make sure they are.

The big chunk of text is where the body of the dialogue window goes. This can be formatted however you like, the important part here is that all of the text corresponds to your lang entries. This is standard rawtext formatting, if you are not familiar I would recommend checking some online guides about the rawtext format.
![image](https://github.com/jigarbov/addon_serverui_guide/assets/30274167/ee4370a1-4bf5-404a-beee-c984efacf035)

### 8. Sounds
At the bottom you can see a place to add some custom sound effects on open and close. I recommend using some that appear in your pack to give it some custom flavor.

## 9. Don't forget UUIDS!
In the manifest of your behavior & resource pack are a whole bunch of UUID's. You should already know about them, but the TLDR is you should generate new ones for _ALL_ of them except the dependencies.
### What's a dependency?
Dependencies ensure both the behavior & resource pack get added at the same time. To make sure this happens you need to **copy your new uuid from the "header" of the resource pack to the dependencies in the manifest of the behavior pack**. And vice versa, the ***header uuid of the resource pack into the dependencies of the behavior pack**.

# You did it!
## But how do you test it?
- Add the pack to your world, you'll get a book at load.
- Interact with the book and a fancy UI will open up!
- Press the close button to close it.
- Don't forget to try to craft it to ensure the recipe was set up right!

# FAQ
## Q: The game yelled at me and I didn't get the item when I opened the world.

> [Scripting][error]-Unhandled promise rejection: Error: Invalid item identifier studioname_packname:guide
> ![image](https://github.com/jigarbov/addon_serverui_guide/assets/30274167/48fa4887-f721-4c63-8672-59c250b0f498)

Check that the BOOK_ID in main.js matches the identifier of your actual book. It's yelling at you because it can't find your item, so you forgot to either rename the item in the script or rename the identifier in your behavior pack of the item itself.

## Q: My item is invisible :(
![image](https://github.com/jigarbov/addon_serverui_guide/assets/30274167/eabed751-7c4b-43e5-a133-6b88b29d0fb9)

You skipped step 7. It can't find the book texture.

## Q: The text in the ServerUI looks all messed up
Check your formatting in the lang file. That's what determines how it will look.

## Q: I want to give my book a different way.
Just delete this bit of code from the main.js
`giveASingleBook({
	itemTypeId: BOOK_ID
});`

## Q: Can I integrate this with my own scripts?
Of course, just make sure you downloaded the seperate ```script``` folder. This includes the TS declaration files in the Util folder. Copy the whole util folder into your script folder. Then copy everything from my main.ts into your own main.ts including the imports at the top. But if you're already scripting you probably don't need me to tell you that.

## Qmagnet: I changed stuff and it isn't updating in my world.
It depends on what isn't changing, but make sure you are using the development_resource_pack and development_behavior_pack folders. If you installed the .mcaddon on it's own then its likely installed into the other folder and you should develop it the way you normally develop Add-Ons. If you didn't get a book the second time, well that's by design. Start a new world and attach the packs again.

## Not copyright Jigarbov Productions
