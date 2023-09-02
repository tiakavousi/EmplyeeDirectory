import { useEffect } from "react";
import {useParams} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Employee = ({setId}) =>{
    const {id} = useParams();

    const {data: userInfo} = useQuery({
        queryFn: fetchId,
        queryKey: ["employee", id]
      });
    
    function fetchId(){
    return fetch(`http://localhost:3030/employees/${id}`).
        then(response =>{
        if(!response.status) console.log("Error");
        return response.json();
        })
        .then(data => {
        console.log("data from server: ", data);
        return data;
        })
    }

    console.log("data from Employee page: ", userInfo);

    return(
        <h1>
            employee id: {id}
        </h1>
    )
}
export default Employee;