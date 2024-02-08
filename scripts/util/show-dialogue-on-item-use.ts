import { RawMessage, world } from '@minecraft/server';

import { multiButtonScriptDialogue } from './MinecraftScriptDialogue';

export interface ShowDialogueOnItemUseOptions {
  itemTypeId: string;
  soundOnOpen?: string;
  soundOnClose?: string;
  title: RawMessage | string;
  content: RawMessage | string;
  exit: RawMessage | string;
}

export interface ShowDialogueOnItemUse {
  (options: ShowDialogueOnItemUseOptions): void;
}

export const showDialogueOnItemUse: ShowDialogueOnItemUse = ({
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

      await multiButtonScriptDialogue(title).setBody(content).addButton('exit', exit).open({ player });

      if (soundOnClose) {
        player.playSound(soundOnClose);
      }
    }
  });
};

export default showDialogueOnItemUse;
