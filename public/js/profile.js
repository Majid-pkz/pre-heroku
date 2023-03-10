

const profileFormHandler = async (event) => {
  event.preventDefault();

  const firstName = document.querySelector('#first-name').value.trim();
  const lastName = document.querySelector('#last-name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const dropdown = document.querySelector('#dropdown').value.trim();
  console.log(firstName, lastName, email, dropdown)
  if (firstName && lastName && email && dropdown) {
    const response = await fetch('/profile', {
      // method should be PUT since we defined it as PUT method in userRoutes
      method: 'PUT',
      body: JSON.stringify({ firstName, lastName, email, dropdown }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert(response.statusText);
    }
  }
}

const searchEl = document.querySelector('#search-btn') 
 function adsHandler(){
  console.log('click working')
  console.log(searchEl)
  fetch('api/jobs')
  // {headers: { 'Content-Type': 'application/json' }})
  .then(resp => resp.json()).then(data =>{
    console.log(data)     
   

     document.location.replace('/jobs');
  })

  

 }


 
// adsHandler();


document.querySelector('#profile-form').addEventListener('submit', profileFormHandler);


searchEl.addEventListener('click', adsHandler);