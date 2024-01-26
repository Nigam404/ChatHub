//DRIVER FUNCTION.........................................................................
async function login(event) {
  event.preventDefault();
  let obj = {
    mail: document.getElementById("mail").value,
    password: document.getElementById("password").value,
  };
  try {
    const response = await axios.post("http://localhost:3000/user/login", obj);
    if (response.status == 201) {
      alert(response.data.message);
    }
    console.log("Token-> ", response.data.token);
    //saving token in LS
    localStorage.setItem("ChatToken", response.data.token);
    location.replace("home.html");
  } catch (error) {
    alert(error.response.data.message);
  }
}
