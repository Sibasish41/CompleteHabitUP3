import { useState, useCallback } from 'react';
import { validateForm } from './validation';
import { toast } from 'react-toastify';

export const useForm = (initialValues = {}, validationRules = null, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate single field on blur if validation rules exist
    if (validationRules && validationRules[name]) {
      const fieldValidation = validateForm({ [name]: values[name] }, { [name]: validationRules[name] });
      if (!fieldValidation.isValid) {
        setErrors(prev => ({ ...prev, ...fieldValidation.errors }));
      }
    }
  }, [values, validationRules]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate all fields if validation rules exist
    if (validationRules) {
      const validation = validateForm(values, validationRules);
      if (!validation.isValid) {
        setErrors(validation.errors);
        // Show first error in toast
        const firstError = Object.values(validation.errors)[0];
        toast.error(firstError);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      // Clear errors on successful submission
      setErrors({});
    } catch (error) {
      // Handle submission error
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationRules, onSubmit]);

  // Set multiple values at once
  const setMultipleValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Check if a field should show error
  const shouldShowError = useCallback((fieldName) => {
    return touched[fieldName] && errors[fieldName];
  }, [touched, errors]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues: setMultipleValues,
    reset,
    shouldShowError
  };
};
