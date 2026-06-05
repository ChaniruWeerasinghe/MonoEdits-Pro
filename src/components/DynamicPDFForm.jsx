import React, { useState, useRef, useEffect } from 'react';

const cleanPdfString = (str) => {
  if (typeof str !== 'string') return str;
  if (str.startsWith('\\376\\377')) {
    return str.replace(/\\376\\377/g, '').replace(/\\000/g, '');
  }
  return str;
};

const formatLabel = (name) => {
  const cleaned = cleanPdfString(name);
  return cleaned
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const validateField = (name, value) => {
  const lowerName = name.toLowerCase();
  if (value === undefined || value === null || value === '') return null;
  
  if (lowerName.includes('email')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address.';
  }
  
  if (lowerName.includes('phone') || lowerName.includes('mobile') || lowerName.includes('tel')) {
    const slPhoneRegex = /^(?:\+94|0)?\d{9}$/;
    const foreignPhoneRegex = /^\+?\d{7,15}$/;
    const stripped = value.replace(/\s+/g, '');
    if (!slPhoneRegex.test(stripped) && !foreignPhoneRegex.test(stripped)) {
      return 'Please enter a valid phone number.';
    }
  }

  if (lowerName.includes('name') || lowerName.includes('first') || lowerName.includes('last')) {
    if (/\d/.test(value)) return 'Name cannot contain numbers.';
  }
  return null;
};

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDisplay = value ? cleanPdfString(value) : placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-100 dark:bg-slate-800/80 border ${isOpen ? 'border-teal-500 ring-2 ring-teal-500/20 bg-white dark:bg-slate-800' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-400'} text-slate-800 dark:text-slate-100 rounded-xl cursor-pointer flex justify-between items-center transition-all shadow-sm`}
        style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '16px', paddingBottom: '16px' }}
      >
        <span className={value ? 'text-slate-800 dark:text-slate-100 font-medium' : 'text-slate-500 dark:text-slate-400'}>{selectedDisplay}</span>
        <svg className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-teal-500' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg overflow-hidden backdrop-blur-xl animate-fadein">
          <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
            {options.map((opt) => (
              <div 
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-4 py-3 rounded-lg cursor-pointer transition-all flex items-center justify-between ${value === opt ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {cleanPdfString(opt)}
                {value === opt && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function DynamicPDFForm({ fields, formData, onChange }) {
  const [errors, setErrors] = useState({});

  if (!fields || fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center w-full">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-400 dark:text-slate-500 mb-5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Form Fields Found</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
          This PDF doesn't appear to contain any interactive AcroForm fields. Please upload a fillable PDF document.
        </p>
      </div>
    );
  }

  const handleChange = (name, value) => {
    onChange(name, value);
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeup w-full max-w-2xl mx-auto pb-4">
      {fields.map((field) => {
        const id = `field-${field.name}`;
        const val = formData[field.name] !== undefined ? formData[field.name] : field.value;
        const error = errors[field.name];

        return (
          <div key={field.name} className="flex flex-col gap-2.5">
            <label htmlFor={id} className="text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></span>
              {formatLabel(field.name)}
            </label>

            {field.type === 'PDFTextField' && (
              <div>
                <input
                  id={id}
                  type="text"
                  value={val || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`w-full bg-slate-100 dark:bg-slate-800/80 border ${error ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-300 dark:border-slate-600 focus:ring-teal-500/30 focus:border-teal-500 hover:border-slate-400 dark:hover:border-slate-400'} text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium`}
                  style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '16px', paddingBottom: '16px' }}
                  placeholder={`Enter ${formatLabel(field.name)}`}
                />
                {error && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{error}</p>}
              </div>
            )}

            {field.type === 'PDFCheckBox' && (
              <label 
                className={`flex items-center gap-4 rounded-xl cursor-pointer transition-all border ${val ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.1)]' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500'} group`}
                style={{ padding: '16px' }}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={!!val}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    className="peer w-6 h-6 rounded border-slate-400 dark:border-slate-400 text-teal-500 focus:ring-teal-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 bg-white dark:bg-slate-700 cursor-pointer appearance-none checked:bg-teal-500 checked:border-teal-500 transition-all shadow-sm"
                  />
                  <svg className="absolute w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-white dark:text-white transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className={`select-none font-semibold transition-colors ${val ? 'text-teal-700 dark:text-teal-300' : 'text-slate-600 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                  {formatLabel(field.name)}
                </span>
              </label>
            )}

            {field.type === 'PDFRadioGroup' && (
              <div className="flex flex-col gap-3">
                {field.options.map(opt => (
                  <label 
                    key={opt} 
                    className={`flex items-center gap-4 rounded-xl cursor-pointer transition-all border ${val === opt ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.1)]' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500'} group`}
                    style={{ padding: '16px' }}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name={field.name}
                        value={opt}
                        checked={val === opt}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="peer w-5 h-5 rounded-full border-slate-400 dark:border-slate-400 text-teal-500 focus:ring-teal-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 bg-white dark:bg-slate-700 cursor-pointer appearance-none checked:border-teal-500 transition-all shadow-sm"
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-teal-500 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className={`select-none font-semibold transition-colors ${val === opt ? 'text-teal-700 dark:text-teal-300' : 'text-slate-600 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{cleanPdfString(opt)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
