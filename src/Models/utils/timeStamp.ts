import { Trips, TripsWithDate } from "../../types/types"

function timeStampConverter({created_at,...otherProperties}:Trips):TripsWithDate {

    if (!created_at) return {...otherProperties}

    return {created_at:new Date(created_at),...otherProperties}

}

export default timeStampConverter