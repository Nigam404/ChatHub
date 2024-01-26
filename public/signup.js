//DRIVER FUNCTION............................................................................
async function signup(event) {
  event.preventDefault();
  let obj = {
    name: document.getElementById("name").value,
    mail: document.getElementById("mail").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value,
  };
  const responseUser = await axios.post(
    "http://localhost:3000/user/signup",
    obj
  );
  if (responseUser.status === 201) {
    alert("Successfully Signed Up !");
  } else {
    alert("User Already Exist, Please Login !");
  }
  console.log(responseUser.data);
}
