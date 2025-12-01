/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type SantaLocationCreateFormInputValues = {
    lat?: number;
    lng?: number;
    date?: string;
    sort?: string;
};
export declare type SantaLocationCreateFormValidationValues = {
    lat?: ValidationFunction<number>;
    lng?: ValidationFunction<number>;
    date?: ValidationFunction<string>;
    sort?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SantaLocationCreateFormOverridesProps = {
    SantaLocationCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    lat?: PrimitiveOverrideProps<TextFieldProps>;
    lng?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    sort?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SantaLocationCreateFormProps = React.PropsWithChildren<{
    overrides?: SantaLocationCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: SantaLocationCreateFormInputValues) => SantaLocationCreateFormInputValues;
    onSuccess?: (fields: SantaLocationCreateFormInputValues) => void;
    onError?: (fields: SantaLocationCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SantaLocationCreateFormInputValues) => SantaLocationCreateFormInputValues;
    onValidate?: SantaLocationCreateFormValidationValues;
} & React.CSSProperties>;
export default function SantaLocationCreateForm(props: SantaLocationCreateFormProps): React.ReactElement;
