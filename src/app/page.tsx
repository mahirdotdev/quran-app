import { SurahProps } from "@/types";
import axios from "axios";


async function getAllSurah(){
  const response = await axios.get("https://equran.id/api/v2/surat")
  return response.data.data as SurahProps[];

}


export async function generateMetadata(){
  const response = await getAllSurah()

  return {
    title: response
  }
}

export default async function Home() {
  const response = await getAllSurah()

  const data = response;

  return(<div>{JSON.stringify(data.map((a)=>a.nama))}</div>)
}
