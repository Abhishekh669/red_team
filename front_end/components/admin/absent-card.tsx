import React from 'react'

export interface AbsentRequestType{
    codeName : string,
    createdAt : Date,
    date : Date,
    name : string,
    reason : string,
    status : "pending" | "accepted" | "rejected"
    updatedAt : Date,
    userId : string,
    _id : string,
}

function AbsentCard() {
  return (
    <div>
      
    </div>
  )
}

export default AbsentCard
