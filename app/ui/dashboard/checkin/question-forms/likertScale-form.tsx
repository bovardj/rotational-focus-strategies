interface LikertScaleFormProps {
    inputName: string;
    likertScale: [string, string, string, string, string];
    question: string;
    questionAlt?: string | null; 
    condition?: boolean | null;
  }

export default function LikertScaleForm(
  { inputName,
    likertScale,
    question,
    questionAlt: questionAlt=null,
    condition=null }: LikertScaleFormProps) {

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-150">
    <label htmlFor={inputName} className="block text-sm font-medium text-gray-700">
      { condition ? questionAlt : question }
      <span className="text-red-500">*</span>
    </label>
    <div className="mt-4 grid grid-cols-1 gap-4">
      <label className="flex items-center">
        <input
          type="radio"
          name={inputName}
          value="1"
          className="form-radio text-indigo-600"
          required
        />
        <span className="ml-2 text-sm">1 - {likertScale[0]}</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name={inputName}
          value="2"
          className="form-radio text-indigo-600"
        />
        <span className="ml-2 text-sm">2 - {likertScale[1]}</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name={inputName}
          value="3"
          className="form-radio text-indigo-600"
        />
        <span className="ml-2 text-sm">3 - {likertScale[2]}</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name={inputName}
          value="4"
          className="form-radio text-indigo-600"
        />
        <span className="ml-2 text-sm">4 - {likertScale[3]}</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name={inputName}
          value="5"
          className="form-radio text-indigo-600"
        />
        <span className="ml-2 text-sm">5 - {likertScale[4]}</span>
      </label>
    </div>
    </div>
  );
}