import React, { createContext, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Label } from './Label';
import { colors } from '../../theme/colors';

interface FormContextValue {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const FormContext = createContext<FormContextValue | null>(null);

interface FormProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  errors = {},
  touched = {},
}) => {
  return (
    <FormContext.Provider value={{ errors, touched }}>
      <View style={styles.form}>{children}</View>
    </FormContext.Provider>
  );
};

interface FormItemProps {
  children: React.ReactNode;
  name?: string;
}

export const FormItem: React.FC<FormItemProps> = ({ children, name }) => {
  const context = useContext(FormContext);
  const error = name && context?.errors[name];
  const touched = name && context?.touched[name];

  return (
    <View style={styles.formItem}>
      {children}
      {error && touched && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

interface FormLabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({ children, required }) => {
  return <Label required={required}>{children}</Label>;
};

interface FormDescriptionProps {
  children: React.ReactNode;
}

export const FormDescription: React.FC<FormDescriptionProps> = ({
  children,
}) => {
  return <Text style={styles.description}>{children}</Text>;
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  formItem: {
    marginBottom: 16,
  },
  errorText: {
    color: colors.destructive,
    fontSize: 12,
    marginTop: 4,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: 14,
    marginTop: 4,
  },
});

