import { useState } from 'react';
import { getDiabetesRisk } from '../utils/predictDiabetes';

const fields = [
  { name: 'glucose', label: 'Glucose (mg/dL)', placeholder: 'e.g. 120', min: 0, max: 300, step: 1 },
  { name: 'bloodPressure', label: 'Blood Pressure (mm Hg)', placeholder: 'e.g. 72', min: 0, max: 200, step: 1 },
  { name: 'skinThickness', label: 'Skinfold Thickness (mm)', placeholder: 'e.g. 25', min: 0, max: 100, step: 1 },
  { name: 'insulin', label: 'Insulin (mu U/mL)', placeholder: 'e.g. 80', min: 0, max: 900, step: 1 },
  { name: 'bmi', label: 'BMI (kg/m²)', placeholder: 'e.g. 30.5', min: 0, max: 80, step: 0.1 },
  { name: 'diabetesPedigree', label: 'Diabetes Pedigree Function', placeholder: 'e.g. 0.5', min: 0, max: 2.5, step: 0.001 },
  { name: 'age', label: 'Age (years)', placeholder: 'e.g. 45', min: 0, max: 120, step: 1 },
];

const initialFormData = Object.fromEntries(fields.map((f) => [f.name, '']));

function RiskForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    for (const field of fields) {
      const raw = formData[field.name];
      if (raw === '') {
        newErrors[field.name] = `${field.label} is required`;
        continue;
      }
      const num = Number(raw);
      if (Number.isNaN(num)) {
        newErrors[field.name] = 'Must be a number';
      } else if (num < field.min || num > field.max) {
        newErrors[field.name] = `Must be between ${field.min} and ${field.max}`;
      }
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }
    setErrors({});
    const prediction = getDiabetesRisk({
      Glucose: Number(formData.glucose),
      BloodPressure: Number(formData.bloodPressure),
      SkinThickness: Number(formData.skinThickness),
      Insulin: Number(formData.insulin),
      BMI: Number(formData.bmi),
      DiabetesPedigreeFunction: Number(formData.diabetesPedigree),
      Age: Number(formData.age),
    });
    setResult(prediction);
  };

  const isHighRisk = result === 'High Risk';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
          <svg
            className="w-8 h-8 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Diabetes Risk Predictor
        </h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          Enter your health information below to get an estimate of your diabetes
          risk. This tool uses key health indicators to provide a quick
          assessment.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
              </label>
              <input
                type="number"
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step}
                className={`w-full rounded-lg border px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 transition ${
                  errors[field.name]
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'
                }`}
              />
              {errors[field.name] && (
                <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          Predict Risk
        </button>

        {/* Result */}
        {result && (
          <div
            className={`mt-4 rounded-lg p-4 text-center text-lg font-semibold ${
              isHighRisk
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {isHighRisk ? '⚠️' : '✅'} Prediction: {result}
          </div>
        )}
      </form>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        This tool is for educational purposes only and is not a substitute for
        professional medical advice.
      </p>
    </div>
  );
}

export default RiskForm;
