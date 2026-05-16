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
    <div className="rounded-lg bg-gray-50 px-4 py-4 border border-gray-200">
      <p className="text-sm font-medium text-gray-700 mb-3">
        {condition ? questionAlt : question}
        <span className="text-red-500">*</span>
      </p>
      <div className="flex gap-2">
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
              <div className="peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 border border-gray-200 rounded-md p-2 text-center hover:bg-blue-50 hover:border-blue-300 transition-colors select-none h-full flex flex-col items-center gap-1">
                <span className="text-base font-semibold leading-none">{value}</span>
                <span className="text-[11px] leading-tight">{label}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
