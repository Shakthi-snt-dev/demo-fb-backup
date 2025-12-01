declare module 'react-select' {
  import { ComponentType, ReactNode } from 'react';

  export interface OptionTypeBase {
    [key: string]: any;
  }

  export interface ActionMeta<OptionType extends OptionTypeBase> {
    action: 'select-option' | 'deselect-option' | 'remove-value' | 'pop-value' | 'set-value' | 'clear' | 'create-option';
    name?: string;
    option?: OptionType | null;
    removedValue?: OptionType;
    removedValues?: OptionType[] | readonly OptionType[];
  }

  export type SingleValue<OptionType extends OptionTypeBase> = OptionType | null;
  export type MultiValue<OptionType extends OptionTypeBase> = OptionType[];

  export interface StylesConfig<OptionType extends OptionTypeBase = any> {
    [key: string]: any;
  }

  export interface Props<OptionType extends OptionTypeBase = any> {
    options?: OptionType[];
    value?: SingleValue<OptionType> | MultiValue<OptionType>;
    onChange?: (newValue: SingleValue<OptionType> | MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
    isClearable?: boolean;
    isSearchable?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    placeholder?: string;
    formatCreateLabel?: (inputValue: string) => string;
    createOptionPosition?: 'first' | 'last';
    styles?: StylesConfig<OptionType>;
    className?: string;
    classNamePrefix?: string;
    [key: string]: any;
  }

  export default function Select<OptionType extends OptionTypeBase = any>(
    props: Props<OptionType>
  ): JSX.Element;
}

declare module 'react-select/creatable' {
  import { ComponentType } from 'react';
  import type { ActionMeta, SingleValue, MultiValue, OptionTypeBase, StylesConfig } from 'react-select';

  export interface CreatableProps<OptionType extends OptionTypeBase = any> {
    options?: OptionType[];
    value?: SingleValue<OptionType> | MultiValue<OptionType>;
    onChange?: (newValue: SingleValue<OptionType> | MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
    isClearable?: boolean;
    isSearchable?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    placeholder?: string;
    formatCreateLabel?: (inputValue: string) => string;
    createOptionPosition?: 'first' | 'last';
    styles?: StylesConfig<OptionType>;
    className?: string;
    classNamePrefix?: string;
    [key: string]: any;
  }

  export default function CreatableSelect<OptionType extends OptionTypeBase = any>(
    props: CreatableProps<OptionType>
  ): JSX.Element;
}

