type BaseField = {
  label: string;
  name: string;
};

type TextField = BaseField & {
  type: 'text' | 'email' | 'number' | 'password';
  value: string;
  onChange: (value: string) => void;
};

type CheckboxField = BaseField & {
  type: 'checkbox';
  value: boolean;
  onChange: (checked: boolean) => void;
};

export type FieldType = TextField | CheckboxField;
