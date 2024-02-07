import { RawMessage } from "@minecraft/server";
interface ShowDialogueOnItemUseOptions {
    itemTypeId: string;
    soundOnOpen?: string;
    soundOnClose?: string;
    title: RawMessage | string;
    content: RawMessage | string;
    exit: RawMessage | string;
}
interface ShowDialogueOnItemUse {
    (options: ShowDialogueOnItemUseOptions): void;
}
declare const showDialogueOnItemUse: ShowDialogueOnItemUse;
export { showDialogueOnItemUse as default, showDialogueOnItemUse, ShowDialogueOnItemUseOptions, ShowDialogueOnItemUse };
