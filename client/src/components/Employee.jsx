import { useEffect } from "react";
import {useParams} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export const Employee = ({setId}) =>{
    const {id} = useParams();

    const {data} = useQuery({
        queryKey: ["employee", id],
        queryFn: async()=> {
            const response = await fetch(`http://localhost:3030/employees/${id}`);
            return response.json();
        },
      });
    console.log("Employee data: ", data);
}