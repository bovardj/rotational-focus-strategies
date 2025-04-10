import { useState } from "react";

interface CheckboxFormProps {
    inputName: string;
    options: string[];
    addOther?: boolean;
    otherPlaceholder?: string;
    question: string;
    questionAlt?: string | null;
    condition?: boolean | null;
  }

export default function CheckboxForm(
    {   inputName,
        options,
        addOther=false,
        otherPlaceholder: otherPlaceholder='',
        question,
        questionAlt: questionAlt=null,
        condition=null
    }: CheckboxFormProps) {

  // const [selectedValues, setSelectedValues] = useState<string[]>([]);
  // const [otherValue, setOtherValue] = useState<string>('');

  // const handleCheckboxChange = (e: { target: { value: string; }; }) => {
  //   if (selectedValues.includes(e.target.value)) {
  //     setSelectedValues(selectedValues.filter((value) => value !== e.target.value));
  //   } else {
  //     setSelectedValues([...selectedValues, e.target.value]);
  //   }
  //   console.log('Current selectedValues: ', selectedValues);
  // }

  // const handleCheckboxChange = (e: {
  //   target: { checked: boolean; value: React.SetStateAction<string>; };
  // }) => {
  //   const { value, checked: isChecked } = e.target;
  //   const checkboxes = document.getElementsByName(inputName) as NodeListOf<HTMLInputElement>;
  //   const selectedValues: string[] = [];
  //   checkboxes.forEach((checkbox) => {
  //     if (checkbox.checked) {
  //       selectedValues.push(checkbox.value);
  //     }
  //   });
  //   console.log(selectedValues);


  // }
    

  const handleOtherCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, checkbox_id: string, input_id: string) => {
    const otherCheckbox = document.getElementById(checkbox_id) as HTMLInputElement;
    const otherInput = document.getElementById(input_id) as HTMLInputElement;
    if (otherCheckbox.checked) {
      otherInput.required = true;
    } else {
      otherInput?.removeAttribute('required');
    }
  }

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-150">
      <label htmlFor={inputName} className="block text-sm font-medium text-gray-700">
        { condition ? questionAlt : question }<span className="text-red-500">*</span>
      </label> 
      <div className="text-red-500 text-sm" id={`${inputName}_error`} style={{ display: 'none' }}>
        Please select at least one option.
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {
          options.map((option, i) => (
            <label key={i} className="flex items-center">
            <input
              type="checkbox"
              name={inputName}
              value={option}
              className="form-checkbox text-indigo-600"
              // checked={selectedValues.includes(option)}
              // onChange={(e) => handleCheckboxChange(e)}
            />
            <span className="ml-2 text-sm">{option}</span>
            </label>
          ))
        }
        { addOther && (
          <label className="items-center inline-block">
            <input
              type="checkbox"
              id={`${inputName}_other_checkbox`}
              name={inputName}
              value="other"
              className="form-checkbox text-indigo-600"
              onChange={(e) => handleOtherCheckboxChange(e, `${inputName}_other_checkbox`, `${inputName}_other_input`)}
            />
            <span className="ml-2 text-sm">Other</span>
            <div className="mt-2">
              <label htmlFor={`${inputName}_other`} className="ml-4 inline-block text-sm font-medium text-gray-700">
                If other, please specify:
                <input
                  type="text"
                  id={`${inputName}_other_input`}
                  name={`${inputName}_other`}
                  className="mr-2 mt-1 inline-block w-full shadow-sm text-sm border-gray-300 rounded-md"
                  placeholder={otherPlaceholder}
                  // disabled={!selectedValues.includes("other")}
                />
              </label>
            </div>
          </label>
        )}
      </div>
    </div>
  )
}