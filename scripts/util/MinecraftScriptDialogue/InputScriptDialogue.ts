import { ResolvedShowDialogueOptions, ScriptDialogue, ScriptDialogueString, Showable } from './ScriptDialogue';
import { ModalFormData, ModalFormResponse } from '@minecraft/server-ui';

/**
 * Type for each input's value.
 *
 * @category Input script dialogue
 */
export type InputValue = string | number | boolean;

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
export const inputScriptDialogue = (title: ScriptDialogueString) => {
  return new InputScriptDialogue<never>(title, []);
};

/**
 * Creates a new dropdown element to use in a input script dialogue.
 *
 * @category Input script dialogue
 * @param name
 * @param label
 */
export const inputDropdown = <K extends string>(name: K, label: ScriptDialogueString) => {
  return new InputDropdown<K>(name, label, [], 0);
};

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
export const inputSlider = <K extends string>(
  name: K,
  label: ScriptDialogueString,
  minimumValue: number,
  maximumValue: number,
  valueStep: number,
  defaultValue?: number
) => {
  return new InputSlider<K>(name, label, minimumValue, maximumValue, valueStep, defaultValue);
};

/**
 * Creates a new text field element to use in a input script dialogue.
 *
 * @category Input script dialogue
 * @param name
 * @param label
 * @param placeholderText
 * @param defaultValue
 */
export const inputText = <K extends string>(
  name: K,
  label: ScriptDialogueString,
  placeholderText: ScriptDialogueString,
  defaultValue?: string
) => {
  return new InputText<K>(name, label, placeholderText, defaultValue);
};

/**
 * Creates a new toggle element to use in a input script dialogue.
 *
 * @category Input script dialogue
 * @param name
 * @param label
 * @param defaultValue
 */
export const inputToggle = <K extends string>(name: K, label: ScriptDialogueString, defaultValue?: boolean) => {
  return new InputToggle<K>(name, label, defaultValue);
};

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
export class InputElement<K extends string> {
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
  constructor(name: K, label: ScriptDialogueString) {
    this.name = name;
    this.label = label;
  }
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
export class InputWithDefaultValue<K extends string, V extends InputValue> extends InputElement<K> {
  /**
   * @internal
   */
  readonly defaultValue: V;

  /**
   * @internal
   */
  constructor(name: K, label: ScriptDialogueString, defaultValue: V) {
    super(name, label);
    this.defaultValue = defaultValue;
  }
}

/**
 * @internal
 */
export class InputDropdownOption {
  readonly label: ScriptDialogueString;
  readonly value: InputValue;

  constructor(label: ScriptDialogueString, value: InputValue) {
    this.label = label;
    this.value = value;
  }
}

/**
 * Input element's representation of a dropdown.
 *
 * Instantiate by using {@link inputDropdown}
 *
 * @category Input script dialogue
 * @see {@link inputDropdown}
 */
export class InputDropdown<K extends string> extends InputElement<K> {
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
  constructor(
    name: K,
    label: ScriptDialogueString,
    options: ReadonlyArray<InputDropdownOption>,
    defaultValueIndex?: number
  ) {
    super(name, label);
    this.defaultValueIndex = defaultValueIndex ?? 0;
    this.options = options;
  }

  /**
   * Sets the default index of the option you would like to use
   * @param defaultValueIndex
   */
  setDefaultValueIndex(defaultValueIndex: number) {
    return new InputDropdown<K>(this.name, this.label, [...this.options], defaultValueIndex);
  }

  /**
   * Adds an option to the dropdown
   * @param label
   * @param value
   */
  addOption(label: ScriptDialogueString, value: InputValue): InputDropdown<K> {
    return new InputDropdown<K>(
      this.name,
      this.label,
      [...this.options, new InputDropdownOption(label, value)],
      this.defaultValueIndex
    );
  }
}

/**
 * Input element's representation of a slider.
 *
 * Instantiate by using {@link inputSlider}
 *
 * @category Input script dialogue
 * @see {@link inputSlider}
 */
export class InputSlider<K extends string> extends InputWithDefaultValue<K, number> {
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
  constructor(
    name: K,
    label: ScriptDialogueString,
    minimumValue: number,
    maximumValue: number,
    valueStep: number,
    defaultValue?: number
  ) {
    super(name, label, defaultValue ?? minimumValue);
    this.minimumValue = minimumValue;
    this.maximumValue = maximumValue;
    this.valueStep = valueStep;
  }
}

/**
 * Input element's representation of text field.
 *
 * Instantiate by using {@link inputText}
 *
 * @category Input script dialogue
 * @see {@link inputText}
 */
export class InputText<K extends string> extends InputWithDefaultValue<K, string> {
  /**
   * @internal
   */
  readonly placeholderText: ScriptDialogueString;

