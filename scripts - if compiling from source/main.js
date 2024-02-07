import showDialogueOnItemUse from "./util/show-dialogue-on-item-use";
import giveASingleBook from "./util/give-a-single-book";

const BOOK_ID = "studioname_packname:guide" // If you did a global find and replace, this should now be the same as your book item.

showDialogueOnItemUse({
  itemTypeId: BOOK_ID,
  title: {
    translate: "studioname_packname:guide.name", // If you did a global find and replace, this should now be the same as lang file already.
  },
  content: {
    rawtext: [
	// Change these to be the lang strings that should appear in your ServerUI.
	// The formatting is standard rawtext and can have as many entries as you need, but keep it concise!!
      {translate: "studioname_packname:info.part_01",with: ["\n"],}, 
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_02",with: ["\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_03",with: ["\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_04",with: ["\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_05",with: ["\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_06",with: ["\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_07",with: ["\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_08",with: ["\n"],},
    ],
  },
  exit: {
    translate: "studioname_packname:guide_exit", // If you did a global find and replace, this should now be the same as lang file already.
  },
  soundOnOpen: "mob.zombie.say", // Remove or change this line to your custom sounds
  soundOnClose: "mob.chicken.say", // Remove or change this line to your custom sounds
});

giveASingleBook({
	itemTypeId: BOOK_ID
});