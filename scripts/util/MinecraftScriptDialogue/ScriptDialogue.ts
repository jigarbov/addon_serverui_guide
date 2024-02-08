import { Player, RawMessage } from '@minecraft/server';
import { FormCancelationReason, FormRejectReason, FormResponse, FormRejectError } from '@minecraft/server-ui';
import { asyncWait } from './Utils';

export interface Showable<T> {
  show(player: Player): Promise<T>;
}

/**
 * Displayed text in dialogues - can be a string or a RawMessage used for translations
 *
 * @category Script dialogue
 */
export type ScriptDialogueString = string | RawMessage;

const DefaultShowDialogOptions: Readonly<OptionalShowDialogueOptions> = Object.freeze({
  lockPlayerCamera: true,
  busyRetriesCount: 5,
  busyRetriesTick: 5,
});

export interface OptionalShowDialogueOptions {
  /**
   * Locks the camera when opening a script dialogue. This prevents the camera from panning when moving the
   * mouse/dragging on transitions.
   * @defaultValue true
   */
  lockPlayerCamera: boolean;
  /**
   * Configures how many times retry the script dialogue if the player is busy.
   * @see {@link busyRetriesTick}
   * @defaultValue 5
   */
  busyRetriesCount: number;
  /**
   * Configures how long (in ticks) to wait between retries if the player is busy.
   * @see {@link busyRetriesCount}
   * @defaultValue 5
   */
  busyRetriesTick: number;
}

interface RequiredShowDialogueOptions {
  /**
   * Player to show the script dialogue to
   */
  player: Player;
}

/**
 * Options used when opening a script dialogue.
 * Controls the targeted player, the use of the camera and if we want to wait if the user is busy.
 *
 * @category Script dialogue
 */
export interface ShowDialogueOptions extends Partial<OptionalShowDialogueOptions>, RequiredShowDialogueOptions {}

export interface ResolvedShowDialogueOptions extends RequiredShowDialogueOptions, OptionalShowDialogueOptions {}

/**
 * Base class for all the script dialogues
 *
 * @category Script dialogue
 */
export abstract class ScriptDialogue<T extends ScriptDialogueResponse> {
  protected constructor() {}

  /**
   * Opens the script dialogue. It requires the {@link ShowDialogueOptions#player player} as one of the options.
   *
   * You can configure displaying features by setting the optional values in the {@link ShowDialogueOptions options}
   * @param options used to configure what and how to display the script dialogue.
   *
   * @see {@link ShowDialogueOptions}
   */
  async open(options: ShowDialogueOptions): Promise<T | DialogueCanceledResponse | DialogueRejectedResponse> {
    const resolvedOptions = this.resolveShowDialogueOptions(options);

    try {
      if (resolvedOptions.lockPlayerCamera) {
        this.lockPlayerCamera(resolvedOptions);
      }

      try {
        const showable = await this.getShowable(resolvedOptions);
        const response = await this.show(showable, resolvedOptions);
        if (response.canceled) {
          return new DialogueCanceledResponse(response.cancelationReason!);
        }

        return await this.processResponse(response, resolvedOptions);
      } catch (e) {
        if (e && e instanceof FormRejectError) {
          return new DialogueRejectedResponse(e.reason, e);
        } else {
          return new DialogueRejectedResponse(undefined, e);
        }
      }
    } finally {
      if (resolvedOptions.lockPlayerCamera) {
        this.unlockPlayerCamera(resolvedOptions);
      }
    }
  }

  private async show<T extends FormResponse>(showable: Showable<T>, options: ResolvedShowDialogueOptions): Promise<T> {
    let i = 0;
    for (;;) {
      const response = await showable.show(options.player);
      if (response.canceled && response.cancelationReason === FormCancelationReason.UserBusy) {
        if (i < options.busyRetriesCount) {
          i++;
          await asyncWait(options.busyRetriesTick);
          if (options.player.isValid()) {
            continue;
          }
        }
      }

      return response;
    }
  }

  private lockPlayerCamera(options: ResolvedShowDialogueOptions) {
    options.player.runCommand(`inputpermission set "${options.player.name}" camera disabled`);
    options.player.runCommand(`inputpermission set "${options.player.name}" movement disabled`);
  }

  private unlockPlayerCamera(options: ResolvedShowDialogueOptions) {
    options.player.runCommand(`inputpermission set "${options.player.name}" camera enabled`);
    options.player.runCommand(`inputpermission set "${options.player.name}" movement enabled`);
  }

  private resolveShowDialogueOptions(options: ShowDialogueOptions): ResolvedShowDialogueOptions {
    return {
      ...DefaultShowDialogOptions,
      ...options,
    };
  }

  protected abstract getShowable(options: ResolvedShowDialogueOptions): Showable<FormResponse>;
  protected abstract processResponse(response: FormResponse, options: ResolvedShowDialogueOptions): Promise<T>;
}

/**
 * Base class for script dialogue responses
 *
 * @category Responses
 */
export abstract class ScriptDialogueResponse {}

/**
 * Dialogue response when the script dialogue was canceled.
 *
 * Typically this happens if the player was busy when trying to open the script dialogue or if the user
 * pressed the close button (x).
 *
 * Valid reasons can be seen in {@link @minecraft/server-ui!FormCancelationReason FormCancelationReason}
 *
 * @category Responses
 */
export class DialogueCanceledResponse extends ScriptDialogueResponse {
  /**
   * Reason the script dialogue was cancel.
   */
  readonly reason: FormCancelationReason;

  /**
   * @internal
   */
  constructor(reason: FormCancelationReason) {
    super();
    this.reason = reason;
  }
}

/**
 * Dialogue response when the script dialogue was rejected, throwing an exception.
 *
 * Reasons can be seen in {@link @minecraft/server-ui!FormRejectReason FormRejectReason} if any reason could be
 * determined.
 *
 * Known reasons can be seen in {@link @minecraft/server-ui!FormRejectReason FormRejectReason}
 * @category Responses
 */
export class DialogueRejectedResponse extends ScriptDialogueResponse {
  /**
   * Reason the script dialogue was rejected if there was any, else the {@link exception} needs to be checked
   * to further determine what was the error.
   */
  readonly reason?: FormRejectReason;
  /**
   * Exception that was throw to rejected the script dialogue.
   */
  readonly exception: unknown;

  /**
   * @internal
   */
  constructor(reason: FormRejectReason | undefined, exception: unknown) {
    super();
    this.reason = reason;
    this.exception = exception;
  }
}

/**
 * Response for button script dialogues.
 *
 * Contains the selected button's name.
 *
 * @category Responses
 * @category Dual button script dialogue
 * @category Multi button script dialogue
 */
export class ButtonDialogueResponse<T extends string, CallbackResponse> extends ScriptDialogueResponse {
  /**
   * Selected button's name.
   *
   * @see {@link DualButton#name}
   * @see {@link MultiButton#name}
   */
  readonly selected: T;

  readonly callback?: CallbackResponse;

  /**
   * @internal
   */
  constructor(selected: T, callback?: CallbackResponse) {
    super();
    this.selected = selected;
    this.callback = callback;
  }
}

export class MissingButtonsException extends Error {
  constructor() {
    super('Missing buttons');
  }
}
