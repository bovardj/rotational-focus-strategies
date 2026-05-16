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
      <p className="text-sm font-medium text-gray-700 mb-4">
        {condition ? questionAlt : question}
        <span className="text-red-500">*</span>
      </p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((value, i) => {
          const id = `${inputName}_${value}`;
          return (
            <label key={value} htmlFor={id} className="flex-1 cursor-pointer">
              <input
                type="radio"
                id={id}
                name={inputName}
                value={String(value)}
                className="sr-only peer"
                required={i === 0}
              />
              <div className="peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 border border-gray-300 rounded-full aspect-square flex items-center justify-center text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors select-none">
                {value}
              </div>
            </label>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 px-0.5">
        <span className="text-xs text-gray-500">{likertScale[0]}</span>
        <span className="text-xs text-gray-500">{likertScale[4]}</span>
      </div>
    </div>
  );
}
