export default function Footer() {
  return (
    <>
      <footer className="overflow-hidden rounded-lg p-4 shadow dark:bg-gray-900 md:px-6 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="" className="mb-4 flex items-center sm:mb-0">
            <img src="" className="mr-3 h-8" alt="Logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              MaCo
            </span>
          </a>
          <ul className="mb-6 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 sm:mb-0">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          ©{' '}
          <a href="https://flowbite.com/" className="hover:underline">
            MaCo™
          </a>
          . All Rights Reserved.
        </span>
      </footer>
    </>
  );
}
