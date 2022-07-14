import * as React from "react";

interface Props {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  text: string
}

export const InfoModal: React.FC<Props> = ({ showModal, setShowModal, text }: Props) => {

  return (
    showModal ? (
      <>
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="relative w-auto my-6 mx-4 md:mx-auto max-w-3xl">
            <div className="border-8 border-[#ffffff42] rounded-[44px] shadow-lg relative flex flex-col lg:w-full bg-primary-700 outline-none focus:outline-none">
              <div className="relative px-10 py-6 min-w-[260px] md:min-w-[500px]">
                {/* <div className="flex m-auto justify-center">
                  <Info className='absolute w-[250px] -top-1.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
                </div> */}
                <p className="select-none mt-2 md:mt-10 text-center max-w-xs md:max-w-md md:px-14 opacity-95 font-bold text-[20px] text-white my-4 leading-relaxed">
                  {text}
                </p>
                <div className="flex justify-center">
                  <button className='m-auto select-none px-6 text-xs font-extrabold rounded-full py-2 text-white bg-primary-200' onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null
  );
}