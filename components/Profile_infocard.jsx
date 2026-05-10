import React from 'react'

const Profile_infocard = ({idx}) => {
    return (
        <div className='w-[45%] h-[15%] flex justify-around items-center'>
            <div className='h-[50%] w-[40%] text-lg flex justify-start items-center font-semibold'>
                {idx.info_topic}
            </div>
            <div className='h-[50%] w-[60%] text-[#8a8a8a] flex justify-center items-center font-semibold'>
                {!idx.info ? "-N/A-":idx.info}
            </div>
        </div>
    )
}

export default Profile_infocard