import { Link } from "react-router-dom";
import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Home(){

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
     
        axios.get('http://localhost:4000')
        .then(res => 
             {
              if(res.data.valid){

               navigate('/')
                  
              }else{
                navigate('/login')
              }
             })
        .catch(err => console.log(err))

    }, [])
    return (
         <>
         <section className="heading">
             <h1>
                 What do you need help with?
             </h1>
             <p>Please choose from an option below</p>
             </section>
             <Link to='/new-ticket' className='btn btn-reverse btn-block'> 
             <FaQuestionCircle /> Submit a new ticket
             </Link>

             <Link to='/tickets' className='btn btn-block'> 
             <FaTicketAlt /> Check your ticket status
             </Link>

         </>
    );
}

export default Home;
