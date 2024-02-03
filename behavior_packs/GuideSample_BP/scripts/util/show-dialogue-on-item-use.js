import { world } from "@minecraft/server";

import { multiButtonScriptDialogue } from "./MinecraftScriptDialogue";

const showDialogueOnItemUse = ({
  itemTypeId,
  soundOnOpen,
  soundOnClose,
  title,
  content,
  exit,
}) => {
  world.afterEvents.itemUse.subscribe(async (event) => {
    const { source: player, itemStack } = event;
    if (itemStack.typeId === itemTypeId) {
      if (soundOnOpen) {
        player.playSound(soundOnOpen);
      }

      await multiButtonScriptDialogue(title)
        .setBody(content)
        .addButton("exit", exit)
        .open({ player });

      if (soundOnClose) {
        player.playSound(soundOnClose);
      }
    }
  });
};

export default showDialogueOnItemUse;
