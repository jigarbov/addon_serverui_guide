import { Player, RawMessage } from "@minecraft/server";
import { FormCancelationReason, FormRejectReason, FormResponse, MessageFormResponse, ActionFormResponse, ModalFormResponse } from "@minecraft/server-ui";
interface Showable<T> {
    show(player: Player): Promise<T>;
}
/**
 * Displayed text in dialogues - can be a string or a RawMessage used for translations
 *
 * @category Script dialogue
 */
type ScriptDialogueString = string | RawMessage;
interface OptionalShowDialogueOptions {
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
interface ShowDialogueOptions extends Partial<OptionalShowDialogueOptions>, RequiredShowDialogueOptions {
}
interface ResolvedShowDialogueOptions extends RequiredShowDialogueOptions, OptionalShowDialogueOptions {
}
/**
 * Base class for all the script dialogues
 *
 * @category Script dialogue
 */
declare abstract class ScriptDialogue<T extends ScriptDialogueResponse> {
    protected constructor();
    /**
     * Opens the script dialogue. It requires the {@link ShowDialogueOptions#player player} as one of the options.
     *
     * You can configure displaying features by setting the optional values in the {@link ShowDialogueOptions options}
     * @param options used to configure what and how to display the script dialogue.
     *
     * @see {@link ShowDialogueOptions}
     */
    open(options: ShowDialogueOptions): Promise<T | DialogueCanceledResponse | DialogueRejectedResponse>;
    private show;
    private lockPlayerCamera;
    private unlockPlayerCamera;
    private resolveShowDialogueOptions;
    protected abstract getShowable(options: ResolvedShowDialogueOptions): Showable<FormResponse>;
    protected abstract processResponse(response: FormResponse, options: ResolvedShowDialogueOptions): Promise<T>;
}
/**
 * Base class for script dialogue responses
 *
 * @category Responses
 */
declare abstract class ScriptDialogueResponse {
}
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
declare class DialogueCanceledResponse extends ScriptDialogueResponse {
    /**
     * Reason the script dialogue was cancel.
     */
    readonly reason: FormCancelationReason;
    /**
     * @internal
     */
    constructor(reason: FormCancelationReason);
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
declare class DialogueRejectedResponse extends ScriptDialogueResponse {
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
    constructor(reason: FormRejectReason | undefined, exception: unknown);
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
declare class ButtonDialogueResponse<T extends string, CallbackResponse> extends ScriptDialogueResponse {
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
    constructor(selected: T, callback?: CallbackResponse);
}
declare class MissingButtonsException extends Error {
    constructor();
}
/**
 * Dual button content.
 *
 * Note that dual buttons do not allow an icon to be used
 * @category Dual button script dialogue
 */
interface DualButton<T extends string, CallbackResponse> {
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
declare const dualButtonScriptDialogue: <T extends string, TopCallbackResponse = undefined, BottomCallbackResponse = undefined>(title: ScriptDialogueString, topButton: DualButton<T, TopCallbackResponse>, bottomButton: DualButton<T, BottomCallbackResponse>) => DualButtonScriptDialogue<T, TopCallbackResponse, BottomCallbackResponse>;
/**
 * Dual button script dialogue class.
 *
 * User's don't need to instantiate this class directly, instead they can use {@link dualButtonScriptDialogue}.
 *
 * Allows the users to optionally set a value for the body by calling {@link DualButtonScriptDialogue#setBody setBody}.
 *
 * @category Dual button script dialogue
 */
declare class DualButtonScriptDialogue<T extends string, TopCallbackResponse, BottomCallbackResponse> extends ScriptDialogue<ButtonDialogueResponse<T, TopCallbackResponse | BottomCallbackResponse>> {
    private readonly title;
    private readonly body?;
    private readonly topButton;
    private readonly bottomButton;
    /**
     * @internal
     */
    constructor(title: ScriptDialogueString, body: ScriptDialogueString | undefined, topButton: DualButton<T, TopCallbackResponse>, bottomButton: DualButton<T, BottomCallbackResponse>);
    /**
     * Sets content of the script dialogue
     * @param body
     */
    setBody(body: ScriptDialogueString): DualButtonScriptDialogue<T, TopCallbackResponse, BottomCallbackResponse>;
    protected getShowable(_options: ResolvedShowDialogueOptions): Showable<MessageFormResponse>;
    protected processResponse(response: MessageFormResponse, _options: ResolvedShowDialogueOptions): Promise<ButtonDialogueResponse<T, TopCallbackResponse | BottomCallbackResponse>>;
}
/**
 * Initializes a empty multi button script dialogue.
 *
 * Buttons needs to be added using {@link MultiButtonDialogue#addButton} or {@link MultiButtonDialogue#addButtons}
 *
 * @category Creation
 * @category Multi button script dialogue
 * @param title
 */
declare const multiButtonScriptDialogue: (title: ScriptDialogueString) => MultiButtonDialogue<never, never>;
/**
 * Multi button content.
 * @category Multi button script dialogue
 */
interface MultiButton<T extends string, Callback> {
    /**
     * Name used by the button, response is recorded using this name
     */
    name: T;
    /**
     * Displayed button's value
     */
    text: ScriptDialogueString;
    /**
     * Path to an icon used for the icon
     */
    iconPath?: string;
    /**
     * A function that is executed when the button is pressed.
     * This function is executed before returning from {@link MultiButtonDialogue#open}.
     * @param selected
     */
    callback?: (selected: string) => Promise<Callback>;
}
/**
 * Class used to build multi button script dialogues.
 *
 * Use {@link multiButtonScriptDialogue} to initialize one.
 *
 * @category Multi button script dialogue
 * @see {@link multiButtonScriptDialogue}
 */
declare class MultiButtonDialogue<T extends string, Callback = undefined> extends ScriptDialogue<ButtonDialogueResponse<T, Callback>> {
    private readonly title;
    private readonly body?;
    private readonly buttons;
    /**
     * @internal
     */
    constructor(title: ScriptDialogueString, body: ScriptDialogueString | undefined, buttons: Array<MultiButton<T, Callback>>);
    /**
     * Sets the content body of the multi button dialogue
     * @param body
     */
    setBody(body: ScriptDialogueString): MultiButtonDialogue<T, Callback>;
    /**
     * Adds a button to the multi button script dialogue.
     * @param name name of the button
     * @param text content of the button
     * @param iconPath path to an icon to show in the button
     */
    addButton<NAME extends string, ButtonCallback = undefined>(name: NAME, text: ScriptDialogueString, iconPath?: string, callback?: (selected: string) => Promise<ButtonCallback>): MultiButtonDialogue<NonNullable<T | NAME>, Callback | ButtonCallback>;
    /**
     * Adds multiple buttons to the multi button script dialogue.
     * @param buttons array of buttons
     */
    addButtons<NAMES extends string, ButtonCallback = undefined>(buttons: Array<MultiButton<NAMES, ButtonCallback>>): MultiButtonDialogue<NonNullable<T | NAMES>, Callback | ButtonCallback>;
    protected getShowable(_options: ResolvedShowDialogueOptions): Showable<ActionFormResponse>;
    protected processResponse(response: ActionFormResponse, _options: ResolvedShowDialogueOptions): Promise<ButtonDialogueResponse<T, Callback>>;
}
/**
 * Type for each input's value.
 *
 * @category Input script dialogue
 */
type InputValue = string | number | boolean;
/**
 * Initializes a empty input script dialogue.
 *
 * Elements needs to be added using {@link InputScriptDialogue#addElement} or {@link InputScriptDialogue#addElements}
 *
 * @category Creation
 * @category Input script dialogue
 *
 * @param title Title for the script dialogue
 */
declare const inputScriptDialogue: (title: ScriptDialogueString) => InputScriptDialogue<never>;
/**
 * Creates a new dropdown element to use in a input script dialogue.
 *
 * @category Input script dialogue
 * @param name
 * @param label
 */
declare const inputDropdown: <K extends string>(name: K, label: ScriptDialogueString) => InputDropdown<K>;
/**
 * Creates a new slider element to use in a input script dialogue.
 *
 * @category Input script dialogue
 * @param name
 * @param label
 * @param minimumValue
 * @param maximumValue
 * @param valueStep
 * @param defaultValue
 */
declare const inputSlider: <K extends string>(name: K, label: ScriptDialogueString, minimumValue: number, maximumValue: number, valueStep: number, defaultValue?: number) => InputSlider<K>;
/**
 * Creates a new text field element to use in a input script dialogue.
 *
 * @category Input script dialogue
 * @param name
 * @param label
 * @param placeholderText
 * @param defaultValue
 */
declare const inputText: <K extends string>(name: K, label: ScriptDialogueString, placeholderText: ScriptDialogueString, defaultValue?: string) => InputText<K>;
/**
 * Creates a new toggle element to use in a input script dialogue.
 *
 * @category Input script dialogue
 * @param name
 * @param label
 * @param defaultValue
 */
declare const inputToggle: <K extends string>(name: K, label: ScriptDialogueString, defaultValue?: boolean) => InputToggle<K>;
/**
 * Base for all input elements displayed in the input script dialogue.
 *
 * You don't need to instantiate this class directly, instead you can use any of the builder function
 * depending the type you want to use.
 *
 * @category Input script dialogue
 * @see {@link inputDropdown}
 * @see {@link inputSlider}
 * @see {@link inputToggle}
 * @see {@link inputText}
 */
declare class InputElement<K extends string> {
    /**
     * @internal
     */
    readonly name: K;
    /**
     * @internal
     */
    readonly label: ScriptDialogueString;
    /**
     * @internal
     */
    constructor(name: K, label: ScriptDialogueString);
}
/**
 * Base for all input elements that have a fixed default value.
 *
 * You don't need to instantiate this class directly, instead you can use any of the builder function
 * depending the type you want to use.
 *
 * @category Input script dialogue
 * @see {@link inputDropdown}
 * @see {@link inputSlider}
 * @see {@link inputToggle}
 * @see {@link inputText}
 */
declare class InputWithDefaultValue<K extends string, V extends InputValue> extends InputElement<K> {
    /**
     * @internal
     */
    readonly defaultValue: V;
    /**
     * @internal
     */
    constructor(name: K, label: ScriptDialogueString, defaultValue: V);
}
/**
 * @internal
 */
declare class InputDropdownOption {
    readonly label: ScriptDialogueString;
    readonly value: InputValue;
    constructor(label: ScriptDialogueString, value: InputValue);
}
/**
 * Input element's representation of a dropdown.
 *
 * Instantiate by using {@link inputDropdown}
 *
 * @category Input script dialogue
 * @see {@link inputDropdown}
 */
declare class InputDropdown<K extends string> extends InputElement<K> {
    /**
     * @internal
     */
    readonly options: ReadonlyArray<InputDropdownOption>;
    /**
     * @internal
     */
    readonly defaultValueIndex: number;
    /**
     * @internal
     */
    constructor(name: K, label: ScriptDialogueString, options: ReadonlyArray<InputDropdownOption>, defaultValueIndex?: number);
    /**
     * Sets the default index of the option you would like to use
     * @param defaultValueIndex
     */
    setDefaultValueIndex(defaultValueIndex: number): InputDropdown<K>;
    /**
     * Adds an option to the dropdown
     * @param label
     * @param value
     */
    addOption(label: ScriptDialogueString, value: InputValue): InputDropdown<K>;
}
/**
 * Input element's representation of a slider.
 *
 * Instantiate by using {@link inputSlider}
 *
 * @category Input script dialogue
 * @see {@link inputSlider}
 */
declare class InputSlider<K extends string> extends InputWithDefaultValue<K, number> {
    /**
     * @internal
     */
    readonly minimumValue: number;
    /**
     * @internal
     */
    readonly maximumValue: number;
    /**
     * @internal
     */
    readonly valueStep: number;
    /**
     * @internal
     */
    constructor(name: K, label: ScriptDialogueString, minimumValue: number, maximumValue: number, valueStep: number, defaultValue?: number);
}
/**
 * Input element's representation of text field.
 *
 * Instantiate by using {@link inputText}
 *
 * @category Input script dialogue
 * @see {@link inputText}
 */
declare class InputText<K extends string> extends InputWithDefaultValue<K, string> {
    /**
     * @internal
     */
    readonly placeholderText: ScriptDialogueString;
    /**
     * @internal
     */
    constructor(name: K, label: ScriptDialogueString, placeholderText: ScriptDialogueString, defaultValue?: string);
}
/**
 * Input element's representation of toggle.
 *
 * Instantiate by using {@link inputToggle}
 *
 * @category Input script dialogue
 * @see {@link inputToggle}
 */
declare class InputToggle<K extends string> extends InputWithDefaultValue<K, boolean> {
    /**
     * @internal
     */
    constructor(name: K, label: ScriptDialogueString, defaultValue?: boolean);
}
/**
 * Class used to build input script dialogues.
 *
 * Use {@link inputScriptDialogue} to initialize one.
 *
 * @category Input script dialogue
 * @see {@link inputScriptDialogue}
 */
declare class InputScriptDialogue<K extends string> extends ScriptDialogue<InputScriptDialogueResponse<K>> {
    private readonly elements;
    private readonly title;
    /**
     * @internal
     */
    constructor(title: ScriptDialogueString, elements: Array<InputElement<K>>);
    /**
     * Adds an input element to the input script dialogue.
     * @param element
     *
     * @see {@link inputDropdown}
     * @see {@link inputSlider}
     * @see {@link inputToggle}
     * @see {@link inputText}
     */
    addElement<KEY extends string>(element: InputElement<KEY>): InputScriptDialogue<K | KEY>;
    /**
     * Adds multiple input element to the input script dialogue.
     * @param elements
     *
     * @see {@link inputDropdown}
     * @see {@link inputSlider}
     * @see {@link inputToggle}
     * @see {@link inputText}
     */
    addElements<KEY extends string>(elements: Array<InputElement<KEY>>): InputScriptDialogue<K | KEY>;
    protected getShowable(_options: ResolvedShowDialogueOptions): Showable<ModalFormResponse>;
    protected processResponse(response: ModalFormResponse, _options: ResolvedShowDialogueOptions): Promise<InputScriptDialogueResponse<K>>;
}
/**
 * Dialogue response values, each value is indexed by the name of the button.
 * @category Input script dialogue
 */
type InputScriptDialogueResponseValues<K extends string> = {
    [key in K]: InputValue;
};
/**
 * Script dialogue response from a input script dialogue.
 * Holds a map with the values used by each of the element's name.
 *
 * @category Input script dialogue
 * @category Responses
 */
declare class InputScriptDialogueResponse<K extends string> {
    /**
     * Map with the values of the script dialogue..
     */
    readonly values: InputScriptDialogueResponseValues<K>;
    constructor(values: InputScriptDialogueResponseValues<K>);
}
declare class MissingElementsError extends Error {
    constructor();
}
/**
 * Translation helper to make it easier to define a RawMessage with
 * translated text.
 *
 * @category Helpers
 * @param translate
 * @param with_
 * @constructor
 */
interface TranslateType {
    (translate: string, with_: RawMessage): RawMessage;
    (translate: string, ...with_: Array<string>): RawMessage;
}
declare const TRANSLATE: TranslateType;
export { dualButtonScriptDialogue, DualButtonScriptDialogue, multiButtonScriptDialogue, MultiButtonDialogue, inputText, inputToggle, inputSlider, inputDropdown, inputScriptDialogue, InputScriptDialogueResponse, MissingElementsError, ButtonDialogueResponse, ScriptDialogueResponse, ScriptDialogue, DialogueCanceledResponse, DialogueRejectedResponse, ShowDialogueOptions, ScriptDialogueString, MissingButtonsException, TRANSLATE };
export type { DualButton, MultiButton, InputElement, InputWithDefaultValue, InputText, InputToggle, InputSlider, InputDropdown, InputDropdownOption, InputScriptDialogue, InputValue, InputScriptDialogueResponseValues };
