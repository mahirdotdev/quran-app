"use client";

import { SurahProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Surahpage() {
  const { data, isLoading, isError, error } = useQuery<SurahProps[]>({
    queryKey: ["ALL-SURAH"],
    queryFn: async () => {
      const response = await axios.get("https://equran.id/api/v2/surat");

      return response.data.data;
    },
    retry: false,
    refetchInterval: 60 * 60,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

//   const mutation = useMutation({
//     mutationKey:["inser"],
//     mutationFn:()=>{
//         return null;
//     }
//   })



  if (isLoading) {
    return <div>loading....</div>;
  }

  if (isError || error) {
    return <div>ini error</div>;
  }

  return (
    <div>
      <ul>
        {data?.map((item) => (
          <li key={`surah-${item.nomor}`}>{item.namaLatin}</li>
        ))}
      </ul>
    </div>
  );
}
