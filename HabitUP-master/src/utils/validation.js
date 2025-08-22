// Common validation rules
const rules = {
  required: (value) => ({
    isValid: value !== undefined && value !== null && value !== '',
    message: 'This field is required'
  }),

  email: (value) => ({
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  }),

  phone: (value) => ({
    isValid: /^\+?[\d\s-]{10,}$/.test(value),
    message: 'Please enter a valid phone number'
  }),

  minLength: (length) => (value) => ({
    isValid: value.length >= length,
    message: `Must be at least ${length} characters`
  }),

  maxLength: (length) => (value) => ({
    isValid: value.length <= length,
    message: `Must be no more than ${length} characters`
  }),

  number: (value) => ({
    isValid: !isNaN(value) && value !== '',
    message: 'Please enter a valid number'
  }),

  min: (min) => (value) => ({
    isValid: Number(value) >= min,
    message: `Must be at least ${min}`
  }),

  max: (max) => (value) => ({
    isValid: Number(value) <= max,
    message: `Must be no more than ${max}`
  })
};

// Validate a single field
export const validateField = (value, fieldRules) => {
  for (const rule of fieldRules) {
    const validation = typeof rule === 'function' ? rule(value) : rules[rule](value);
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true };
};

// Validate an entire form
export const validateForm = (values, formRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(formRules).forEach(field => {
    const fieldRules = formRules[field];
    const validation = validateField(values[field], fieldRules);

    if (!validation.isValid) {
      errors[field] = validation.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Create form validation rules
export const createFormValidation = (rules) => {
  return (values) => validateForm(values, rules);
};

// Example usage:
export const doctorProfileValidation = createFormValidation({
  fullName: [rules.required, rules.minLength(2)],
  email: [rules.required, rules.email],
  phone: [rules.required, rules.phone],
  specialization: [rules.required],
  experience: [rules.required, rules.number, rules.min(0)],
  qualification: [rules.required],
  bio: [rules.required, rules.minLength(50)],
  availability: [rules.required],
  consultationFee: [rules.required, rules.number, rules.min(0)]
});

export const patientProfileValidation = createFormValidation({
  fullName: [rules.required, rules.minLength(2)],
  email: [rules.required, rules.email],
  phone: [rules.required, rules.phone],
  age: [rules.required, rules.number, rules.min(0), rules.max(150)],
  medicalHistory: [rules.required, rules.minLength(20)]
});