  /**
   * @internal
   */
  constructor(name: K, label: ScriptDialogueString, placeholderText: ScriptDialogueString, defaultValue?: string) {
    super(name, label, defaultValue ?? '');
    this.placeholderText = placeholderText;
  }
}

/**
 * Input element's representation of toggle.
 *
 * Instantiate by using {@link inputToggle}
 *
 * @category Input script dialogue
 * @see {@link inputToggle}
 */
export class InputToggle<K extends string> extends InputWithDefaultValue<K, boolean> {
  /**
   * @internal
   */
  constructor(name: K, label: ScriptDialogueString, defaultValue?: boolean) {
    super(name, label, !!defaultValue);
  }
}

/**
 * Class used to build input script dialogues.
 *
 * Use {@link inputScriptDialogue} to initialize one.
 *
 * @category Input script dialogue
 * @see {@link inputScriptDialogue}
 */
export class InputScriptDialogue<K extends string> extends ScriptDialogue<InputScriptDialogueResponse<K>> {
  private readonly elements: Array<InputElement<K>>;
  private readonly title: ScriptDialogueString;

  /**
   * @internal
   */
  constructor(title: ScriptDialogueString, elements: Array<InputElement<K>>) {
    super();
    this.title = title;
    this.elements = elements;
  }

  /**
   * Adds an input element to the input script dialogue.
   * @param element
   *
   * @see {@link inputDropdown}
   * @see {@link inputSlider}
   * @see {@link inputToggle}
   * @see {@link inputText}
   */
  addElement<KEY extends string>(element: InputElement<KEY>) {
    return new InputScriptDialogue<K | KEY>(this.title, [...this.elements, element]);
  }

  /**
   * Adds multiple input element to the input script dialogue.
   * @param elements
   *
   * @see {@link inputDropdown}
   * @see {@link inputSlider}
   * @see {@link inputToggle}
   * @see {@link inputText}
   */
  addElements<KEY extends string>(elements: Array<InputElement<KEY>>) {
    return new InputScriptDialogue<K | KEY>(this.title, [...this.elements, ...elements]);
  }

  protected getShowable(_options: ResolvedShowDialogueOptions): Showable<ModalFormResponse> {
    if (this.elements.length === 0) {
      throw new MissingElementsError();
    }

    const data = new ModalFormData();

    data.title(this.title);

    this.elements.forEach((element) => {
      if (element instanceof InputDropdown<K>) {
        data.dropdown(
          element.label,
          element.options.map((o) => o.label),
          element.defaultValueIndex
        );
      } else if (element instanceof InputSlider<K>) {
        data.slider(element.label, element.minimumValue, element.maximumValue, element.valueStep, element.defaultValue);
      } else if (element instanceof InputText<K>) {
        data.textField(element.label, element.placeholderText, element.defaultValue);
      } else if (element instanceof InputToggle<K>) {
        data.toggle(element.label, element.defaultValue);
      }
    });

    return data;
  }

  protected async processResponse(
    response: ModalFormResponse,
    _options: ResolvedShowDialogueOptions
  ): Promise<InputScriptDialogueResponse<K>> {
    const formValues = response.formValues ?? this.elements.map((_e) => undefined);

    const values = this.elements.map((element, index) => {
      const name = element.name;
      let value: InputValue = 0;
      const formValue = formValues[index];

      if (element instanceof InputDropdown<K>) {
        value = element.options[element.defaultValueIndex].value;
        if (formValue !== undefined) {
          value = element.options[formValue as number].value;
        }
      } else if (
        element instanceof InputSlider<K> ||
        element instanceof InputText<K> ||
        element instanceof InputToggle<K>
      ) {
        value = element.defaultValue;
        if (formValue !== undefined) {
          value = formValue;
        }
      }

      return {
        [name]: value,
      };
    });

    return new InputScriptDialogueResponse<K>(Object.assign({}, ...values));
  }
}

/**
 * Dialogue response values, each value is indexed by the name of the button.
 * @category Input script dialogue
 */
export type InputScriptDialogueResponseValues<K extends string> = {
  [key in K]: InputValue;
};

/**
 * Script dialogue response from a input script dialogue.
 * Holds a map with the values used by each of the element's name.
 *
 * @category Input script dialogue
 * @category Responses
 */
export class InputScriptDialogueResponse<K extends string> {
  /**
   * Map with the values of the script dialogue..
   */
  readonly values: InputScriptDialogueResponseValues<K>;

  constructor(values: InputScriptDialogueResponseValues<K>) {
    this.values = values;
  }
}

export class MissingElementsError extends Error {
  constructor() {
    super('Missing input elements');
  }
}
