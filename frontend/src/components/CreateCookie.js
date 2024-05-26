import { useEffect } from "react"

import Loading from './Loading';

const CreateCookie = () => {

  useEffect(() => {
    
    const fetchData = async () => {
    // Get the query parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const value = searchParams.get("cookie");

    // If the cookie value exists, send a POST request to create the cookie
    if (value) {
      try {
        const response = await fetch("http://localhost:8000/api/cookies/create?cookie=" + value, { // http://localhost:3000/create-cookie?cookie=test
          method: "POST",
        });

        if (response.ok) {
          console.log("Cookie created successfully");
          // Redirect to another page after creating the cookie
          window.location.href = 'http://localhost:3000/portal/' + value;
        } else {
          console.error("Failed to create cookie");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
    fetchData();
  }, []);

  return <Loading />;
};

export default CreateCookie;
