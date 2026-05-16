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
  questionAlt: questionAlt = null,
  condition = null,
}: LikertScaleFormProps) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-200">
      <p className="text-sm font-medium text-gray-700">
        {condition ? questionAlt : question}
        <span className="text-red-500">*</span>
      </p>
      <div className="mt-3 flex gap-1.5">
        {likertScale.map((label, i) => {
          const value = String(i + 1);
          const id = `${inputName}_${value}`;
          return (
            <label key={i} htmlFor={id} className="flex-1 cursor-pointer">
              <input
                type="radio"
                id={id}
                name={inputName}
                value={value}
                className="sr-only peer"
                required={i === 0}
              />
              <div className="peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 border border-gray-200 rounded-md py-2 px-1 text-center hover:bg-gray-100 transition-colors select-none">
                <div className="text-sm font-semibold">{value}</div>
                <div className="text-xs leading-tight mt-0.5">{label}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
