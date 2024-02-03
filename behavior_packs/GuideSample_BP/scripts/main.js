import showDialogueOnItemUse from "./util/show-dialogue-on-item-use";
import giveASingleBook from "./util/give-a-single-book";

const BOOK_ID = "studioname_packname:guide" // Change this to be the name of your book item.

showDialogueOnItemUse({
  itemTypeId: BOOK_ID,
  title: {
    translate: "studioname_packname:guide.name", // Change this to be the lang string that should appear as the title of the dialogue window
  },
  content: {
    rawtext: [
      {translate: "studioname_packname:info.part_01",with: ["\n\n"],}, // Change these to be the lang strings that should appear in your ServerUI. The formatting is standard rawtext and can have as many entries as you need.
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_02",with: ["\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_03",with: ["\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_04",with: ["\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_05",with: ["\n","\n","\n","\n","\n","\n\n","\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_06",with: ["\n"],},
      {text: "§r\n\n",},
      {translate: "studioname_packname:info.part_07",with: ["\n\n", "\n\n"],},
    ],
  },
  exit: {
    translate: "studioname_packname:guide_exit", // Change this to be your lang string for the button on the bottom of the window.
  },
  soundOnOpen: "mob.zombie.say", // Remove or change this line to your custom sounds
  soundOnClose: "mob.chicken.say", // Remove or change this line to your custom sounds
});

giveASingleBook({
	itemTypeId: BOOK_ID
});