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
              What went well today?
            </label>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question1"
                  value="1"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">1 - Strongly Disagree</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question1"
                  value="2"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">2 - Disagree</span>
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
                <span className="ml-2 text-sm">4 - Agree</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question1"
                  value="5"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">5 - Strongly Agree</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="question2" className="block text-sm font-medium text-gray-700">
              What could have gone better?
            </label>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question2"
                  value="1"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">1 - Strongly Disagree</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question2"
                  value="2"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">2 - Disagree</span>
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
                <span className="ml-2 text-sm">4 - Agree</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question2"
                  value="5"
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-sm">5 - Strongly Agree</span>
              </label>
            </div>
          </div>
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