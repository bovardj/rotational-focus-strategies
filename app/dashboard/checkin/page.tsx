import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
  
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        End of Day Check In
      </h1>
    <div className="flex justify-center">
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        <form className="space-y-6 bg-white p-6 rounded-lg shadow-md" style={{ maxWidth: '400px' }}>
          <div>
            <label htmlFor="question1" className="block text-sm font-medium text-gray-700">
              How satisfied are you with today?
            </label>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question1"
                  value="1"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">1 - Very dissatisfied</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question1"
                  value="2"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">2 - Somewhat dissatisfied</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question1"
                  value="3"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">3 - Neutral</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question1"
                  value="4"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">4 - Somewhat satisfied</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question1"
                  value="5"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">5 - Very satisfied</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="question2" className="block text-sm font-medium text-gray-700">
              How productive did you feel today?
            </label>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question2"
                  value="1"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">1 - Very unproductive</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question2"
                  value="2"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">2 - Somewhat unproductive</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question2"
                  value="3"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">3 - Neutral</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question2"
                  value="4"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">4 - Somewhat productive</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question2"
                  value="5"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">5 - Very productive</span>
              </label>
            </div>
          </div>
          {true && ( // Replace `true` with your condition
            <>
              <div>
                <label htmlFor="question3" className="block text-sm font-medium text-gray-700">
                  Did you use the assigned focus strategy today?
                </label>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="question3"
                      value="yes"
                      className="form-radio text-indigo-600"
                    />
                    <span className="ml-2 text-sm">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="question3"
                      value="no"
                      className="form-radio text-indigo-600"
                    />
                    <span className="ml-2 text-sm">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="question4" className="block text-sm font-medium text-gray-700">
                  If you didn&apos;t use the focus strategy, why not?
                </label>
                <textarea
                  id="question4"
                  name="question4"
                  rows={4}
                  maxLength={500}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Write your response here (max 500 characters)..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="question5" className="block text-sm font-medium text-gray-700">
                  Is there anything else you would like to add?
                </label>
                <textarea
                  id="question5"
                  name="question5"
                  rows={4}
                  maxLength={500}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Write your response here (max 500 characters)..."
                ></textarea>
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    </main>
  );
}