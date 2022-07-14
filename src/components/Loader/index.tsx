import React from 'react'

interface Props {
  text?: string
  width: string
}

const Loader: React.FC<Props> = ({ text, width }) => {
  return (
    <div className="meter red">
      <span style={{ width: `${width}` }}></span>
      <p className="absolute w-max text-white font-extrabold text-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{text}</p>
    </div>
  )
}

export default Loader