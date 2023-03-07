const adssHandler = async (event) => {
    event.preventDefault();
  
   
      const response = await fetch('/jobs');
      
     console.log(response);
        document.location.replace('/ads');
    
  };
  