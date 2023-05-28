import { default as express } from "express";
import fs from "fs/promises"
import response from '../utils/reponses.mjs';
import { approotdir } from "../approotdir.mjs";
import path from "path";


// import formidable from 'formidable';


export const router = express.Router();




 const getQuoteData = async (req, res) => {
  try {

  const {query}=req
 console.log("this is running",{query})
const subPath = 'utils';
const fileName = 'yahooapi.json';

const jsonFilePath = path.join(approotdir, subPath, fileName);
    let totaldata = await fs.readFile(jsonFilePath)//utils\yahooapi.json
    let parsedData= await JSON.parse(totaldata)

    const mappedData=parsedData.quoteResponse.result.reduce((acc,stockdata)=>{acc[stockdata.symbol]=stockdata
    return acc
    
    },{})
    let symbolsString=query?.symbols.trim()
    if(symbolsString){
      const symbolsArray=symbolsString.split(",").map(x=>x.trim())
      let queryData=symbolsArray.map(symbol=>mappedData[symbol])
      return response(res, 200, 'success', queryData);
    }else{
      return response(res, 200, 'success', parsedData.quoteResponse.result);
    }
    // console.log({mappedData})
    
  } catch (err) {
    console.log(err);
    return response(res, 500, err.message, null);
  }
};



router.get("/quotes", getQuoteData );


