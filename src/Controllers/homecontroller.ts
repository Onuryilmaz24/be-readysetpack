import endpointsJson from "../../endpoints.json"
import { Request,Response,NextFunction } from "express"

const homeController = (req:Request,res:Response,next:NextFunction) =>{
    res.status(200).send({endpoints:endpointsJson})
}

export default homeController