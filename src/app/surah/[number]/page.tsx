"use client";

import { SurahProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

export default function SurahNumberPage(){
    const params= useParams();

    const { data, isLoading, isError, error } = useQuery<SurahProps>({
        queryKey: ["ALL-SURAH", params],
        queryFn: async () => {
            const response = await axios.get(`https://equran.id/api/v2/surat/${params.number}`);

            return response.data.data;
        },

    });


    if (isLoading) {
        return <div>loading....</div>;
    }

    if (isError || error) {
        return <div>ini error</div>;
    }


    return (<div>{JSON.stringify(data)}</div>)
}
