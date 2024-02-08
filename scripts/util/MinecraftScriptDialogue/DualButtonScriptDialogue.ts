import {
  ButtonDialogueResponse,
  ResolvedShowDialogueOptions,
  ScriptDialogue,
  ScriptDialogueString,
  Showable,
} from './ScriptDialogue';
import { MessageFormData, MessageFormResponse } from '@minecraft/server-ui';

/**
 * Dual button content.
 *
 * Note that dual buttons do not allow an icon to be used
 * @category Dual button script dialogue
 */
export interface DualButton<T extends string, CallbackResponse> {
  /**
   * Name used by the button, response is recorded using this name
   */
  name: T;
  /**
   * Displayed button's value
   */
  text: ScriptDialogueString;

  /**
   * A function that is executed when the button is pressed.
   * This function is executed before returning from {@link DualButtonScriptDialogue#open}.
   * @param selected
   */
  callback?: (selected: string) => Promise<CallbackResponse>;
}

/**
 * Creates a new dual button script dialogue
 *
 * @category Creation
 * @category Dual button script dialogue
 * @param title Title of the dual button script dialogue
 * @param topButton Contents of the top button
 * @param bottomButton Contents of the bottom button
 */
export const dualButtonScriptDialogue = <
  T extends string,
  TopCallbackResponse = undefined,
  BottomCallbackResponse = undefined,
>(
  title: ScriptDialogueString,
  topButton: DualButton<T, TopCallbackResponse>,
  bottomButton: DualButton<T, BottomCallbackResponse>
) => {
  return new DualButtonScriptDialogue(title, undefined, topButton, bottomButton);
};

/**
 * Dual button script dialogue class.
 *
 * User's don't need to instantiate this class directly, instead they can use {@link dualButtonScriptDialogue}.
 *
 * Allows the users to optionally set a value for the body by calling {@link DualButtonScriptDialogue#setBody setBody}.
 *
 * @category Dual button script dialogue
 */
export class DualButtonScriptDialogue<
  T extends string,
  TopCallbackResponse,
  BottomCallbackResponse,
> extends ScriptDialogue<ButtonDialogueResponse<T, TopCallbackResponse | BottomCallbackResponse>> {
  private readonly title: ScriptDialogueString;
  private readonly body?: ScriptDialogueString;
  private readonly topButton: DualButton<T, TopCallbackResponse>;
  private readonly bottomButton: DualButton<T, BottomCallbackResponse>;

  /**
   * @internal
   */
  constructor(
    title: ScriptDialogueString,
    body: ScriptDialogueString | undefined,
    topButton: DualButton<T, TopCallbackResponse>,
    bottomButton: DualButton<T, BottomCallbackResponse>
  ) {
    super();
    this.title = title;
    this.body = body;
    this.topButton = topButton;
    this.bottomButton = bottomButton;
  }

  /**
   * Sets content of the script dialogue
   * @param body
   */
  setBody(body: ScriptDialogueString) {
    return new DualButtonScriptDialogue(this.title, body, this.topButton, this.bottomButton);
  }

  protected getShowable(_options: ResolvedShowDialogueOptions): Showable<MessageFormResponse> {
    const data = new MessageFormData();
    data.title(this.title);
    if (this.body) {
      data.body(this.body);
    }

    data.button1(this.bottomButton.text);
    data.button2(this.topButton.text);

    return data;
  }

  protected async processResponse(response: MessageFormResponse, _options: ResolvedShowDialogueOptions) {
    const selectedButton = response.selection === 0 ? this.bottomButton : this.topButton;
    let callbackResponse: TopCallbackResponse | BottomCallbackResponse | undefined = undefined;
    if (selectedButton.callback) {
      callbackResponse = await selectedButton.callback(selectedButton.name);
    }
    return new ButtonDialogueResponse(selectedButton.name, callbackResponse);
  }
}
