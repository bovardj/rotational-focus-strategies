interface LikertScaleFormProps {
  inputName: string;
  likertScale: [string, string, string, string, string];
  question: string;
  questionAlt?: string | null;
  condition?: boolean | null;
}

export default function LikertScaleForm({
  inputName,
  likertScale,
  question,
  questionAlt = null,
  condition = null,
}: LikertScaleFormProps) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-4 border border-gray-200">
      <p className="text-sm font-medium text-gray-700 mb-3">
        {condition ? questionAlt : question}
        <span className="text-red-500">*</span>
      </p>
      <fieldset>
        <legend className="sr-only">{condition ? questionAlt : question}</legend>
        <div className="space-y-2">
          {likertScale.map((label, i) => {
            const value = String(i + 1);
            const id = `${inputName}_${value}`;
            return (
              <label
                key={i}
                htmlFor={id}
                className="flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-800 has-checked:bg-blue-50 has-checked:border-blue-800"
              >
                <input
                  type="radio"
                  id={id}
                  name={inputName}
                  value={value}
                  className="peer w-4 h-4 accent-blue-800 shrink-0"
                  required={i === 0}
                />
                <span className="text-sm text-gray-700 peer-checked:text-blue-800 peer-checked:font-medium">
                  {value} — {label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
