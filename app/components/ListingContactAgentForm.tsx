
function ListingContactAgentForm() {
    const allDetails = {
        propertyPrice: '312.000',
        agentName: 'Sofia Johns',
        stateName: 'Sofia Real State',
        agentContactNo: '+ 1 (234) 567-89-00',
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('Form submit btn clicked')
        e.preventDefault()
    }
    
  return (
    <>
     <div className=" w-full max-w-md bg-[#F2F2F2]  rounded-lg shadow-md px-8 py-9">
        <p className="mb-8 text-2xl  font-bold">
            Contact to {allDetails.agentName} </p>

           
      <form onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label htmlFor="email" className="block mb-1 text-md font-bold text-gray-900 dark:text-gray-300">Your Name</label>
              <input type="email" id="email" className=" shadow-sm bg-gray-50 border-2 border-blue-400 text-gray-900 text-lg rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="User Name" required/>
          </div>
          <div>
              <label htmlFor="subject" className="block mb-1 text-md font-bold text-gray-900 dark:text-gray-300">Your Email</label>
              <input type="text" id="subject" className="block p-3 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border-2 border-blue-400 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Email" required/>
          </div>
          <div className="sm:col-span-2">
              <label htmlFor="message" className="block mb-1 text-md font-bold text-gray-900 dark:text-gray-400">Your message</label>
              <textarea id="message" rows={4} className="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-lg shadow-sm border-2 border-blue-400 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."/>
          </div>
          
          <button type="submit" className="mt-12 text-white bg-[#2C72F6]  font-extrabold p-4 rounded-lg text-xl  inline-flex justify-center w-full text-center">Get more info about agent </button>

      </form>
       <p className="mt-6 text-[12px]  font-light text-[#848484]">
       When you send an enquiry, you accept our terms & privacy policy. Your enquiry will be sent to the estate agent shown, who will reply to you with more information.
       </p>
    </div>

    </>
  )
}
export default ListingContactAgentForm