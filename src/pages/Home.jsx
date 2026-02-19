import { useEffect } from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const fetchUser = async () => {
    const navigate = useNavigate();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/me`,{
          credentials:"include"
        }
      );
    //   console.log(response);
      const result = await response.json();
      console.log(result);
    //   console.log(result);
      if (!response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };


  fetchUser()
//   useEffect(() => {
//     fetchUser();
//   },[]);


  return <div>home</div>;
};

export default Home;
